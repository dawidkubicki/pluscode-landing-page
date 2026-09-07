/**
 * Generates `lib/europe-map.ts` from Natural Earth 1:110m country polygons.
 *
 * Run it with a local copy of the source geometry:
 *
 *     curl -L -o /tmp/world.json \
 *       https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
 *     node --import tsx scripts/content/build-europe-map.ts /tmp/world.json
 *
 * Natural Earth is public domain, so the generated paths ship with no
 * attribution requirement. The output is checked in: the map is a static
 * asset and nothing at runtime should depend on this script or on a network
 * fetch. Re-run it only to change the projection, the frame or the country
 * set.
 *
 * WHY A GENERATOR AND NOT A HAND-DRAWN SVG. The coastline of Europe is real
 * data. A path traced by eye reads as wrong to anybody who knows the
 * shape of the Baltic, and there is no way to review it. This projects the
 * actual polygons, so the map is either right or it is a bug in twelve lines
 * of arithmetic.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/* The frame. Longitude and latitude bounds of the drawing.
   Two things decide these four numbers, and the second one is easy to miss:

   1. The three countries we work in must sit comfortably inside it, and the
      continent must still read as a continent: the Atlantic edge at Ireland,
      the Baltic, the Mediterranean with the whole Italian peninsula, and
      enough of Turkey and North Africa that the frame looks cropped rather
      than truncated.

   2. THE RESULT HAS TO BE A WIDE BAND. Mercator stretches vertically at
      European latitudes, so a frame drawn tight around Europe comes out
      almost SQUARE: the first version of this file spanned 70 degrees of
      longitude and produced a 1000x986 map, which at seven grid columns
      rendered 844px wide and 832px TALL and swallowed the band it sits in.
      Widening the longitude span to 96 degrees and trimming the far north
      brings it to roughly 8:5, which is the proportion the band wants. The
      extra longitude is mostly the Atlantic and western Russia, and both
      read as quiet ground rather than as filler. */
const LON_MIN = -28;
const LON_MAX = 68;
const LAT_MIN = 33;
const LAT_MAX = 69;

/* The viewBox. Width is fixed and height falls out of the projection, so the
   map never distorts to fit a box someone picked. */
const WIDTH = 1000;

/** Web Mercator's y term. Standard, and the shape everyone recognises. */
function mercatorY(latDeg: number): number {
  const lat = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + lat / 2));
}

const rad = (deg: number) => (deg * Math.PI) / 180;

const yTop = mercatorY(LAT_MAX);
const yBottom = mercatorY(LAT_MIN);
/* BOTH axes in radians. Mercator's y term is a log of a tangent, which is
   dimensionless-in-radians, so x has to be longitude in RADIANS for the two
   to share a scale. Feeding it degrees instead is the classic version of
   this bug: the arithmetic still runs, and it produces a map 58 times wider
   than it is tall. One scale for both axes is also what makes the
   projection conformal, so this single constant is what keeps the
   coastlines the right shape. */
const SCALE = WIDTH / (rad(LON_MAX) - rad(LON_MIN));
const HEIGHT = Math.round((yTop - yBottom) * SCALE);

function project(lon: number, lat: number): [number, number] {
  const x = (rad(lon) - rad(LON_MIN)) * SCALE;
  const y = (yTop - mercatorY(lat)) * SCALE;
  return [x, y];
}

/** 2 decimals is about 70m at this scale, well under one screen pixel. */
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Ramer-Douglas-Peucker, so the checked-in file is a sensible size. At
 * epsilon 0.35 (about a third of a viewBox unit) the coastline keeps every
 * feature that is visible at the size this renders, and the file drops by
 * roughly half.
 */
function simplify(points: [number, number][], epsilon: number): [number, number][] {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const denom = Math.hypot(dx, dy);
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const dist =
      denom === 0
        ? Math.hypot(px - ax, py - ay)
        : Math.abs(dy * px - dx * py + bx * ay - by * ax) / denom;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= epsilon) return [points[0], points[points.length - 1]];
  return [
    ...simplify(points.slice(0, index + 1), epsilon).slice(0, -1),
    ...simplify(points.slice(index), epsilon),
  ];
}

