import assert from 'node:assert/strict';
import test from 'node:test';
import {
  houseBreakdown,
  projectType,
  type InsightProject,
} from '../src/lib/insights';

const entry = (
  title: string,
  values: Partial<InsightProject> = {}
): InsightProject => ({
  dataset: 'dpwh',
  title,
  house_php: 100,
  held: false,
  ...values,
});

test('specific water and drainage work on a named road is counted once by its purpose', () => {
  assert.equal(
    projectType(entry('Construction of Drainage System along Tagaytay Road')),
    'drainage'
  );
  assert.equal(
    projectType(entry('Public Water Supply System, Road 2, Tagaytay')),
    'water'
  );
  assert.equal(
    projectType(entry('Tagaytay-Nasugbu Rd - K0085 + 000')),
    'roads'
  );
  assert.equal(
    projectType(entry('Construction of Multi-Purpose Facility (Iconic Tower)')),
    'buildings'
  );
});

test('program labels identify projects that have no sector keyword in the title', () => {
  assert.equal(
    projectType(entry('DOH DATRC - Tagaytay', { dataset: 'hfep' })),
    'health'
  );
  assert.equal(
    projectType(entry('Concreting of Brgy. Sambong FMR', { dataset: 'fmr' })),
    'roads'
  );
  assert.equal(
    projectType(entry('Tagaytay works', { dataset: 'nia' })),
    'irrigation'
  );
});

test('House amounts reconcile without including an absent House entry or losing uncertain matches', () => {
  const result = houseBreakdown([
    entry('Tagaytay Rd', { house_php: 600 }),
    entry('Drainage along Tagaytay Rd', { house_php: 300 }),
    entry('Iconic Tower facility', { house_php: 100, held: true }),
    entry('Multi-Purpose Building', { house_php: null }),
  ]);
  assert.equal(result.total, 1000);
  assert.equal(result.entries, 3);
  assert.equal(
    result.categories.reduce((sum, category) => sum + category.amount, 0),
    result.total
  );
  assert.equal(
    result.categories.reduce((sum, category) => sum + category.entries, 0),
    result.entries
  );
  assert.deepEqual(
    result.categories.map(({ id, share }) => [id, share]),
    [
      ['roads', 0.6],
      ['drainage', 0.3],
      ['buildings', 0.1],
    ]
  );
  assert.equal(
    result.categories.find(category => category.id === 'buildings')?.uncertain,
    1
  );
});

test('unrecognized titles remain visible and zero or empty totals never produce invalid percentages', () => {
  assert.equal(projectType(entry('Unspecified activity')), 'other');
  const zero = houseBreakdown([
    entry('Unspecified activity', { house_php: 0 }),
  ]);
  assert.equal(zero.entries, 1);
  assert.equal(zero.categories[0]?.share, 0);
  assert.equal(zero.categories[0]?.id, 'other');
  assert.deepEqual(houseBreakdown([]), {
    total: 0,
    entries: 0,
    categories: [],
  });
});
