import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import type { Dictionary } from "./i18n/dictionaries";
import { img } from "./team";

/* ------------------------------------------------------------------ *
 *  THE HOME HERO PLAYLIST, read out of Payload.
 *
 *  One reader, returning EXACTLY the shape the hero renders. The type is
 *  taken off the dictionary rather than declared again, so a slide from the
 *  CMS and a slide from dictionaries/{en,pl,de}.json are the same object and
 *  the component never learns which it got.
 *
 *  IT CAN RETURN null, AND THAT IS THE NORMAL PATH, not the failure one. The
 *  site is built in CI with no DATABASE_URI at all: findDocs answers null
 *  rather than throwing, this returns null in turn, the page passes nothing
 *  down and the hero renders the slides built into the dictionary. A fresh
 *  database, an empty collection, or every slide unticked all land in the
 *  same place. The first screen of the site is the one that can never be
 *  blank, so it is the one that leans hardest on this.
 *
 *  A HALF FILLED ROW IS DROPPED RATHER THAN SHOWN. A slide with no clip is a
 *  black rectangle and a slide with no headline is a video with no point, so
 *  an incomplete row is skipped. If dropping them empties the playlist the
 *  dictionary takes the whole hero back, rather than the page showing one
 *  good slide and one broken one.
 *
 *  THE PATHS ARE CHECKED AGAIN HERE. collections/HeroSlides.ts validates them
 *  on save, but that only covers rows written through the admin: a row
 *  inserted by a script, a migration or by hand has never been through it.
 *  These strings end up in a `src` attribute on the first screen of the site,
 *  so they are checked at the point of use as well as at the point of entry.
 * ------------------------------------------------------------------ */

/** One slide, exactly as the hero renders it. */
export type HeroSlide = Dictionary["heroSlides"]["slides"][number];

/** A Payload upload relation, as `img()` accepts it. */
type MediaRel = Parameters<typeof img>[0];

type HeroSlideDoc = {
  id: string | number;
  key?: string | null;
  headline?: string | null;
  subline?: string | null;
  mp4Path?: string | null;
  webmPath?: string | null;
  posterPath?: string | null;
  posterOverride?: MediaRel;
  overlayTop?: number | null;
  overlayBottom?: number | null;
  rate?: number | null;
};

/** Everything the hero may name ships with the repo under this prefix. */
const HERO_DIR = "/hero/";

/* The wash measured for the pale studio clip, and the one a row with no
   opacity of its own falls back to. See the note at the reader. */
const HEAVY_OVERLAY_TOP = 0.62;
const HEAVY_OVERLAY_BOTTOM = 0.74;

/* Playback speed, as a multiplier on the file's own timeline, and the range
   the hero will honour. The floor is not taste, it is the point below which
   browsers stop rendering audio and start dropping frames on some hardware;
   the ceiling stops a typo in the admin turning the first screen into a
   flicker. A row that never set a rate plays the file as it was encoded. */
const DEFAULT_RATE = 1;
const MIN_RATE = 0.25;
const MAX_RATE = 2;

/** An optional CMS string, or null when it is absent or only whitespace. */
function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * A path under `/hero/` ending in one of `extensions`, or null.
 *
 * `..` is rejected as well as the prefix: "/hero/../.env" starts with the
 * prefix and is not a hero asset.
 */
function heroPath(
  value: string | null | undefined,
  extensions: string[],
): string | null {
  const path = text(value);
  if (!path) return null;
  if (!path.startsWith(HERO_DIR) || path.includes("..")) return null;
  const lower = path.toLowerCase();
  if (!extensions.some((ext) => lower.endsWith(ext))) return null;
  return path;
}

/**
 * An overlay opacity, clamped into 0 to 1.
 *
 * Postgres hands `numeric` back as a number, but a hand written row can hold
 * anything, and an opacity above 1 paints the footage out entirely. The
 * fallback is the caller's measured default for that slide, never zero:
 * silently dropping the wash would put white type on bare footage.
 */
function opacity(value: number | null | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

/** Nothing to say: either no rows at all, or none complete enough. */
/** A playback rate, clamped into the range the hero will honour. */
function rate(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_RATE;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, value));
}

function orNull<T>(items: T[]): T[] | null {
  return items.length > 0 ? items : null;
}

/**
 * The active slides, in Order.
 *
 * `depth: 1` so the optional poster override arrives as a document with a url
 * rather than as an id. The override is an upload and so is not under
 * `/hero/`; that is the one path here that is allowed to point at the media
 * volume, because losing it costs a still and not the clip.
 */
export async function getHeroSlides(
  locale: Locale,
): Promise<HeroSlide[] | null> {
  const docs = await findDocs<HeroSlideDoc>("hero-slides", {
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 12,
    depth: 1,
    locale,
  });
  if (!docs) return null;

  return orNull(
    docs.flatMap((doc) => {
      const headline = text(doc.headline);
      const subline = text(doc.subline);
      const mp4 = heroPath(doc.mp4Path, [".mp4"]);
      const path = heroPath(doc.posterPath, [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
      ]);
      const override = img(doc.posterOverride);
      const poster = override?.url ?? path;
      if (!headline || !subline || !mp4 || !poster) return [];
      return [
        {
          key: text(doc.key) ?? `hero-slide-${doc.id}`,
          headline,
          subline,
          mp4,
          /* The dictionary shape types this as a string, so a slide with no
             VP9 file carries an empty one and the hero renders no second
             source for it. The mp4 is the source every target decodes; the
             webm only ever saves a browser built without H.264. */
          webm: heroPath(doc.webmPath, [".webm"]) ?? "",
          poster,
          /* A row that never set these gets the heavier of the two washes
             the site ships, because the two failures are not symmetrical:
             too much wash costs some of the picture, too little costs the
             headline. The seed writes the measured value for each clip. */
          overlayTop: opacity(doc.overlayTop, HEAVY_OVERLAY_TOP),
          overlayBottom: opacity(doc.overlayBottom, HEAVY_OVERLAY_BOTTOM),
          /* Unset means "as encoded", which is the one answer that is never
             wrong for footage nobody has looked at yet. */
          rate: rate(doc.rate),
        },
      ];
    }),
  );
}
