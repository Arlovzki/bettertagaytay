const SESSION_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createHandler({
  store,
  allowedOrigins,
  transparencyOrigins = [],
  now = Date.now,
}) {
  const counters = new Map([
    ['/', { totalId: 'total', visitPrefix: 'visit#', origins: allowedOrigins }],
    [
      '/transparency',
      {
        totalId: 'total#transparency',
        visitPrefix: 'visit#transparency#',
        origins: transparencyOrigins,
      },
    ],
  ]);
  const respond = (statusCode, body) => ({
    statusCode,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
    body: JSON.stringify(body),
  });

  return async event => {
    const method = event.requestContext?.http?.method;
    const origin = event.headers?.origin;
    if (!['GET', 'POST'].includes(method)) {
      return respond(405, { error: 'Use GET or POST' });
    }
    const counter = counters.get(event.rawPath ?? '/');
    if (!counter) {
      return respond(404, { error: 'Not found' });
    }

    try {
      if (method === 'POST') {
        if (!origin) return respond(403, { error: 'Origin required' });
        if (!counter.origins.includes(origin)) {
          return respond(403, { error: 'Origin not allowed' });
        }
        if (event.isBase64Encoded || (event.body?.length ?? 0) > 128) {
          return respond(400, { error: 'Invalid visit' });
        }
        let body;
        try {
          body = JSON.parse(event.body ?? '{}');
        } catch {
          return respond(400, { error: 'Invalid JSON' });
        }
        if (
          !body ||
          typeof body.sessionId !== 'string' ||
          !SESSION_ID.test(body.sessionId)
        ) {
          return respond(400, { error: 'Invalid session ID' });
        }
        await store.record(
          counter.totalId,
          `${counter.visitPrefix}${body.sessionId}`,
          Math.floor(now() / 1000) + 86400
        );
      }
      return respond(200, { visits: await store.total(counter.totalId) });
    } catch {
      // Never log visitor identifiers or request headers.
      console.error('Visit counter storage unavailable');
      return respond(503, { error: 'Counter temporarily unavailable' });
    }
  };
}
