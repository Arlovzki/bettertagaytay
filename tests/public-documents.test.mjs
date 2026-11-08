import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  documentTypes,
  filterDocuments,
  readDocumentFilters,
} from '../src/lib/publicDocuments.ts';

const records = JSON.parse(
  fs.readFileSync(new URL('../src/data/documents.json', import.meta.url))
);
const years = [
  ...new Set(records.map(record => record.year).filter(year => year !== null)),
];
const filters = query => readDocumentFilters(new URLSearchParams(query), years);

test('type, year, quarter, and search narrow the same result set', () => {
  const results = filterDocuments(
    records,
    filters('type=financial-report&year=2026&quarter=3&q=cash')
  );
  assert(results.length > 0);
  assert(
    results.every(
      record =>
        record.type === 'financial-report' &&
        record.year === 2026 &&
        record.quarter === 3 &&
        record.title.toLowerCase().includes('cash')
    )
  );
  assert.equal(
    filterDocuments(records, filters('type=form&quarter=3')).length,
    0
  );
});

test('query text uses all words without interpreting regular expression syntax', () => {
  const results = filterDocuments(records, filters('q=BUILDING%20permit'));
  assert(results.length > 0);
  assert.equal(filterDocuments(records, filters('q=%5B%5B%5B')).length, 0);
  assert.equal(
    filterDocuments(records, filters('q=no-such-document-59423')).length,
    0
  );
});

test('unsupported filters are reported and cannot silently exclude every record', () => {
  const value = filters('type=unknown&year=1999&quarter=9');
  assert.equal(value.invalid, true);
  assert.equal(value.type, '');
  assert.equal(value.year, '');
  assert.equal(value.quarter, '');
  assert.equal(filterDocuments(records, value).length, records.length);
});

test('catalogue entries retain distinct official PDFs, provenance, and valid periods', () => {
  assert.equal(new Set(records.map(record => record.url)).size, records.length);
  assert.equal(new Set(records.map(record => record.id)).size, records.length);
  for (const record of records) {
    assert(documentTypes.includes(record.type));
    assert.equal(new URL(record.url).hostname, 'www.tagaytay.gov.ph');
    assert.equal(new URL(record.sourceUrl).hostname, 'www.tagaytay.gov.ph');
    assert.match(record.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    if (record.quarter !== null) {
      assert([1, 2, 3, 4].includes(record.quarter));
      assert.notEqual(record.year, null);
    }
  }
  const application = records.find(record =>
    record.url.endsWith('/Application-Form-for-Business-Permit.pdf')
  );
  assert.equal(application.type, 'form');
});
