/**
 * Single source of truth for the site's locales.
 *
 * Shared by the locale proxy (`proxy.ts`), the Payload `localization` config,
 * the dictionary loader and the in-header language switcher so they can never
 * drift out of sync. EN is the default and the fallback locale; every locale is
 * carried explicitly in the URL (`/en`, `/pl`).
 */
export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Short codes shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "EN",
  pl: "PL",
};

/** Full names (used for accessible labels / `hreflang`). */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
};

/** `hreflang`-style tags for SEO `alternates`. */
export const localeHrefLang: Record<Locale, string> = {
  en: "en",
  pl: "pl",
};

/** BCP-47 tags for date/number formatting (`Intl`). */
export const localeDateTag: Record<Locale, string> = {
  en: "en-GB",
  pl: "pl-PL",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
