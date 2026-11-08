# Tagaytay elevation contours

The background comes from a digital elevation model covering Tagaytay and a small surrounding buffer. It is not hand-drawn contour artwork.

## Rebuild

Use Python 3.12 or newer in a virtual environment:

```sh
python3 -m venv /tmp/bettertagaytay-terrain-env
/tmp/bettertagaytay-terrain-env/bin/pip install -r scripts/terrain/requirements.txt
/tmp/bettertagaytay-terrain-env/bin/python scripts/terrain/generate_contours.py
```

The script caches downloaded public tiles in the system temporary directory. Use `--cache-dir` to choose another location. Generated outputs are:

- `public/images/tagaytay-elevation-contours.svg`
- `src/data/terrain.json`

Regenerate these together. The metadata includes the SVG checksum and the source tile URLs, checksums and upstream dataset names from the provider's `x-amz-meta-x-imagery-sources` headers.

## Geography and processing

- Area reference: [Tagaytay, OpenStreetMap relation 1491134](https://www.openstreetmap.org/relation/1491134), credited to OpenStreetMap contributors under ODbL. Its extent was retrieved on 6 November 2026.
- Input: [Mapzen Terrain Tiles on AWS](https://registry.opendata.aws/terrain-tiles/), Terrarium encoding, zoom 12.
- Confirmed upstream files: SRTM `N14E120.tif`, SRTM `N14E121.tif`, and GMTED2010 `10N120E_20101117_gmted_mea075.tif`. These datasets are supplied by USGS. See [provider attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md) and [data sources](https://github.com/tilezen/joerd/blob/master/docs/data-sources.md).
- Coverage includes the city extent plus a 0.015 degree buffer. The grid has 571 columns and 365 rows, with about 37 m between samples at this latitude. This is source sampling, not a claim of survey accuracy.
- Projection: Web Mercator, north-up. The SVG retains the map's proportions. Responsive layouts crop the view; they do not repeat, rotate or stretch the map.
- Contours: 25 m vertical intervals, with heavier lines every 100 m. Below-zero and zero contours are omitted because this background shows land terrain rather than the surrounding lake's bathymetry.
- Source vertices are checked against bilinear interpolation of the DEM, with a 0.02 m numerical tolerance. This checks extraction arithmetic, not the accuracy of the original measurements.
- Cartographic simplification: at most 0.35 source pixels, about 13 m horizontally. The source elevations are not smoothed or fabricated.

The checked-in asset has 259 contour segments. SRTM/GMTED are historical terrain datasets, not a current city survey or an official cadastral map. The footer carries the elevation data credit and contour interval. This method keeps the website independent of runtime map APIs or API keys.
