import { useEffect, useState } from 'react';

interface Source<T> {
  key: string;
  url: string;
  ttl: number;
  parse: (value: unknown) => T;
}

const requests = new Map<
  string,
  { expiresAt: number; promise: Promise<unknown> }
>();

async function load<T>(source: Source<T>): Promise<T> {
  try {
    const cached = JSON.parse(localStorage.getItem(source.key) ?? 'null');
    if (cached && cached.expiresAt > Date.now())
      return source.parse(cached.value);
  } catch {
    /* Ignore unavailable storage and invalid cached data. */
  }
  const existing = requests.get(source.key);
  if (existing && existing.expiresAt > Date.now())
    return existing.promise as Promise<T>;

  const promise = (async () => {
    const response = await fetch(source.url, {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Live data unavailable');
    const raw: unknown = await response.json();
    const value = source.parse(raw);
    try {
      localStorage.setItem(
        source.key,
        JSON.stringify({ value: raw, expiresAt: Date.now() + source.ttl })
      );
    } catch {
      /* The response remains usable when storage is full or blocked. */
    }
    return value;
  })().catch(error => {
    requests.delete(source.key);
    throw error;
  });
  requests.set(source.key, { expiresAt: Date.now() + source.ttl, promise });
  return promise;
}

export function useLiveData<T>(source: Source<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError(false);
    load(source).then(
      value => {
        if (active) setData(value);
      },
      () => {
        if (active) setError(true);
      }
    );
    return () => {
      active = false;
    };
  }, [source, attempt]);
  return { data, error, retry: () => setAttempt(value => value + 1) };
}

export interface WeatherData {
  temp: number;
  windspeed: number;
  weathercode: number;
}

export const weatherSource: Source<WeatherData> = {
  key: 'bt_weather_v2',
  url: 'https://api.open-meteo.com/v1/forecast?latitude=14.1153&longitude=120.9621&current_weather=true&timezone=Asia%2FManila',
  ttl: 1_800_000,
  parse(value) {
    const current = (
      value as {
        current_weather?: {
          temperature?: unknown;
          windspeed?: unknown;
          weathercode?: unknown;
        };
      } | null
    )?.current_weather;
    if (
      !current ||
      typeof current.temperature !== 'number' ||
      !Number.isFinite(current.temperature) ||
      typeof current.windspeed !== 'number' ||
      !Number.isFinite(current.windspeed) ||
      typeof current.weathercode !== 'number' ||
      !Number.isInteger(current.weathercode) ||
      current.weathercode < 0 ||
      current.weathercode > 99
    ) {
      throw new Error('Invalid weather response');
    }
    return {
      temp: Math.round(current.temperature),
      windspeed: Math.round(current.windspeed),
      weathercode: current.weathercode,
    };
  },
};

export const forexSource: Source<string> = {
  key: 'bt_forex_v2',
  url: 'https://open.er-api.com/v6/latest/PHP',
  ttl: 3_600_000,
  parse(value) {
    const rate = (value as { rates?: { USD?: unknown } } | null)?.rates?.USD;
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0)
      throw new Error('Invalid exchange rate');
    return (1 / rate).toFixed(2);
  },
};
