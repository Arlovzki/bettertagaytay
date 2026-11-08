#!/usr/bin/env python3
"""Build the Tagaytay background from public Terrain Tiles, without tracing artwork.

Install scripts/terrain/requirements.txt, then run this file from any directory.
The downloaded source tiles are cached outside the repository.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import io
import json
import math
from pathlib import Path
import tempfile
from urllib.request import Request, urlopen

import contourpy
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ZOOM = 12
INTERVAL = 25
# OSM relation 1491134 extent, plus 0.015 degrees of surrounding terrain.
CITY_BOUNDS = [120.8841843, 14.0762697, 121.0498374, 14.1669300]
BOUNDS = [120.8691843, 14.0612697, 121.0648374, 14.1819300]
WORLD = 256 * 2**ZOOM


def world_pixel(lon, lat):
    lat = math.radians(lat)
    return (
        (lon + 180) / 360 * WORLD,
        (1 - math.asinh(math.tan(lat)) / math.pi) / 2 * WORLD,
    )


def geographic(x, y):
    return (
        x / WORLD * 360 - 180,
        math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / WORLD)))),
    )


def decode(rgb):
    rgb = np.asarray(rgb, dtype=np.float64)
    return rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768


def simplify(points, tolerance=0.35):
    """Ramer-Douglas-Peucker in source pixels; retain the actual contour shape."""
    if len(points) < 3:
        return points
    keep = np.zeros(len(points), dtype=bool)
    keep[[0, -1]] = True
    pending = [(0, len(points) - 1)]
    while pending:
        start, end = pending.pop()
        if end <= start + 1:
            continue
        delta = points[end] - points[start]
        length = np.dot(delta, delta)
        section = points[start + 1 : end]
        if length:
            t = np.clip((section - points[start]) @ delta / length, 0, 1)
            distances = np.linalg.norm(
                section - (points[start] + t[:, None] * delta), axis=1
            )
        else:
            distances = np.linalg.norm(section - points[start], axis=1)
        index = int(np.argmax(distances))
        if distances[index] > tolerance:
            index += start + 1
            keep[index] = True
            pending.extend([(start, index), (index, end)])
    return points[keep]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--cache-dir",
        type=Path,
        default=Path(tempfile.gettempdir()) / "bettertagaytay-terrain-cache",
    )
    args = parser.parse_args()
    args.cache_dir.mkdir(parents=True, exist_ok=True)

    # Independent encoding and projection checks prevent silent map corruption.
    assert np.allclose(decode([[[128, 0, 0], [130, 0, 0]]]), [[0, 512]])
    assert np.allclose(geographic(*world_pixel(120.9621, 14.1153)), [120.9621, 14.1153])

    west, south, east, north = BOUNDS
    min_x, min_y = world_pixel(west, north)
    max_x, max_y = world_pixel(east, south)
    left, top = math.floor(min_x), math.floor(min_y)
    right, bottom = math.ceil(max_x), math.ceil(max_y)
    tiles = [
        (x, y)
        for y in range(top // 256, bottom // 256 + 1)
        for x in range(left // 256, right // 256 + 1)
    ]

    def read_tile(tile):
        x, y = tile
        url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{x}/{y}.png"
        cached = args.cache_dir / f"{ZOOM}-{x}-{y}.png"
        source_info = cached.with_suffix(".json")
        if not cached.exists():
            request = Request(url, headers={"User-Agent": "BetterTagaytay terrain asset generator"})
            with urlopen(request, timeout=40) as response:
                raw = response.read()
                upstream = response.headers.get("x-amz-meta-x-imagery-sources", "")
            # Validate before writing a reusable cache entry.
            Image.open(io.BytesIO(raw)).verify()
            cached.write_bytes(raw)
            source_info.write_text(json.dumps({"upstream": upstream}))
        if not source_info.exists():
            with urlopen(Request(url, method="HEAD"), timeout=30) as response:
                upstream = response.headers.get("x-amz-meta-x-imagery-sources", "")
            source_info.write_text(json.dumps({"upstream": upstream}))
        raw = cached.read_bytes()
        rgb = Image.open(io.BytesIO(raw)).convert("RGB")
        if rgb.size != (256, 256):
            raise ValueError(f"Unexpected tile dimensions: {url}")
        return x, y, decode(rgb), {
            "url": url,
            "sha256": hashlib.sha256(raw).hexdigest(),
            "upstreamSources": json.loads(source_info.read_text())["upstream"].split(", "),
        }

    origin_x, origin_y = left // 256 * 256, top // 256 * 256
    mosaic = np.full(
        ((bottom // 256 + 1) * 256 - origin_y, (right // 256 + 1) * 256 - origin_x),
        np.nan,
    )
    sources = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        for x, y, elevations, source in pool.map(read_tile, tiles):
            dx, dy = x * 256 - origin_x, y * 256 - origin_y
            mosaic[dy : dy + 256, dx : dx + 256] = elevations
            sources.append(source)
    dem = mosaic[top - origin_y : bottom - origin_y + 1, left - origin_x : right - origin_x + 1]
    if not np.isfinite(dem).all() or dem.min() < -1000 or dem.max() > 2000:
        raise ValueError("Invalid or geographically implausible elevation grid")
    upstream = {item for source in sources for item in source["upstreamSources"]}
    if any(item.split("/")[0] not in {"srtm", "gmted"} for item in upstream):
        raise ValueError(f"Review attribution for new source datasets before publishing: {upstream}")

    height, width = dem.shape
    generator = contourpy.contour_generator(z=dem, name="serial", line_type="Separate")
    paths = []
    counts = {}
    original_vertices = 0
    retained_vertices = 0
    max_residual = 0.0
    # The backdrop shows land contours, not bathymetry in the surrounding lake.
    first = max(INTERVAL, math.ceil(float(dem.min()) / INTERVAL) * INTERVAL)
    last = math.floor(float(dem.max()) / INTERVAL) * INTERVAL
    for elevation in range(first, last + 1, INTERVAL):
        count = 0
        for line in generator.lines(elevation):
            if len(line) < 3 or np.linalg.norm(np.diff(line, axis=0), axis=1).sum() < 3:
                continue
            # Check contour vertices against bilinear interpolation of the source DEM.
            x, y = line[:, 0], line[:, 1]
            x0 = np.minimum(np.floor(x).astype(int), width - 2)
            y0 = np.minimum(np.floor(y).astype(int), height - 2)
            dx, dy = x - x0, y - y0
            values = (
                dem[y0, x0] * (1 - dx) * (1 - dy)
                + dem[y0, x0 + 1] * dx * (1 - dy)
                + dem[y0 + 1, x0] * (1 - dx) * dy
                + dem[y0 + 1, x0 + 1] * dx * dy
            )
            residual = float(np.max(np.abs(values - elevation)))
            max_residual = max(max_residual, residual)
            if residual > 0.02:
                raise ValueError(f"Contour does not match source elevation: {residual}")
            original_vertices += len(line)
            line = simplify(line)
            retained_vertices += len(line)
            coordinates = "L".join(f"{x:.1f},{y:.1f}" for x, y in line)
            stroke = 1.35 if elevation % 100 == 0 else 0.8
            paths.append(
                f'<path data-elevation="{elevation}" stroke-width="{stroke}" vector-effect="non-scaling-stroke" d="M{coordinates}"/>'
            )
            count += 1
        if count:
            counts[str(elevation)] = count

    metadata = {
        "name": "Tagaytay area elevation contours",
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "Mapzen / AWS Terrain Tiles",
        "sourceUrl": "https://registry.opendata.aws/terrain-tiles/",
        "sourceDocumentation": "https://github.com/tilezen/joerd/blob/master/docs/data-sources.md",
        "attributionUrl": "https://github.com/tilezen/joerd/blob/master/docs/attribution.md",
        "credit": "SRTM and GMTED2010 terrain data courtesy of the U.S. Geological Survey, via Mapzen / AWS Terrain Tiles",
        "displayCredit": "USGS SRTM/GMTED · Mapzen",
        "areaReference": "https://www.openstreetmap.org/relation/1491134",
        "areaReferenceCredit": "OpenStreetMap contributors, ODbL",
        "cityBounds": CITY_BOUNDS,
        "requestedBounds": BOUNDS,
        "actualBounds": [*geographic(left, bottom), *geographic(right, top)],
        "projection": "EPSG:3857",
        "orientation": "north-up",
        "intervalMetres": INTERVAL,
        "minimumContourMetres": first,
        "majorIntervalMetres": 100,
        "tileZoom": ZOOM,
        "gridSize": [width, height],
        "elevationRangeMetres": [round(float(dem.min()), 2), round(float(dem.max()), 2)],
        "sampleSpacingMetres": round(math.cos(math.radians((south + north) / 2)) * 2 * math.pi * 6378137 / WORLD, 2),
        "simplificationTolerancePixels": 0.35,
        "maximumContourResidualMetresBeforeSimplification": max_residual,
        "originalVertices": original_vertices,
        "retainedVertices": retained_vertices,
        "contourCount": len(paths),
        "contoursByElevation": counts,
        "tiles": sources,
    }
    if not paths:
        raise ValueError("No contours generated")
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width-1} {height-1}" '
        'preserveAspectRatio="xMidYMid slice">\n'
        '<title>Tagaytay area elevation contours</title>\n'
        f'<desc>North-up terrain contours at {INTERVAL} metre intervals, derived from Mapzen Terrain Tiles. '
        'SRTM and GMTED2010 terrain data courtesy of the U.S. Geological Survey, via Mapzen / AWS. Coordinates are Web Mercator; the map is cropped, never stretched or repeated.</desc>\n'
        '<g fill="none" stroke="#5f8ba2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke">\n'
        + "\n".join(paths)
        + '\n</g></svg>\n'
    )
    metadata["assetSha256"] = hashlib.sha256(svg.encode()).hexdigest()
    (ROOT / "public/images/tagaytay-elevation-contours.svg").write_text(svg)
    (ROOT / "src/data/terrain.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(json.dumps({key: metadata[key] for key in ["gridSize", "elevationRangeMetres", "contourCount", "retainedVertices", "maximumContourResidualMetresBeforeSimplification"]}))


if __name__ == "__main__":
    main()
