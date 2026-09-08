/**
 * The home hero playlist, September 2026.
 *
 * ONE script writes the top level `heroSlides` key into en.json, pl.json and
 * de.json so the three files stay structurally identical. Run it with:
 *
 *     node --import tsx scripts/content/hero-slides.ts
 *
 * RUN IT BEFORE THE FIRST BUILD. `Dictionary` is `typeof en`, so the hero
 * component and lib/hero-slides.ts do not typecheck until this key exists in
 * dictionaries/en.json.
 *
 * WHY A NEW TOP LEVEL KEY AND NOT `home.hero`. The hero used to be one
 * headline over one looping clip and its copy lived under `home.hero`. It is
 * now a playlist: N slides, each with its own footage and its own words,
 * because a line written for a cyclist in a studio says nothing over an aerial
 * of a freight yard. `home.hero` is left exactly as it was and the hero simply
 * stops reading it; `cta` and `scroll` are carried across verbatim because
 * they are shared by every slide and did not change.
 *
 * WHAT AN ENTRY HOLDS. Copy, the three file paths, and the two overlay
 * opacities. The paths and the opacities are not translated, so they are
 * repeated identically in all three locales, exactly as `home.latest.items`
 * repeats its image paths. The opacities are a measured property of the
 * footage, not a taste setting: see the note beside each slide.
 *
 * House style, unchanged: one noun phrase headline, one short line under it,
 * no em dashes in any locale.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");

/* ------------------------------------------------------------------ *
 *  The shape. The hero renders exactly this and nothing else, and
 *  lib/hero-slides.ts returns the same `slides` shape out of Payload so
 *  the component never learns where its slides came from.
 * ------------------------------------------------------------------ */
export type HeroSlidesContent = {
  /** The one button, shared by every slide. */
  cta: string;
  /** The scroll cue on the last four columns, shared by every slide. */
  scroll: string;
  slides: {
    /** Stable identity. The React key, the CMS match key, nothing else. */
    key: string;
    headline: string;
    subline: string;
    /** H.264, listed first in the markup. Every target decodes it. */
    mp4: string;
    /** VP9, the fallback for a build with no H.264 decoder. */
    webm: string;
    /** Frame one of the clip, so the still and the first frame agree. */
    poster: string;
    /** Opacity of the ink wash at the very top edge of the footage. */
    overlayTop: number;
    /** Opacity of the ink wash at the very bottom edge of the footage. */
    overlayBottom: number;
    /** HOW FAST THE CLIP RUNS, as a multiplier on its own timeline. 1 is the
     *  file as encoded, and anything below it is slower. It is a playback
     *  rate and not a re-encode on purpose: the file on disk stays the
     *  footage as shot, the number is one value an editor can change in the
     *  CMS without anybody opening ffmpeg, and slowing a clip down this way
     *  costs nothing at all in bytes. It also sets how long the slide holds
     *  the screen, because the playlist hands over when the clip ends: the
     *  freight hyperlapse is 10 seconds of file, so at 0.8 it lasts 12.5,
     *  which is exactly the length of the studio clip beside it. */
    rate: number;
  }[];
};

/* ------------------------------------------------------------------ *
 *  EN
 * ------------------------------------------------------------------ */
const en: HeroSlidesContent = {
  cta: "Start exploring",
  scroll: "Scroll",
  slides: [
    {
      key: "pluscode",
      headline: "Putting AI to work",
      subline: "Pluscode, from Poznań, across Europe.",
      mp4: "/hero/hero.mp4",
      webm: "/hero/hero.webm",
      poster: "/hero/hero-poster.jpg",
      /* The studio clip alternates between a pale concrete wall (top strip
         luma 152 of 255, bottom left 123) and a near black jersey. Neither
         ink nor white type survives the pale shots bare, so this is the
         heavier of the two washes. Measured with ffmpeg signalstats. */
      overlayTop: 0.62,
      overlayBottom: 0.74,
      rate: 1,
    },
    {
      key: "logistics",
      headline: "Freight without the paperwork",
      subline:
        "AI consulting for hauliers and forwarders: invoices, orders, delivery notes.",
      mp4: "/hero/logistics.mp4",
      webm: "/hero/logistics.webm",
      poster: "/hero/logistics-poster.jpg",
      /* The freight yard is shot at dusk and is far darker: top strip luma
         99.5, bottom left 100.5, against the studio clip's 152 and 123. The
         studio wash over this footage crushes the sunset band and the lit
         docks to nothing, and white type does not need the help here. Two
         thirds of the wash is enough, and the picture survives. Measured
         with ffmpeg signalstats on the shipped encode. */
      overlayTop: 0.42,
      overlayBottom: 0.58,
      rate: 0.8,
    },
  ],
};

