import type { Metadata } from "next";
import { locales, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

/** Open Graph locale tags per supported locale. */
export const ogLocaleTag: Record<Locale, string> = {
  en: "en_GB",
  pl: "pl_PL",
  de: "de_DE",
};

type OgOverrides = {
  /** Page-specific og:title; defaults to the localized brand tagline. */
  title?: string;
  description?: string;
  /** Path after the locale prefix, e.g. "/insights/my-post". */
  path?: string;
  type?: "website" | "article";
  /** Page-specific image (e.g. a CMS cover); defaults to the localized brand card. */
  image?: { url: string; alt: string } | null;
};

/**
 * Complete Open Graph block for one page. Next.js replaces (not merges) a
 * layout's `openGraph` when a page provides its own, so pages overriding any
 * OG field must build the whole object through this helper to keep the url,
 * siteName, locale and image intact.
 */
export function buildOpenGraph(
  locale: Locale,
  overrides: OgOverrides = {},
): Metadata["openGraph"] {
  const meta = getDictionary(locale).meta;
  return {
    title: overrides.title ?? meta.ogTitle,
    description: overrides.description || meta.ogDescription,
    url: `/${locale}${overrides.path ?? ""}`,
    siteName: "Pluscode",
    type: overrides.type ?? "website",
    locale: ogLocaleTag[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleTag[l]),
    images: overrides.image
      ? [{ url: overrides.image.url, alt: overrides.image.alt }]
      : [
          {
            url: `/og/${locale}.png`,
            width: 1200,
            height: 630,
            alt: meta.ogImageAlt,
          },
        ],
  };
}
