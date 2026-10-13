import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";

/**
 * What the imagery manifests know about a file in `public/`. The manifests
 * (`public/assets/nature/manifest.json`, `public/assets/portfolio/<slug>/manifest.json`)
 * are written by the image pipeline and may be missing on a fresh checkout,
 * so they are read from disk at request time and every field is optional.
 */
export type MediaInfo = {
  /** False when the file itself is not on disk; the caller then draws no image. */
  exists: boolean;
  width: number | null;
  height: number | null;
  /** The frame's average colour, the ground to show before the image paints. */
  dominant: string | null;
  blurDataURL: string | null;
  alt: string | null;
};

type RawEntry = {
  src?: unknown;
  file?: unknown;
  width?: unknown;
  height?: unknown;
  dominant?: unknown;
  blurDataURL?: unknown;
  alt?: unknown;
};

// The files are looked up by name at request time; the comment keeps the
// bundler from tracing all of public/ into the server output for it.
const PUBLIC_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public");

const EMPTY: MediaInfo = {
  exists: false,
  width: null,
  height: null,
  dominant: null,
  blurDataURL: null,
  alt: null,
};

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** The manifest entry for one file: keyed by its name, or listed with its `src`. */
function findEntry(manifest: unknown, url: string): RawEntry | null {
  if (!manifest || typeof manifest !== "object") return null;
  const base = path.posix.basename(url);
  const name = base.replace(/\.[^.]+$/, "");
  const record = manifest as Record<string, unknown>;
  const direct = record[name] ?? record[base];
  if (direct && typeof direct === "object") return direct as RawEntry;

  const lists = [manifest, record.images, record.files, record.captures];
  for (const list of lists) {
    const entries = Array.isArray(list)
      ? list
      : list && typeof list === "object"
        ? Object.values(list)
        : [];
    for (const entry of entries) {
      if (!entry || typeof entry !== "object") continue;
      const e = entry as RawEntry;
      if (e.src === url || e.file === base || e.src === base) return e;
    }
  }
  return null;
}

/**
 * Looks up a site-relative image (`/assets/...`) on disk and in the manifest
 * beside it. Never throws. A URL that is not a file in `public/` (a CMS
 * upload, another origin) comes back as existing with nothing known about it.
 */
export function mediaInfo(url: string, locale: Locale = "en"): MediaInfo {
  if (!url.startsWith("/assets/")) return { ...EMPTY, exists: true };

  const clean = url.split("?")[0];
  const file = path.join(PUBLIC_DIR, clean);
  let exists = false;
  try {
    exists = fs.statSync(file).isFile();
  } catch {
    exists = false;
  }

  const entry = findEntry(readJson(path.join(path.dirname(file), "manifest.json")), clean);
  if (!entry) return { ...EMPTY, exists };

  const num = (v: unknown) => (typeof v === "number" && v > 0 ? v : null);
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);
  const alt =
    entry.alt && typeof entry.alt === "object"
      ? str((entry.alt as Record<string, unknown>)[locale]) ??
        str((entry.alt as Record<string, unknown>).en)
      : str(entry.alt);

  return {
    exists,
    width: num(entry.width),
    height: num(entry.height),
    dominant: str(entry.dominant),
    blurDataURL: str(entry.blurDataURL),
    alt,
  };
}

/**
 * The image optimizer only fetches paths on this site, and it rasterises
 * nothing useful out of an SVG. Anything else is passed through untouched
 * rather than failing the render.
 */
export function passthrough(url: string): boolean {
  return !url.startsWith("/") || /\.svg(\?|$)/i.test(url);
}
