import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { getTableData } from '../src/lib/tableData.ts';

test('mobile rows retain links, emphasis, and the original column grouping', () => {
  const link = h(
    'a',
    { href: 'https://www.tagaytay.gov.ph/downloads.html' },
    'Download'
  );
  const label = h('strong', null, 'Business permit');
  const table = [
    h(
      'thead',
      { key: 'head' },
      h('tr', null, h('th', null, 'Document'), h('th', null, 'Source'))
    ),
    h(
      'tbody',
      { key: 'body' },
      h('tr', null, h('td', null, [label, ' form']), h('td', null, link))
    ),
  ];
  const data = getTableData(table);
  assert.deepEqual(data.headers, ['Document', 'Source']);
  assert.equal(data.rows.length, 1);
  assert.equal(data.rows[0].length, 2);
  assert.equal(data.rows[0][1], link);
  assert.equal(data.rows[0][0][0], label);
});

test('custom markdown components are read through their semantic node names', () => {
  const Component = () => null;
  const cell = h(Component, { node: { tagName: 'td' } }, 'Retained content');
  const row = h(Component, { node: { tagName: 'tr' } }, cell);
  assert.deepEqual(getTableData(row).rows, [['Retained content']]);
});
