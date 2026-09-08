/**
 * Fills the `hero-slides` collection from the dictionary copy, in all three
 * locales, so the home page hero starts life saying exactly what it says
 * today and an editor can take it from there.
 *
 * IDEMPOTENT. Rows are matched on `key`, which is not localized, so a re-run
 * updates the same rows in place instead of growing a second set. Rows this
 * script did not write are left alone: somebody may have added a third slide
 * in the admin.
 *
 * IT CHECKS THE FILES BEFORE IT WRITES THE PATHS. Every clip and poster named
 * in the dictionary has to exist under public/, because the paths this script
 * stores go straight into a `src` on the first screen of the site and a typo
 * there is a black hero rather than an error anybody sees. It stops rather
 * than seeding a path that does not resolve.
 *
 * RUN THE CONTENT SCRIPT FIRST. This reads `heroSlides` out of the
 * dictionaries, and scripts/content/hero-slides.ts is what puts it there:
 *
 *     node --import tsx scripts/content/hero-slides.ts
 *
 * Local:          node --env-file=.env --import tsx scripts/seed-hero-slides.ts
 * In production:  docker compose exec landing-pluscode node --import tsx scripts/seed-hero-slides.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../payload.config.ts";

const LOCALES = ["en", "pl", "de"] as const;
type SeedLocale = (typeof LOCALES)[number];

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

type SlideEntry = {
  key: string;
  headline: string;
  subline: string;
  mp4: string;
  webm: string;
  poster: string;
  overlayTop: number;
  overlayBottom: number;
};

/** The `heroSlides.slides` block of one dictionary, checked field by field
 *  rather than trusted: this is the only place the shape is verified before
 *  it becomes rows in a database. */
function slidesIn(locale: SeedLocale): SlideEntry[] {
  const file = path.join(root, `dictionaries/${locale}.json`);
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  const slides = dict?.heroSlides?.slides;
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error(
      `dictionaries/${locale}.json has no heroSlides.slides. Run scripts/content/hero-slides.ts first.`,
    );
  }
  for (const slide of slides) {
    for (const field of [
      "key",
      "headline",
      "subline",
      "mp4",
      "webm",
      "poster",
    ]) {
      if (typeof slide?.[field] !== "string") {
        throw new Error(
          `dictionaries/${locale}.json: a hero slide is missing "${field}"`,
        );
      }
    }
    for (const field of ["overlayTop", "overlayBottom"]) {
      if (typeof slide?.[field] !== "number") {
        throw new Error(
          `dictionaries/${locale}.json: a hero slide is missing "${field}"`,
        );
      }
    }
  }
  return slides as SlideEntry[];
}

/** A path like "/hero/logistics.mp4" has to be a file in public/hero/. An
 *  empty webm is allowed and means the slide ships mp4 only. */
function mustExist(slidePath: string, what: string, key: string): void {
  if (!slidePath) return;
  if (!slidePath.startsWith("/hero/") || slidePath.includes("..")) {
    throw new Error(`slide "${key}": ${what} "${slidePath}" is not under /hero/`);
  }
  const onDisk = path.join(root, "public", slidePath);
  if (!fs.existsSync(onDisk)) {
    throw new Error(`slide "${key}": ${what} "${slidePath}" is not in public/`);
  }
}

const payload = await getPayload({ config });

const english = slidesIn("en");

for (const slide of english) {
  mustExist(slide.mp4, "mp4", slide.key);
  mustExist(slide.webm, "webm", slide.key);
  mustExist(slide.poster, "poster", slide.key);
}

/** Every non-English dictionary, indexed by the slide key so a translation
 *  can be looked up for the English entry it belongs to. */
const translations: { locale: SeedLocale; byKey: Map<string, SlideEntry> }[] =
  [];
for (const locale of LOCALES) {
  if (locale === "en") continue;
  const byKey = new Map<string, SlideEntry>();
  for (const slide of slidesIn(locale)) byKey.set(slide.key, slide);
  translations.push({ locale, byKey });
}

for (let index = 0; index < english.length; index++) {
  const entry = english[index];
  const found = await payload.find({
    collection: "hero-slides",
    where: { key: { equals: entry.key } },
    limit: 1,
    locale: "en",
  });

  const data = {
    key: entry.key,
    headline: entry.headline,
    subline: entry.subline,
    mp4Path: entry.mp4,
    // An empty string in the dictionary means "no VP9 file for this slide".
    webmPath: entry.webm || null,
    posterPath: entry.poster,
    overlayTop: entry.overlayTop,
    overlayBottom: entry.overlayBottom,
    order: index,
    isActive: true,
  };

  let id: string | number;
  if (found.docs[0]) {
    id = found.docs[0].id;
    await payload.update({
      collection: "hero-slides",
      id,
      locale: "en",
      data,
    });
    console.log(`✓ updated  ${entry.key}`);
  } else {
    id = (
      await payload.create({ collection: "hero-slides", locale: "en", data })
    ).id;
    console.log(`✓ created  ${entry.key}`);
  }

  for (const { locale, byKey } of translations) {
    const translated = byKey.get(entry.key);
    if (!translated) {
      console.log(`  ! ${locale} has no slide "${entry.key}", left in English`);
      continue;
    }
    await payload.update({
      collection: "hero-slides",
      id,
      locale,
      data: {
        headline: translated.headline,
        subline: translated.subline,
      },
    });
    console.log(`  + ${locale}`);
  }
}

console.log(`\nDone. ${english.length} slides in the hero playlist.`);
process.exit(0);