/** Drop rings that project to less than this many square units: islets that
 *  would render as a single grey pixel and only add bytes. */
const MIN_AREA = 6;

function ringArea(points: [number, number][]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

type Geometry = {
  type: string;
  coordinates: number[][][] | number[][][][];
};

function ringsOf(geometry: Geometry): number[][][] {
  if (geometry.type === "Polygon") return geometry.coordinates as number[][][];
  if (geometry.type === "MultiPolygon")
    return (geometry.coordinates as number[][][][]).flat();
  return [];
}

function pathFor(geometry: Geometry): string {
  const parts: string[] = [];
  for (const ring of ringsOf(geometry)) {
    const projected = ring
      /* Clip generously, not to the frame: a polygon that merely crosses the
         edge must keep its outside vertices or the fill closes across the
         middle of the country. The SVG viewBox does the real clipping. */
      .filter(
        ([lon, lat]) =>
          lon > LON_MIN - 45 &&
          lon < LON_MAX + 45 &&
          lat > LAT_MIN - 25 &&
          lat < LAT_MAX + 12,
      )
      .map(([lon, lat]) => project(lon, lat) as [number, number]);
    if (projected.length < 4) continue;
    if (ringArea(projected) < MIN_AREA) continue;
    const reduced = simplify(projected, 0.35);
    if (reduced.length < 3) continue;
    const d = reduced
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)} ${round(y)}`)
      .join("");
    parts.push(`${d}Z`);
  }
  return parts.join("");
}

/* The countries we work in. Everything else in the frame is drawn in the
   quiet fill, which is what makes these three read as chosen rather than as
   the only places that exist. */
const ACTIVE: Record<string, string> = {
  Poland: "PL",
  Germany: "DE",
  Italy: "IT",
};

const source = process.argv[2];
if (!source) {
  console.error(
    "usage: node --import tsx scripts/content/build-europe-map.ts <ne_110m_admin_0_countries.geojson>",
  );
  process.exit(1);
}

type Feature = {
  properties: Record<string, string>;
  geometry: Geometry;
};

const geo = JSON.parse(readFileSync(source, "utf8")) as { features: Feature[] };

const backdrop: string[] = [];
const active: { code: string; name: string; d: string }[] = [];

for (const feature of geo.features) {
  const name = feature.properties.NAME ?? feature.properties.name;
  if (!name) continue;
  const d = pathFor(feature.geometry);
  if (!d) continue;
  const code = ACTIVE[name];
  if (code) active.push({ code, name, d });
  else backdrop.push(d);
}

active.sort((a, b) => a.code.localeCompare(b.code));

if (active.length !== Object.keys(ACTIVE).length) {
  throw new Error(
    `expected ${Object.keys(ACTIVE).length} active countries, projected ${active.length}`,
  );
}

const file = `/**
 * GENERATED by scripts/content/build-europe-map.ts. Do not edit by hand.
 *
 * Natural Earth 1:110m country polygons, public domain, projected to Web
 * Mercator and simplified. \`backdrop\` is every other country in the frame as
 * one path; \`active\` is the three countries Pluscode works in, each on its
 * own path so it can be lit, hovered and labelled independently.
 */

/** Matches the projection: width is fixed, height falls out of it. */
export const MAP_VIEWBOX = "0 0 ${WIDTH} ${HEIGHT}";

/** Every country in the frame except the three below. One path, one fill. */
export const MAP_BACKDROP =
  ${JSON.stringify(backdrop.join(""))};

export type MapCountry = { code: string; name: string; d: string };

/** The three we work in, in code order: DE, IT, PL. */
export const MAP_ACTIVE: MapCountry[] = ${JSON.stringify(active, null, 2)};
`;

const out = resolve(process.cwd(), "lib/europe-map.ts");
writeFileSync(out, file, "utf8");
console.log(
  `wrote lib/europe-map.ts  viewBox 0 0 ${WIDTH} ${HEIGHT}  active=${active
    .map((a) => a.code)
    .join(",")}  backdrop rings=${backdrop.length}  ${Math.round(
    file.length / 1024,
  )}kb`,
);
