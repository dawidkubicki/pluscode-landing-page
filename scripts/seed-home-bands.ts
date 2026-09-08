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
 * same three rows in place instead of growing a second set. Rows this script
 * did not write are left alone: an editor may have added a fourth client.
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

console.log(`\nDone. ${english.length} clients in the band.`);
process.exit(0);
