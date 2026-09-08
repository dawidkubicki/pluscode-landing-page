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

type ClientEntry = { key: string; name: string; what: string };

/** Companies this script used to seed into the Selected clients band and no
 *  longer does. Deleted on every run, so a database seeded before the copy
 *  changed catches up instead of keeping an orphan row alive.
 *
 *  Żabka came off the band in September 2026 at Dawid's request. This is the
 *  Selected clients band ONLY: the Żabka case study, the Cases band and the
 *  Retail item in Insights are separate content and are untouched.
 *
 *  Add a name here when you remove it from `home.clients.items`, and never
 *  add one that is still in the dictionary. The assertion below enforces
 *  that, because a name in both lists would be created and deleted on every
 *  run and the band would flicker between two states depending on ordering. */
const RETIRED = ["Żabka"] as const;

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
      typeof item?.what !== "string"
    ) {
      throw new Error(`dictionaries/${locale}.json: a client is missing key, name or what`);
    }
  }
  return items as ClientEntry[];
}

const payload = await getPayload({ config });

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

  const data = {
    name: entry.name,
    what: entry.what,
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
