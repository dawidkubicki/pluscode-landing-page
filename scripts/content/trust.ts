/**
 * The client strip on /book-a-call, kept in step with Selected clients.
 *
 *     node --import tsx scripts/content/trust.ts
 *
 * WHY THIS SCRIPT EXISTS AND WHY IT COMPUTES RATHER THAN DECLARES.
 * `trust.clients` is a second list of the same companies as the homepage's
 * Selected clients band, rendered under "Teams we have built for" by
 * BookingScreen. Nothing kept the two in step, so when Żabka came out of the
 * home band it stayed on the booking screen, which is the one page where a
 * visitor is deciding whether to hand over their name. A list of clients that
 * contradicts the list of clients one page back is worse than no list.
 *
 * So this does not carry its own names. It reads `home.clients.items[].name`
 * out of each dictionary and writes those names into `trust.clients`, in the
 * same order. Adding or removing a client is therefore one edit, in
 * scripts/content/home-netcompany.ts, and re-running this makes the booking
 * screen agree. Run it AFTER home-netcompany.ts, never before.
 *
 * The label is left exactly as it is in each locale: it is this page's own
 * copy and no other file owns it.
 *
 * Names are not translated. "Żabka" is "Żabka" in German, and the run refuses
 * to continue if the three locales ever disagree about who the clients are,
 * because that would mean somebody localised a company name.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, unknown>;

const DIR = resolve(process.cwd(), "dictionaries");
const LOCALES = ["en", "pl", "de"] as const;

type ClientItem = { key: string; name: string; what: string };

const read = (locale: string) =>
  JSON.parse(readFileSync(resolve(DIR, `${locale}.json`), "utf8")) as Dict;

/** The names, per locale, taken from the band that owns them. */
const namesByLocale = new Map<string, string[]>();

for (const locale of LOCALES) {
  const dict = read(locale);
  const home = dict.home as Dict | undefined;
  const clients = home?.clients as { items?: ClientItem[] } | undefined;
  const items = clients?.items;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      `dictionaries/${locale}.json has no home.clients.items to read. ` +
        `Run scripts/content/home-netcompany.ts first.`,
    );
  }

  const names = items.map((item) => item.name);
  if (names.some((n) => typeof n !== "string" || n.length === 0)) {
    throw new Error(`dictionaries/${locale}.json has a client with no name.`);
  }
  namesByLocale.set(locale, names);
}

/* A company name is a proper noun and does not change with the language, so
   the three lists must be identical. If they are not, one of them has been
   translated and the fix belongs upstream, not here. */
const reference = JSON.stringify(namesByLocale.get("en"));
for (const locale of LOCALES) {
  const actual = JSON.stringify(namesByLocale.get(locale));
  if (actual !== reference) {
    throw new Error(
      `home.clients names differ between en and ${locale}: ${reference} vs ${actual}. ` +
        `Company names are not localised.`,
    );
  }
}

for (const locale of LOCALES) {
  const path = resolve(DIR, `${locale}.json`);
  const dict = read(locale);
  const trust = (dict.trust ?? {}) as Dict;

  if (typeof trust.label !== "string") {
    throw new Error(`dictionaries/${locale}.json has no trust.label to keep.`);
  }

  dict.trust = { ...trust, clients: namesByLocale.get(locale) };
  writeFileSync(path, JSON.stringify(dict, null, 2) + "\n", "utf8");
  console.log(
    `wrote trust.clients (${namesByLocale.get(locale)!.join(", ")}) -> dictionaries/${locale}.json`,
  );
}
