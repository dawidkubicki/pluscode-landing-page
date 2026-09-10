/**
 * Fills the `clients` collection from the dictionary copy, in all three
 * locales, so the "Selected clients" band on the home page starts life saying
 * exactly what it says today and an editor can take it from there.
 *
 * WHY ONLY THAT ONE BAND. Cases, Insights and Stories read the `case-studies`
 * and `insights` collections, which already hold real documents: there is
 * nothing to create, only checkboxes to tick in the admin (Show on home page
 * for a case, Show in Insights band / Show in Stories band plus a Home tag for
 * an article). Until somebody ticks one, those three bands go on rendering the
 * dictionary, which is the intended resting state. `clients` is the only new
 * table, so it is the only thing worth seeding.
 *
 * Matched on the company name, which is not localized, so a re-run updates the
 * same rows in place instead of growing a second set. Rows this script did not
 * write are left alone: an editor may have added a client of their own.
 *
 * THE ONE EXCEPTION IS `RETIRED`, below. A name this script used to seed and
 * no longer does is an orphan of an earlier run, not an editor's addition, so
 * it is deleted. Without that, taking a company out of the dictionary would
 * leave the database still serving it, and the CMS wins over the dictionary
 * in components/clients.tsx: the band would go on naming a client the copy no
 * longer names, in every locale, until somebody noticed.
 *
 * Local:          node --env-file=.env --import tsx scripts/seed-home-bands.ts
 * In production:  docker compose exec landing-pluscode node --import tsx scripts/seed-home-bands.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../payload.config.ts";

const LOCALES = ["en", "pl", "de"] as const;
type SeedLocale = (typeof LOCALES)[number];

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

type ClientEntry = { key: string; name: string; what: string; logo: string };

/** Companies this script used to seed into the Selected clients band and no
 *  longer does. Deleted on every run, so a database seeded before the copy
 *  changed catches up instead of keeping an orphan row alive.
 *
 *  Żabka came off the band in September 2026 at Dawid's request. UBS and EBM
 *  Dental came off in the same month, when BTC Transport and Verde Cargo took
 *  the band. This is the Selected clients band ONLY: the Żabka, UBS and EBM
 *  case studies, the Cases band and the Retail item in Insights are separate
 *  content and are untouched.
 *
 *  Add a name here when you remove it from `home.clients.items`, and never
 *  add one that is still in the dictionary. The assertion below enforces
 *  that, because a name in both lists would be created and deleted on every
 *  run and the band would flicker between two states depending on ordering. */
const RETIRED = ["Żabka", "UBS", "EBM Dental"] as const;

/** The `home.clients.items` block of one dictionary. */
function clientsIn(locale: SeedLocale): ClientEntry[] {
  const file = path.join(root, `dictionaries/${locale}.json`);
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  const items = dict?.home?.clients?.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(`dictionaries/${locale}.json has no home.clients.items`);
  }
  for (const item of items) {
    if (
      typeof item?.key !== "string" ||
      typeof item?.name !== "string" ||
      typeof item?.what !== "string" ||
      typeof item?.logo !== "string"
    ) {
      throw new Error(
        `dictionaries/${locale}.json: a client is missing key, name, what or logo`,
      );
    }
  }
  return items as ClientEntry[];
}

const payload = await getPayload({ config });

/* ------------------------------------------------------------------ *
 *  LOGOS.
 *
 *  The band prefers the CMS over the dictionary, so a seeded client with
 *  no `logo` relation would blank the mark that the dictionary was
 *  serving a moment earlier, and components/clients.tsx drops the whole
 *  row of marks the moment one is missing. Seeding the name without the
 *  logo would therefore take the logos off the home page, which is the
 *  opposite of what a re-run is for. So the file behind each dictionary
 *  path is uploaded into Media here and linked.
 *
 *  Matched on filename, not on content: re-running must find the media
 *  document it made last time rather than pile up a copy per run. That
 *  also means REPLACING A LOGO IS NOT A CONTENT EDIT. A new file at the
 *  same path is never re-uploaded, because the name still matches. Give
 *  the new artwork a new filename, or delete the media document first.
 * ------------------------------------------------------------------ */
const logoCache = new Map<string, number>();

async function ensureLogo(entry: ClientEntry): Promise<number | null> {
  if (!entry.logo) return null;

  const cached = logoCache.get(entry.logo);
  if (cached !== undefined) return cached;

  const filename = path.basename(entry.logo);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });

  let id = existing.docs[0]?.id;
  if (id) {
    console.log(`  = logo ${filename} already in Media`);
  } else {
    /* `entry.logo` is a browser path ("/assets/..."), so it is resolved
       against public/ rather than the repo root. */
    const filePath = path.join(root, "public", entry.logo);
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `${entry.name}: dictionary points at ${entry.logo} but ${filePath} does not exist.`,
      );
    }
    id = (
      await payload.create({
        collection: "media",
        locale: "en",
        filePath,
        data: { alt: `${entry.name} logo` },
      })
    ).id;
    console.log(`  + logo ${filename} uploaded`);
  }

  logoCache.set(entry.logo, id);
  return id;
}

const english = clientsIn("en");

/** Every non-English dictionary, indexed by the item key so a translation can
 *  be looked up for the English entry it belongs to. */
const translations: { locale: SeedLocale; byKey: Map<string, ClientEntry> }[] = [];
for (const locale of LOCALES) {
  if (locale === "en") continue;
  const byKey = new Map<string, ClientEntry>();
  for (const item of clientsIn(locale)) byKey.set(item.key, item);
  translations.push({ locale, byKey });
}

for (let index = 0; index < english.length; index++) {
  const entry = english[index];
  const found = await payload.find({
    collection: "clients",
    where: { name: { equals: entry.name } },
    limit: 1,
    locale: "en",
  });

  const logo = await ensureLogo(entry);

  const data = {
    name: entry.name,
    what: entry.what,
    logo,
    order: index,
    isActive: true,
  };

  let id: string | number;
  if (found.docs[0]) {
    id = found.docs[0].id;
    await payload.update({ collection: "clients", id, locale: "en", data });
    console.log(`✓ updated  ${entry.name}`);
  } else {
    id = (await payload.create({ collection: "clients", locale: "en", data })).id;
    console.log(`✓ created  ${entry.name}`);
  }

  for (const { locale, byKey } of translations) {
    const translated = byKey.get(entry.key);
    if (!translated) {
      console.log(`  ! ${locale} has no client "${entry.key}", left in English`);
      continue;
    }
    await payload.update({
      collection: "clients",
      id,
      locale,
      data: { what: translated.what },
    });
    console.log(`  + ${locale}`);
  }
}

/* Retired names, after the writes, so a name that is somehow in both lists
   has already been caught by the assertion in it, and nothing is deleted that
   the loop above just wrote. */
const current = new Set(english.map((entry) => entry.name));
for (const name of RETIRED) {
  if (current.has(name)) {
    throw new Error(
      `"${name}" is in RETIRED and still in home.clients.items. Pick one.`,
    );
  }
  const orphans = await payload.find({
    collection: "clients",
    where: { name: { equals: name } },
    limit: 100,
    locale: "en",
  });
  for (const doc of orphans.docs) {
    await payload.delete({ collection: "clients", id: doc.id });
    console.log(`\u2717 removed  ${name}`);
  }
}

console.log(`\nDone. ${english.length} clients in the band.`);
process.exit(0);
