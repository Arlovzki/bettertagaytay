const SESSION_KEY = 'bt_visit_session';
const SESSION_DURATION = 30 * 60 * 1000;
let request: Promise<number> | undefined;

function sessionId() {
  let session: { id: string; createdAt: number } | undefined;
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    if (
      stored &&
      typeof stored.id === 'string' &&
      /^[0-9a-f-]{36}$/i.test(stored.id) &&
      typeof stored.createdAt === 'number' &&
      Date.now() >= stored.createdAt &&
      Date.now() - stored.createdAt < SESSION_DURATION
    ) {
      session = stored;
    }
  } catch {
    /* Ignore invalid or unavailable storage. */
  }
  session ??= { id: crypto.randomUUID(), createdAt: Date.now() };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* In-memory deduplication still works without storage. */
  }
  return session.id;
}

export function loadVisitCount(): Promise<number> {
  if (request) return request;
  request = (async () => {
    const configResponse = await fetch('/site-config.json', {
      signal: AbortSignal.timeout(8000),
    });
    if (!configResponse.ok)
      throw new Error('Counter configuration unavailable');
    const config = await configResponse.json();
    const endpoint =
      import.meta.env.VITE_VISIT_COUNTER_URL || config.visitCounterUrl;
    if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
      throw new Error('Counter endpoint unavailable');
    }
    const preview =
      import.meta.env.DEV ||
      ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    const response = await fetch(endpoint, {
      method: preview ? 'GET' : 'POST',
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      ...(preview
        ? {}
        : {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sessionId() }),
          }),
    });
    if (!response.ok) throw new Error('Counter unavailable');
    const data = await response.json();
    if (!Number.isSafeInteger(data.visits) || data.visits < 0) {
      throw new Error('Invalid visit count');
    }
    return data.visits;
  })().catch(error => {
    request = undefined;
    throw error;
  });
  return request;
}
