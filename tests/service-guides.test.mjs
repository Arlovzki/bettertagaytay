import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { popularTasks } from '../src/data/popularTasks.ts';
import { readServiceGuide, formatSourceDate } from '../src/lib/serviceGuide.ts';

test('each homepage service task resolves to a complete guide with preparation and provenance', () => {
  const tasks = popularTasks.filter(task => task.href.startsWith('/services/'));
  assert.equal(tasks.length, 5);
  for (const task of tasks) {
    const relative = task.href.replace(/^\/services\//, '');
    const content = fs.readFileSync(
      new URL(`../content/services/${relative}.md`, import.meta.url),
      'utf8'
    );
    const data = JSON.parse(
      fs.readFileSync(
        new URL(`../content/services/${relative}.json`, import.meta.url)
      )
    );
    const guide = readServiceGuide(data.guide);
    assert(guide, task.key);
    assert(guide.checklist.length > 0);
    assert(content.includes('## Steps'));
  }
});

test('the scholarship guide is specific to Tagaytay and names the verified college contact', () => {
  const content = fs.readFileSync(
    new URL(
      '../content/services/education/apply-for-local-scholarships.md',
      import.meta.url
    ),
    'utf8'
  );
  assert(content.includes('scholarship@citycollegeoftagaytay.edu.ph'));
  assert(!/Lapu|Mactan|King-Chan|Junard|LCIC|LLCC/.test(content));
});

test('malformed metadata falls back safely and unsafe contact or form URLs are rejected', () => {
  assert.equal(readServiceGuide(undefined), null);
  const data = JSON.parse(
    fs.readFileSync(
      new URL(
        '../content/services/education/apply-for-local-scholarships.json',
        import.meta.url
      )
    )
  );
  assert.equal(
    readServiceGuide({ ...data.guide, contactUrl: 'javascript:alert(1)' }),
    null
  );
  const guide = readServiceGuide({
    ...data.guide,
    forms: [{ label: 'Unsafe', url: 'javascript:alert(1)' }],
  });
  assert.deepEqual(guide.forms, []);
});

test('source dates remain calendar dates regardless of viewer time zone', () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    assert.equal(formatSourceDate('2026-11-06', 'en'), 'Nov 6, 2026');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
