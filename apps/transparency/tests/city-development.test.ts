import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  CITY_DEVELOPMENT,
  DEVELOPMENT_PERIODS,
  developmentPeriod,
} from '../src/lib/city-development';
import { CITY_DOCUMENTS, cityReview } from '../src/lib/city-finances';

function reviewed(id: string) {
  const review = developmentPeriod(id);
  assert.equal(review.id, id);
  assert.ok('source' in review);
  return review;
}

test('every indexed Development Fund report is summarized or identified as unavailable', () => {
  const documents = [
    ...CITY_DOCUMENTS.documents,
    ...CITY_DOCUMENTS.unavailableDocuments,
  ].filter(item => item.title === '20% Development Fund Utilization');
  assert.equal(CITY_DEVELOPMENT.periods.length, 50);
  assert.equal(DEVELOPMENT_PERIODS.length, 51);
  assert.equal(new Set(DEVELOPMENT_PERIODS.map(item => item.id)).size, 51);
  assert.deepEqual(
    documents.map(item => item.url).sort(),
    DEVELOPMENT_PERIODS.map(item =>
      'source' in item ? item.source.url : item.url
    ).sort()
  );
  assert.equal(developmentPeriod(null).id, '2026-q3');
  assert.equal(developmentPeriod('2018-annual', 2018).id, '2018-q4');
  assert.equal(developmentPeriod(null, 2020).id, '2020-annual');
  const missing = developmentPeriod('2021-q3');
  assert.equal(missing.id, '2021-q3');
  assert.equal('figures' in missing, false);
});

test('checked PDFs match their fingerprints, and calculated figures use only their cited entries', () => {
  for (const review of CITY_DEVELOPMENT.periods) {
    const { source } = review;
    const bytes = readFileSync(
      new URL(`../public${source.copyUrl}`, import.meta.url)
    );
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', review.id);
    assert.equal(bytes.length, source.bytes, review.id);
    assert.equal(
      createHash('sha256').update(bytes).digest('hex'),
      source.sha256,
      review.id
    );
    assert.ok(
      review.citedPages.every(page => page > 0 && page <= source.pages),
      review.id
    );
    for (const figure of review.figures) {
      assert.ok(review.citedPages.includes(figure.sourcePage), review.id);
      assert.equal(
        figure.centavos === null,
        figure.basis === 'not-stated',
        review.id
      );
      assert.ok(
        figure.centavos === null || Number.isSafeInteger(figure.centavos),
        review.id
      );
      if (figure.basis === 'calculated-sum') {
        assert.ok(figure.components.length > 0);
        assert.equal(
          figure.components.reduce((sum, row) => sum + row.centavos, 0),
          figure.centavos,
          review.id
        );
      } else assert.equal(figure.components.length, 0);
    }
  }
});

test('different report formats do not turn appropriations, blank cells or overlapping entries into spending totals', () => {
  const amounts = (id: string) =>
    Object.fromEntries(
      reviewed(id).figures.map(figure => [figure.id, figure.centavos])
    );
  assert.deepEqual(amounts('2014-q1'), { cost: null, incurred: null });
  assert.deepEqual(amounts('2014-q4'), {
    cost: 1249142200,
    incurred: 1249142200,
  });
  assert.deepEqual(amounts('2016-q4'), {
    appropriation: 5841108860,
    cost: 3848429400,
    incurred: 3848429400,
  });
  const annual = reviewed('2020-annual');
  assert.equal(annual.quarter, 'annual');
  assert.equal(annual.source.listingQuarter, 'Q4');
  assert.deepEqual(annual.citedPages, [1, 2]);
  assert.ok(annual.figures.every(figure => figure.sourcePage === 2));
  assert.deepEqual(amounts(annual.id), {
    cost: 8982109080,
    incurred: 6515280000,
  });
  assert.deepEqual(amounts('2023-q3'), {
    cost: 11633276880,
    incurred: 1744991532,
  });
  assert.deepEqual(amounts('2024-q4'), {
    cost: 12285607940,
    incurred: 12000000000,
    carryover: 285607940,
  });
  assert.deepEqual(amounts('2025-q4'), {
    cost: 14525100000,
    incurred: 12000000000,
  });
  assert.deepEqual(amounts('2026-q1'), {
    cost: 16618503800,
    lot: 5618400000,
    incurred: null,
  });
  assert.equal(
    amounts('2026-q3').cost,
    cityReview('2026-q3').development?.listedProjectCostCentavos
  );
});
