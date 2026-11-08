# Image and terrain credits

## Tagaytay landscape photograph

`tagaytay-ridge-480.webp`, `tagaytay-ridge-960.webp`, and
`tagaytay-ridge-1440.webp` are resized WebP versions of:

**Taal Lake, volcano island view Maharlika West (Tagaytay, Cavite; 05-07-2023).jpg**

- Photographer: Patrickroque01
- Source: <https://commons.wikimedia.org/wiki/File:Taal_Lake,_volcano_island_view_Maharlika_West_(Tagaytay,_Cavite;_05-07-2023).jpg>
- License: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
- Changes: resized and converted to WebP; the website crops the display to fit responsive containers. No scene elements were added or removed.
- These versions retain CC BY-SA 4.0. This photograph's license takes precedence over the site's general content license.

The homepage includes the photographer, source, license link and notice of resizing/cropping in its visible caption. Keep that credit when reusing the photograph.

This entry covers only the three files named above. Other existing tourism images have not had their attribution audited in this release.

## Elevation contour asset

`tagaytay-elevation-contours.svg` is generated from [Mapzen / AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/).

SRTM and GMTED2010 terrain data courtesy of the U.S. Geological Survey, via Mapzen / AWS Terrain Tiles. See the provider's [source attribution and terms](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).

The area reference is [Tagaytay, OpenStreetMap relation 1491134](https://www.openstreetmap.org/relation/1491134), credited to OpenStreetMap contributors under ODbL. The background includes the mapped city extent plus a small buffer; it does not display an official administrative boundary.

The asset is derived from elevation samples and is separate from the CC BY-SA photograph above. Its source tile identifiers, checksums, projection, extent, contour interval and processing checks are in `src/data/terrain.json`. Rebuild instructions are in [the terrain notes](../../scripts/terrain/README.md).
