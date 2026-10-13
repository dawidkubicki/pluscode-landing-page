/**
 * Single source of truth for the public site's locales.
 *
 * Shared by the locale proxy (`proxy.ts`), the dictionary loader, the language
 * switcher and the SEO helpers. EN is the default and the fallback; every
 * locale is carried explicitly in the URL (`/en`, `/pl`).
 *
 * Payload still knows a third content locale, `de`, from the previous site.
 * It is kept in the database on purpose and hidden from editors; it is not a
 * site locale and must not be added here.
 */
export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Short codes shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "EN",
  pl: "PL",
};

/** Full names (accessible labels). */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
};

/** `hreflang` tags for SEO alternates. */
export const localeHrefLang: Record<Locale, string> = {
  en: "en",
  pl: "pl",
};

/** BCP-47 tags for date and number formatting (`Intl`). */
export const localeDateTag: Record<Locale, string> = {
  en: "en-GB",
  pl: "pl-PL",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Narrow a route param to a locale, falling back to the default. */
export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
