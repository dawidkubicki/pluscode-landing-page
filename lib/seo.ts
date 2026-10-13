import type { Metadata } from "next";
import { SITE_URL } from "./company";
import { locales, defaultLocale, localeHrefLang, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

/** Open Graph locale tags per site locale. */
export const ogLocaleTag: Record<Locale, string> = {
  en: "en_GB",
  pl: "pl_PL",
};

/** Bump when the share cards in public/og/ are repainted: scrapers key on the URL. */
const OG_CARD_VERSION = "3";

/** `/about` in Polish is `/pl/about`; the home page is `/pl`. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** hreflang map for one page, with `x-default` on the default locale. */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      locales.map((l) => [localeHrefLang[l], localePath(l, path)]),
    ),
    "x-default": localePath(defaultLocale, path),
  };
}

export type PageMeta = {
  /** Path after the locale, "" for the home page, "/about", "/news/slug". */
  path: string;
  /** Goes through the "%s · Pluscode" template. */
  title?: string;
  /** Used as is, bypassing the template (the home page). */
  absoluteTitle?: string;
  description?: string;
  image?: { url: string; alt: string; width?: number; height?: number } | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  noindex?: boolean;
  /** Set to false for a page that exists in one language only. */
  alternates?: boolean;
};

/**
 * The complete metadata for one page: title, description, canonical, hreflang,
 * Open Graph and Twitter. Every page calls this from `generateMetadata`, so
 * no page can ship without a canonical or with a half-built Open Graph block
 * (Next replaces, not merges, a parent's `openGraph`).
 */
export function pageMetadata(locale: Locale, page: PageMeta): Metadata {
  const meta = getDictionary(locale).meta;
  const description = page.description || meta.description;
  const ogTitle = page.absoluteTitle ?? page.title ?? meta.ogTitle;
  const image = page.image ?? {
    url: `/og/${locale}.png?v=${OG_CARD_VERSION}`,
    alt: meta.ogImageAlt,
    width: 1200,
    height: 630,
  };

  return {
    title: page.absoluteTitle ? { absolute: page.absoluteTitle } : page.title,
    description,
    alternates: {
      canonical: localePath(locale, page.path),
      languages: page.alternates === false ? undefined : languageAlternates(page.path),
    },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: ogTitle,
      description,
      url: localePath(locale, page.path),
      siteName: "Pluscode",
      type: page.type ?? "website",
      locale: ogLocaleTag[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleTag[l]),
      images: [image],
      ...(page.type === "article"
        ? {
            publishedTime: page.publishedTime ?? undefined,
            modifiedTime: page.modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image.url],
    },
  };
}
