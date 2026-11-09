const SESSION_DURATION = 30 * 60 * 1000;
const SESSION_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sessionId(sessionKey: string) {
  const now = Date.now();
  try {
    const stored = JSON.parse(sessionStorage.getItem(sessionKey) ?? 'null');
    if (
      typeof stored?.id === 'string' &&
      SESSION_ID.test(stored.id) &&
      typeof stored.createdAt === 'number' &&
      now >= stored.createdAt &&
      now - stored.createdAt < SESSION_DURATION
    ) {
      return stored.id;
    }
  } catch {
    /* Ignore invalid or unavailable storage. */
  }
  const id = crypto.randomUUID();
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify({ id, createdAt: now }));
  } catch {
    /* The in-memory request still deduplicates visits within this page. */
  }
  return id;
}

export function createVisitCounter({
  getEndpoint,
  sessionKey,
  readOnly,
}: {
  getEndpoint: () => string | Promise<string>;
  sessionKey: string;
  readOnly: boolean;
}): () => Promise<number> {
  let request: Promise<number> | undefined;

  return () => {
    request ??= (async () => {
      const endpoint = await getEndpoint();
      if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
        throw new Error('Counter endpoint unavailable');
      }
      const preview =
        readOnly ||
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
              body: JSON.stringify({ sessionId: sessionId(sessionKey) }),
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
  };
}
