import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCorrectionEmail } from '../src/lib/corrections.ts';

test('a correction draft preserves its recipient, page, and special characters', () => {
  const recipient = 'maintainer@example.com';
  const title = 'Forms & permits: what changed?';
  const page = 'https://bettertagaytay.org/services/business/example';
  const draft = new URL(buildCorrectionEmail(recipient, title, page));
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, recipient);
  assert.equal(
    draft.searchParams.get('subject'),
    `BetterTagaytay correction: ${title}`
  );
  assert(draft.searchParams.get('body').startsWith(`Page: ${page}\n\n`));
  assert(draft.searchParams.get('body').includes('Suggested correction:\n\n'));
});