/* ------------------------------------------------------------------ *
 *  PL
 * ------------------------------------------------------------------ */
const pl: HeroSlidesContent = {
  cta: "Zobacz, co robimy",
  scroll: "Przewiń",
  slides: [
    {
      key: "pluscode",
      headline: "AI, które pracuje",
      subline: "Pluscode, z Poznania, w całej Europie.",
      mp4: "/hero/hero.mp4",
      webm: "/hero/hero.webm",
      poster: "/hero/hero-poster.jpg",
      overlayTop: 0.62,
      overlayBottom: 0.74,
      rate: 1,
    },
    {
      key: "logistics",
      headline: "Transport bez papierologii",
      subline:
        "Doradztwo AI dla przewoźników i spedycji: faktury, zlecenia, listy przewozowe.",
      mp4: "/hero/logistics.mp4",
      webm: "/hero/logistics.webm",
      poster: "/hero/logistics-poster.jpg",
      overlayTop: 0.42,
      overlayBottom: 0.58,
      rate: 0.8,
    },
  ],
};

/* ------------------------------------------------------------------ *
 *  DE
 * ------------------------------------------------------------------ */
const de: HeroSlidesContent = {
  cta: "Jetzt entdecken",
  scroll: "Scrollen",
  slides: [
    {
      key: "pluscode",
      headline: "KI, die arbeitet",
      subline: "Pluscode, aus Poznań, in ganz Europa.",
      mp4: "/hero/hero.mp4",
      webm: "/hero/hero.webm",
      poster: "/hero/hero-poster.jpg",
      overlayTop: 0.62,
      overlayBottom: 0.74,
      rate: 1,
    },
    {
      key: "logistics",
      headline: "Fracht ohne Papierkram",
      subline:
        "KI-Beratung für Speditionen und Frachtführer: Rechnungen, Aufträge, Lieferscheine.",
      mp4: "/hero/logistics.mp4",
      webm: "/hero/logistics.webm",
      poster: "/hero/logistics-poster.jpg",
      overlayTop: 0.42,
      overlayBottom: 0.58,
      rate: 0.8,
    },
  ],
};

/* ------------------------------------------------------------------ *
 *  Write. `heroSlides` replaces whatever was there; every other top level
 *  key, `home` included, is left exactly as it is.
 * ------------------------------------------------------------------ */
const byLocale: Record<string, HeroSlidesContent> = { en, pl, de };

/** Structural equality, so a locale can never ship a half translated hero. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Dict)
        .sort()
        .map((k) => [k, shapeOf((value as Dict)[k])]),
    );
  }
  return typeof value;
}

const reference = JSON.stringify(shapeOf(en));
for (const [locale, content] of Object.entries(byLocale)) {
  const actual = JSON.stringify(shapeOf(content));
  if (actual !== reference) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the \`heroSlides\` shape does not match en.`,
    );
  }
}

/* The slide list is also an identity list: the seed script matches CMS rows
   on `key`, so a locale that renamed one would silently create a second row
   instead of translating the first. */
const keys = en.slides.map((s) => s.key).join(",");
for (const [locale, content] of Object.entries(byLocale)) {
  if (content.slides.map((s) => s.key).join(",") !== keys) {
    throw new Error(
      `dictionaries/${locale}.json would drift: the \`heroSlides\` keys do not match en.`,
    );
  }
}

for (const [locale, content] of Object.entries(byLocale)) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = JSON.parse(readFileSync(path, "utf8")) as Dict;
  dict.heroSlides = content;
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(`wrote heroSlides -> dictionaries/${locale}.json`);
}
