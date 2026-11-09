import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from './handler.mjs';

const origin = 'https://bettertagaytay.org';
const portalOrigin = 'https://transparency.bettertagaytay.org';
const first = '12345678-1234-4234-8234-123456789abc';
const second = '87654321-1234-4234-9234-123456789abc';
const event = (method, body, headers = { origin }) => ({
  requestContext: { http: { method } },
  rawPath: '/',
  headers,
  body: body === undefined ? undefined : JSON.stringify(body),
});

function setup() {
  const sessions = new Set();
  const totals = new Map([['total', 7]]);
  const handler = createHandler({
    allowedOrigins: [origin],
    transparencyOrigins: [portalOrigin],
    store: {
      async record(totalId, id, expiresAt) {
        assert.equal(expiresAt, 86401);
        if (!sessions.has(id)) {
          sessions.add(id);
          totals.set(totalId, (totals.get(totalId) ?? 0) + 1);
        }
      },
      async total(totalId) {
        return totals.get(totalId) ?? 0;
      },
    },
    now: () => 1000,
  });
  return handler;
}

test('a shared total counts different sessions but deduplicates refreshes and concurrent retries', async () => {
  const handler = setup();
  assert.deepEqual(JSON.parse((await handler(event('GET'))).body), {
    visits: 7,
  });
  await Promise.all(
    Array.from({ length: 10 }, () =>
      handler(event('POST', { sessionId: first }))
    )
  );
  assert.deepEqual(
    JSON.parse((await handler(event('POST', { sessionId: second }))).body),
    { visits: 9 }
  );
  assert.deepEqual(JSON.parse((await handler(event('GET'))).body), {
    visits: 9,
  });
});

test('the portal starts with its own total and deduplicates independently of the main site', async () => {
  const handler = setup();
  const portal = (method, body, writeOrigin = portalOrigin) => ({
    ...event(method, body, { origin: writeOrigin }),
    rawPath: '/transparency',
  });
  assert.deepEqual(
    JSON.parse((await handler({ ...portal('GET'), headers: {} })).body),
    { visits: 0 }
  );
  await handler(event('POST', { sessionId: first }));
  const results = await Promise.all(
    Array.from({ length: 5 }, () =>
      handler(portal('POST', { sessionId: first }))
    )
  );
  for (const result of results) {
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), { visits: 1 });
  }
  assert.equal(
    (await handler(portal('POST', { sessionId: second }, origin))).statusCode,
    403
  );
  assert.equal(
    (
      await handler(
        event('POST', { sessionId: second }, { origin: portalOrigin })
      )
    ).statusCode,
    403
  );
  assert.deepEqual(JSON.parse((await handler(portal('GET'))).body), {
    visits: 1,
  });
  assert.deepEqual(JSON.parse((await handler(event('GET'))).body), {
    visits: 8,
  });
});

test('disallowed origins, malformed bodies, and unsupported methods cannot increment', async () => {
  const handler = setup();
  assert.equal(
    (
      await handler(
        event('POST', { sessionId: first }, { origin: 'https://example.com' })
      )
    ).statusCode,
    403
  );
  assert.equal(
    (await handler(event('POST', { sessionId: first }, {}))).statusCode,
    403
  );
  assert.equal(
    (await handler(event('POST', { sessionId: 'invalid' }))).statusCode,
    400
  );
  assert.equal(
    (await handler({ ...event('POST'), body: '{' })).statusCode,
    400
  );
  assert.equal(
    (await handler({ ...event('POST'), body: 'a'.repeat(129) })).statusCode,
    400
  );
  assert.equal((await handler(event('POST', null))).statusCode, 400);
  assert.equal((await handler(event('DELETE'))).statusCode, 405);
  assert.equal(
    (await handler({ ...event('GET'), rawPath: '/other' })).statusCode,
    404
  );
  assert.deepEqual(JSON.parse((await handler(event('GET'))).body), {
    visits: 7,
  });
});

test('storage errors return an unavailable state, never a fabricated zero', async () => {
  const handler = createHandler({
    allowedOrigins: [origin],
    store: {
      async record() {
        throw new Error('Offline');
      },
      async total() {
        throw new Error('Offline');
      },
    },
  });
  const response = await handler(event('GET'));
  assert.equal(response.statusCode, 503);
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal('visits' in JSON.parse(response.body), false);
});
