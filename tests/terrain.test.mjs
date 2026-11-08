import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const metadata = JSON.parse(
  await readFile(new URL('../src/data/terrain.json', import.meta.url), 'utf8')
);
const svg = await readFile(
  new URL('../public/images/tagaytay-elevation-contours.svg', import.meta.url),
  'utf8'
);

test('terrain coverage contains Tagaytay and retains the source map proportions', () => {
  const [west, south, east, north] = metadata.actualBounds;
  const city = metadata.cityBounds;
  assert(west < city[0] && south < city[1]);
  assert(east > city[2] && north > city[3]);
  assert(west < 120.9621 && east > 120.9621);
  assert(south < 14.1153 && north > 14.1153);
  assert.equal(metadata.projection, 'EPSG:3857');
  assert.equal(metadata.orientation, 'north-up');
  const world = 256 * 2 ** metadata.tileZoom;
  const mercatorY = latitude =>
    ((1 - Math.asinh(Math.tan((latitude * Math.PI) / 180)) / Math.PI) / 2) *
    world;
  assert(
    Math.abs(((east - west) / 360) * world - (metadata.gridSize[0] - 1)) < 1e-6
  );
  assert(
    Math.abs(mercatorY(south) - mercatorY(north) - (metadata.gridSize[1] - 1)) <
      1e-6
  );
  assert(svg.includes('preserveAspectRatio="xMidYMid slice"'));
  assert(!svg.includes('<pattern'));
});

test('the published contour asset matches its DEM provenance and elevation checks', () => {
  assert.equal(
    createHash('sha256').update(svg).digest('hex'),
    metadata.assetSha256
  );
  const levels = [...svg.matchAll(/data-elevation="(\d+)"/g)].map(match =>
    Number(match[1])
  );
  assert.equal(levels.length, metadata.contourCount);
  assert.equal(metadata.intervalMetres, 25);
  assert(
    levels.every(level => level > 0 && level % metadata.intervalMetres === 0)
  );
  assert(metadata.maximumContourResidualMetresBeforeSimplification < 0.02);
  assert(metadata.tiles.length > 1);
  for (const tile of metadata.tiles) {
    assert.match(tile.sha256, /^[a-f0-9]{64}$/);
    assert.match(
      tile.url,
      /^https:\/\/s3\.amazonaws\.com\/elevation-tiles-prod\/terrarium\/12\/\d+\/\d+\.png$/
    );
    assert(tile.upstreamSources.length > 0);
    assert(
      tile.upstreamSources.every(source => /^(srtm|gmted)\//.test(source))
    );
  }
});
