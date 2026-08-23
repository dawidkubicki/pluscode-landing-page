import "server-only";

import type { Locale } from "./config";
import en from "@/dictionaries/en.json";
import pl from "@/dictionaries/pl.json";
import de from "@/dictionaries/de.json";

/**
 * Static UI copy per locale. The English file is the canonical shape; `pl`
 * and `de` mirror it. Imported on the server only, so translation files never reach the
 * client bundle (client components receive just the slice they render).
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  pl: pl as Dictionary,
  de: de as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
