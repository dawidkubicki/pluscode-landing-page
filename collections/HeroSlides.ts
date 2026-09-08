import type { CollectionConfig } from "payload";

/**
 * THE HOME HERO PLAYLIST.
 *
 * One row is one full screen slide: a clip, and the headline and subline
 * written for that clip. The hero picks one at random on load, plays it to
 * the end, then crosses to the next active row and wraps around.
 *
 * THE VIDEO FILES ARE NOT IN THE MEDIA LIBRARY, AND THAT IS DELIBERATE.
 * `media` is a Docker volume on the VPS: a rebuild does not reach it, a fresh
 * environment starts empty, and CI has no database at all. A hero that
 * depended on an upload would be a blank first screen on a clean deploy, which
 * is the one screen that can never be blank. So the clips live in
 * `public/hero/` and ship with the repo, and this collection points at them by
 * path. Every path is validated to sit under `/hero/` so a row can only ever
 * name a committed file.
 *
 * THE ONE UPLOAD HERE IS AN OVERRIDE, AND ONLY FOR THE STILL. An editor can
 * swap the poster from the admin without a deploy, because a poster is an
 * image and `media` already accepts images. There is no upload for the clips:
 * `collections/Media.ts` allows only `image/*` and `application/pdf`, and
 * widening it to video would put a multi megabyte file behind exactly the
 * volume this collection is arranged to avoid.
 *
 * lib/hero-slides.ts reads the active rows in Order. When none are active, or
 * a row is incomplete, or the database is unreachable, the reader returns null
 * and the hero renders the slides built into dictionaries/{en,pl,de}.json
 * instead, so the first screen is never empty.
 */

/** Every clip, poster and still the hero can name lives here and ships with
 *  the repo. Anything outside it either does not exist on a fresh deploy or
 *  lives in the media volume, which is the thing this collection avoids. */
const HERO_DIR = "/hero/";

/**
 * A path under `/hero/` with one of the given extensions.
 *
 * `..` is rejected as well as the prefix, because "/hero/../../etc/passwd"
 * starts with `/hero/` and is not a hero asset. The path lands in a `src`
 * attribute, so this is the last place it can be checked.
 */
function heroPath(extensions: string[], required: boolean) {
  const list = extensions.join(" or ");
  return (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return required ? `Required. A path under ${HERO_DIR}` : true;
    }
    if (typeof value !== "string") return "Must be a path.";
    const path = value.trim();
    if (!path.startsWith(HERO_DIR)) {
      return `Must start with ${HERO_DIR}, e.g. ${HERO_DIR}logistics${extensions[0]}`;
    }
    if (path.includes("..")) return "Must not contain \"..\".";
    if (!extensions.some((ext) => path.toLowerCase().endsWith(ext))) {
      return `Must end in ${list}.`;
    }
    return true;
  };
}

export const HeroSlides: CollectionConfig = {
  slug: "hero-slides",
  labels: { singular: "Hero slide", plural: "Hero slides" },
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "isActive", "order", "updatedAt"],
    description:
      "The full screen slides at the top of the home page. One is chosen at random on load and the rest follow as each clip ends. Active slides play in Order; when none are active the hero falls back to the slides built into the site copy.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          'A short identity for this slide, e.g. "pluscode" or "logistics". Not shown to anyone: it is how the seed script finds this row again and how the page tells one slide from another. Lower case, no spaces.',
      },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          "The one large line, set in white over the footage. A noun phrase, no full stop. Write it for this clip: the slide exists so the words and the picture say the same thing.",
      },
    },
    {
      name: "subline",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          "The single grey line under the headline. One short sentence.",
      },
    },
    {
      name: "mp4Path",
      type: "text",
      required: true,
      defaultValue: "/hero/hero.mp4",
      validate: heroPath([".mp4"], true),
      admin: {
        description:
          "Path to the H.264 file in public/hero/, e.g. /hero/logistics.mp4. This is the source the page offers first, because every browser and every phone can decode it. It must be encoded with faststart or it will not begin playing until the whole file has arrived.",
      },
    },
    {
      name: "webmPath",
      type: "text",
      validate: heroPath([".webm"], false),
      admin: {
        description:
          "Optional path to a VP9 file in public/hero/. Offered second, for a browser built with no H.264 decoder. Leave empty and the slide plays the mp4 everywhere.",
      },
    },
    {
      name: "posterPath",
      type: "text",
      required: true,
      defaultValue: "/hero/hero-poster.jpg",
      validate: heroPath([".jpg", ".jpeg", ".png", ".webp"], true),
      admin: {
        description:
          "Path to the still in public/hero/. It is what a visitor on a slow connection sees, and what stands in when a phone refuses to autoplay, so use the clip's own first frame: then the still and the first frame of playback are the same picture and nothing jumps.",
      },
    },
    {
      name: "posterOverride",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional. Upload a still here to use instead of the path above, when the poster needs changing and a deploy does not. The clips themselves cannot be uploaded: they ship with the site so the first screen survives a fresh deploy.",
      },
    },
    {
      name: "overlayTop",
      type: "number",
      defaultValue: 0.62,
      min: 0,
      max: 1,
      admin: {
        description:
          "How much ink is washed over the TOP edge of this clip, 0 to 1. It is what keeps the header legible over bright footage. Measured, not chosen: read the average luma of the top strip of the clip and raise this until white type on it is comfortable. A dark clip needs less.",
      },
    },
    {
      name: "overlayBottom",
      type: "number",
      defaultValue: 0.74,
      min: 0,
      max: 1,
      admin: {
        description:
          "The same wash at the BOTTOM edge, where the headline sits. Raise it for pale footage, lower it for footage shot at night, and check the result rather than trusting the number.",
      },
    },
    {
      name: "rate",
      type: "number",
      defaultValue: 1,
      min: 0.25,
      max: 2,
      admin: {
        description:
          "How fast the clip runs. 1 is the file as it was encoded, 0.8 is a fifth slower, 0.5 is half speed. Nothing is re-encoded, so this costs no bandwidth and can be changed as often as you like. It also decides how long the slide holds the screen, because the next one starts when this clip ends: a 10 second clip at 0.8 lasts 12.5 seconds.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Lower numbers play first. The playlist starts on a random slide and then follows this order.",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description:
          "Uncheck to take this slide out of the playlist without deleting it. With every slide unchecked the hero falls back to the site copy.",
      },
    },
  ],
};
