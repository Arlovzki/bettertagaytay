import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  CITY_DOCUMENTS,
  CITY_FINANCES,
  centavos,
  cityReview,
  citySource,
  developmentCoverage,
  filterCityDocuments,
  percent,
} from '../src/lib/city-finances';

test('every reviewed period reconciles its published breakdowns without mixing report formats', () => {
  assert.equal(CITY_FINANCES.periods.length, 26);
  assert.equal(
    new Set(CITY_FINANCES.periods.map(period => period.id)).size,
    26
  );
  for (const period of CITY_FINANCES.periods) {
    const source = citySource(period.sourceId);
    const income = period.metrics.find(metric =>
      ['income', 'receipts'].includes(metric.id)
    );
    const expenditure = period.metrics.find(metric =>
      ['operating', 'expenditure'].includes(metric.id)
    );
    assert.equal(
      period.incomeBreakdown.rows.reduce((sum, row) => sum + row.centavos, 0),
      income?.centavos,
      period.id
    );
    assert.equal(
      period.incomeBreakdown.totalCentavos,
      income?.centavos,
      period.id
    );
    if (period.expenseBreakdown) {
      assert.equal(
        period.expenseBreakdown.rows.reduce(
          (sum, row) => sum + row.centavos,
          0
        ),
        expenditure?.centavos,
        period.id
      );
      assert.equal(
        period.expenseBreakdown.totalCentavos,
        expenditure?.centavos,
        period.id
      );
    } else assert.equal(expenditure?.centavos, null);
    assert.ok(
      period.citedPages.every(page => page > 0 && page <= source.pages)
    );
    for (const metric of period.metrics) {
      assert.ok(
        metric.centavos === null || Number.isSafeInteger(metric.centavos)
      );
      assert.ok(metric.sourcePage > 0 && metric.sourcePage <= source.pages);
    }
  }
  assert.equal(
    cityReview('2023-q1').metrics.find(metric => metric.id === 'capital')
      ?.centavos,
    null
  );
  assert.equal(
    cityReview('2019-q1').metrics.find(metric => metric.id === 'expenditure')
      ?.centavos,
    null
  );
  assert.equal(
    cityReview('2024-q4').metrics.find(metric => metric.id === 'capital')
      ?.centavos,
    56548679362
  );
  assert.equal(
    cityReview('2017-annual').metrics.find(
      metric => metric.id === 'expenditure'
    )?.centavos,
    96783412149
  );
  assert.equal(
    cityReview('2018-annual').metrics.find(
      metric => metric.id === 'expenditure'
    )?.centavos,
    136149519167
  );
  assert.equal(percent(0, 0), 0);
});

test('period selection uses the dates inside PDFs rather than their listing years', () => {
  assert.equal(cityReview(null).id, '2026-q3');
  assert.equal(cityReview('invalid-period').id, '2026-q3');
  const annual = cityReview('2019-annual');
  assert.equal(annual.year, 2019);
  assert.equal(citySource(annual.sourceId).listingYear, 2020);
  const embedded = cityReview('2017-q1');
  assert.equal(citySource(embedded.sourceId).listingYear, 2016);
  assert.deepEqual(embedded.citedPages, [5, 6]);
  assert.equal(cityReview('2022-annual').metrics[0]?.label, 'Total receipts');
  assert.equal(cityReview('2026-q2').metrics[0]?.label, 'Operating income');
});

test('development costs exclude the balance row and unknown incurred amounts remain distinct from zero', () => {
  const development = cityReview('2026-q3').development;
  assert.ok(development);
  const result = developmentCoverage(development.projects);
  assert.equal(development.projects.length, 20);
  assert.equal(result.listedCost, development.listedProjectCostCentavos);
  assert.equal(
    result.listedCost + development.balanceRowCentavos,
    development.printedTotalCentavos
  );
  assert.equal(result.reportedRows, 1);
  assert.equal(result.missingRows, 19);
  assert.equal(result.reportedIncurred, 5618400000);
  assert.equal(
    development.projects.every(project => project.completionPercent === null),
    true
  );
  assert.deepEqual(
    developmentCoverage([
      { costCentavos: 100, incurredCentavos: 0 },
      { costCentavos: 200, incurredCentavos: null },
    ]),
    { listedCost: 300, reportedRows: 1, missingRows: 1, reportedIncurred: 0 }
  );
  assert.equal(centavos(null), 'Not stated in report');
  assert.equal(centavos(0), '₱0.00');
  assert.equal(centavos(103800), '₱1,038.00');
  assert.throws(() => centavos(0.1));
  assert.equal(cityReview('2025-q2').development, null);
});

test('all checked copies match their reviewed source fingerprints and all sources are in the library', () => {
  assert.equal(CITY_FINANCES.sources.length, 23);
  for (const source of CITY_FINANCES.sources) {
    const data = readFileSync(
      new URL(`../public${source.copyUrl}`, import.meta.url)
    );
    assert.equal(data.subarray(0, 5).toString(), '%PDF-');
    assert.equal(data.length, source.bytes);
    assert.equal(
      createHash('sha256').update(data).digest('hex'),
      source.sha256
    );
    assert.ok(
      CITY_DOCUMENTS.documents.some(document => document.url === source.url)
    );
  }
});

test('the multi-year library supports combined filters without exposing placeholders', () => {
  const documents = CITY_DOCUMENTS.documents;
  assert.equal(
    new Set(documents.map(document => document.url)).size,
    documents.length
  );
  assert.equal(
    new Set(documents.map(document => document.id)).size,
    documents.length
  );
  assert.equal(
    documents.length + CITY_DOCUMENTS.unavailableDocuments.length,
    207
  );
  assert.equal(
    documents.filter(document => document.listingYear === 2026).length,
    34
  );
  assert.equal(
    [...documents, ...CITY_DOCUMENTS.unavailableDocuments].filter(
      document => document.listingYear === 2025
    ).length,
    43
  );
  assert.ok(
    documents.every(
      document =>
        document.bytes > 0 &&
        new URL(document.url).hostname === 'www.tagaytay.gov.ph' &&
        document.url.endsWith('.pdf')
    )
  );
  const filtered = filterCityDocuments(documents, {
    query: '  CASH flows ',
    quarter: 'Q2',
    type: 'Statement of Cash Flows',
    year: '2025',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.listingYear, 2025);
  assert.equal(filtered[0]?.quarter, 'Q2');
  assert.equal(
    filterCityDocuments(documents, {
      query: 'no matching document',
      quarter: '',
      type: '',
    }).length,
    0
  );
  assert.equal(
    filterCityDocuments(documents, { query: '', quarter: '', type: '' }).length,
    documents.length
  );
});

test('hosting rewrites app routes while preserving source PDFs and other static assets', () => {
  const terraform = readFileSync(
    new URL('../../../terraform/hosting/main.tf', import.meta.url),
    'utf8'
  );
  const source = terraform.match(/source\s*=\s*("<\/.*?\/>")/);
  assert.ok(source?.[1], 'The hosting SPA rule must be present');
  const decoded: unknown = JSON.parse(source[1]);
  assert.ok(typeof decoded === 'string');
  const rule = new RegExp(decoded.slice(2, -2));
  assert.equal(rule.test('/city-finances'), true);
  assert.equal(rule.test('/services/business'), true);
  assert.equal(rule.test('/projects/dpwh/a-project'), true);
  for (const path of [
    '/city-finances/2026-q3/receipts-q3-2026.pdf',
    '/brand/tagaytay-ridge-960.webp',
    '/assets/index.js',
    '/brand/terrain-attribution.txt',
  ])
    assert.equal(rule.test(path), false, path);
});
