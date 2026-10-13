import "server-only";

import type { Locale } from "./config";
import en from "@/dictionaries/en.json";
import pl from "@/dictionaries/pl.json";

/**
 * Static copy per locale. The English file is the canonical shape and `pl`
 * mirrors it. Server only, so the files never reach the client bundle: client
 * components receive just the slice they render.
 *
 * The page copy in here (`homePage`, `aboutPage`, `newsPage`, `contactPage`,
 * `people`, `products`) is the fallback, not the last word. Payload holds the
 * same fields and wins once it has a value, and production was seeded from
 * these files on first deploy. Editing that copy here changes a fresh database
 * and the no-database build only; to change the live site, edit it in the CMS
 * or ship a migration. Read it through `lib/pages.ts`, `lib/people.ts` and
 * `lib/products.ts`, never straight from the dictionary.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  pl: pl as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
