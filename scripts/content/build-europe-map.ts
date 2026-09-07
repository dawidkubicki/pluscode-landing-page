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

/* WHICH COUNTRIES, not which frame. The first two versions of this file
   drew every polygon that touched a longitude/latitude box and let the SVG
   viewBox clip the rest. That is how a world map is usually framed, and it
   produced Russia, Turkey and North Africa sliced off in dead straight lines
   along three edges of the band. Dawid's words: awful, cut at the edges,
   should be countries, not a straight line.

   So the map is now a LIST. Every country below is drawn whole, nothing else
   is drawn at all, and the viewBox is fitted to the result. The outer edge of
   the drawing is therefore the outer edge of Europe itself: Iceland's coast,
   Norway's cape, the Polish and Finnish borders with Russia, the Greek
   islands, the Portuguese coast. There is no frame to cut anything.

   Russia, Turkey and the Caucasus are left out on purpose. Russia alone would
   drag the bounding box to the Pacific; Turkey is mostly not in Europe and
   would reintroduce a hard edge on its own eastern border. Ukraine, Belarus
   and Moldova stay in because their borders with Russia are the organic
   eastern edge that makes the shape read as Europe. */
const EUROPE = [
  "Iceland", "Norway", "Sweden", "Finland", "Denmark",
  "United Kingdom", "Ireland",
  "Netherlands", "Belgium", "Luxembourg", "France", "Germany",
  "Poland", "Czechia", "Slovakia", "Austria", "Switzerland",
  "Italy", "Spain", "Portugal",
  "Estonia", "Latvia", "Lithuania", "Belarus", "Ukraine", "Moldova",
  "Romania", "Bulgaria", "Hungary", "Slovenia", "Croatia",
  "Bosnia and Herz.", "Serbia", "Montenegro", "Kosovo",
  "North Macedonia", "Albania", "Greece", "Cyprus",
];

/* A ring is kept only if its centroid falls inside this box. It is NOT a
   drawing frame (nothing is clipped to it); it is how overseas territories
   are dropped. Natural Earth ships France with French Guiana, the
   Netherlands with its Caribbean islands and Norway with Svalbard in the
   same MultiPolygon, and any of those would stretch the bounding box across
   an ocean. Svalbard is the reason the north edge is 72, not 80. */
const LON_MIN = -26;
const LON_MAX = 45;
const LAT_MIN = 33;
const LAT_MAX = 72;

/* The viewBox width. Height and the origin are computed from the extent of
   the drawn countries once they are projected, so the map never distorts to
   fit a box someone picked and never carries empty margin. */
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
/* Provisional scale from the filter box. The final viewBox is fitted to the
   drawn extent below, and the paths are re-based onto it, so this only has
   to be in the right ballpark. */
const SCALE = WIDTH / (rad(LON_MAX) - rad(LON_MIN));

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

/** Centroid of a lon/lat ring, good enough to decide which side of an ocean
 *  it is on. */
function centroid(ring: number[][]): [number, number] {
  let lon = 0;
  let lat = 0;
  for (const [x, y] of ring) {
    lon += x;
    lat += y;
  }
  return [lon / ring.length, lat / ring.length];
}

type Projected = [number, number][][];

/** Projects every ring of a country that belongs to Europe proper, whole.
 *  Nothing is clipped: a ring is either drawn entire or not at all. */
function ringsFor(geometry: Geometry): Projected {
  const out: Projected = [];
  for (const ring of ringsOf(geometry)) {
    const [clon, clat] = centroid(ring);
    if (clon < LON_MIN || clon > LON_MAX || clat < LAT_MIN || clat > LAT_MAX) {
      continue;
    }
    const projected = ring.map(([lon, lat]) => project(lon, lat) as [number, number]);
    if (projected.length < 4) continue;
    if (ringArea(projected) < MIN_AREA) continue;
    const reduced = simplify(projected, 0.35);
    if (reduced.length < 3) continue;
    out.push(reduced);
  }
  return out;
}

function pathFor(rings: Projected, dx: number, dy: number): string {
  return rings
    .map(
      (ring) =>
        ring
          .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x - dx)} ${round(y - dy)}`)
          .join("") + "Z",
    )
    .join("");
}

/* The countries we work in. Everything else in the frame is drawn in the
   quiet fill, which is what makes these three read as chosen rather than as
   the only places that exist. */
const ACTIVE: Record<string, string> = {
  Poland: "PL",
  Germany: "DE",
  Italy: "IT",
  Netherlands: "NL",
  Norway: "NO",
  Sweden: "SE",
  Finland: "FI",
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

const europe = new Set(EUROPE);
const drawn: { name: string; code?: string; rings: Projected }[] = [];

for (const feature of geo.features) {
  const name = feature.properties.NAME ?? feature.properties.name;
  if (!name || !europe.has(name)) continue;
  const rings = ringsFor(feature.geometry);
  if (!rings.length) continue;
  drawn.push({ name, code: ACTIVE[name], rings });
}

const missing = EUROPE.filter((n) => !drawn.some((d) => d.name === n));
if (missing.length) {
  throw new Error(`countries in EUROPE but not in the source: ${missing.join(", ")}`);
}

/* Fit the viewBox to what was actually drawn, plus a small margin so the
   outermost coastline does not touch the edge of the svg. */
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (const d of drawn)
  for (const ring of d.rings)
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
const MARGIN = 8;
const originX = minX - MARGIN;
const originY = minY - MARGIN;
const VIEW_W = Math.round(maxX - minX + MARGIN * 2);
const VIEW_H = Math.round(maxY - minY + MARGIN * 2);

const backdrop: string[] = [];
const active: { code: string; name: string; d: string }[] = [];
for (const d of drawn) {
  const path = pathFor(d.rings, originX, originY);
  if (d.code) active.push({ code: d.code, name: d.name, d: path });
  else backdrop.push(path);
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
 * Mercator and simplified. Only the countries of Europe proper are drawn,
 * each one whole, and the viewBox is fitted to them, so the edge of the
 * drawing is the coast and the eastern borders rather than a rectangle.
 * \`backdrop\` is every drawn country we do not work in, as one path;
 * \`active\` is each country Pluscode works in on its own path so it can be
 * lit, hovered and labelled independently.
 */

/** Fitted to the drawn countries with an 8 unit margin, so the svg has no
 *  empty band and no country is cut by its edge. */
export const MAP_VIEWBOX = "0 0 ${VIEW_W} ${VIEW_H}";

/** Every country in the frame except the three below. One path, one fill. */
export const MAP_BACKDROP =
  ${JSON.stringify(backdrop.join(""))};

export type MapCountry = { code: string; name: string; d: string };

/** The countries we work in, in code order. */
export const MAP_ACTIVE: MapCountry[] = ${JSON.stringify(active, null, 2)};
`;

const out = resolve(process.cwd(), "lib/europe-map.ts");
writeFileSync(out, file, "utf8");
console.log(
  `wrote lib/europe-map.ts  viewBox 0 0 ${VIEW_W} ${VIEW_H}  active=${active
    .map((a) => a.code)
    .join(",")}  backdrop rings=${backdrop.length}  ${Math.round(
    file.length / 1024,
  )}kb`,
);
