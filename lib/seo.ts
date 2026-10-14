import type { Metadata } from "next";
import { COMPANY, SITE_URL } from "./company";
import { locales, defaultLocale, localeHrefLang, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

/** Open Graph locale tags per site locale. */
export const ogLocaleTag: Record<Locale, string> = {
  en: "en_GB",
  pl: "pl_PL",
};

/** Bump when the share cards in public/og/ are repainted: scrapers key on the URL. */
const OG_CARD_VERSION = "5";

/** The share card for a locale, as painted by `pnpm generate:og`. */
export const OG_CARD = { width: 1200, height: 630, type: "image/png" } as const;

export function ogCardPath(locale: Locale): string {
  return `/og/${locale}.png?v=${OG_CARD_VERSION}`;
}

/** `/about` in Polish is `/pl/about`; the home page is `/pl`. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** The public address of one page in one language. */
export function pageUrl(locale: Locale, path = ""): string {
  return absoluteUrl(localePath(locale, path));
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

/** The same map with full addresses, as the sitemap and the head need it. */
export function languageAlternateUrls(path = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([tag, p]) => [tag, absoluteUrl(p)]),
  );
}

/** Mirrors the title template in the locale layout, which only Next can apply
 *  to `<title>`: Open Graph and Twitter titles do not inherit it. */
const withSiteName = (title: string) => `${title} · ${COMPANY.name}`;

/** CMS text areas can carry line breaks; a meta tag is one line. */
const oneLine = (text: string | null | undefined) =>
  (text ?? "").replace(/\s+/g, " ").trim();

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
 *
 * Addresses are written out in full against the production origin instead of
 * being left for `metadataBase` to resolve, so a canonical is right wherever
 * the page is rendered, and stays right if a layout ever drops the base.
 */
export function pageMetadata(locale: Locale, page: PageMeta): Metadata {
  const meta = getDictionary(locale).meta;
  const url = pageUrl(locale, page.path);
  const description = oneLine(page.description) || meta.description;
  const isArticle = page.type === "article";

  /* The dictionary carries a shorter title and description written for share
     cards. They stand in for the site-wide defaults only: once a page, or an
     editor in the CMS, says something of its own, that is what gets shared. */
  const ownTitle = oneLine(page.absoluteTitle) || oneLine(page.title);
  const socialTitle =
    !ownTitle || ownTitle === meta.title
      ? meta.ogTitle
      : page.absoluteTitle || isArticle
        ? ownTitle
        : withSiteName(ownTitle);
  const socialDescription =
    description === meta.description ? meta.ogDescription : description;

  const image = page.image
    ? {
        url: absoluteImageUrl(page.image.url),
        alt: page.image.alt,
        ...(page.image.width && page.image.height
          ? { width: page.image.width, height: page.image.height }
          : {}),
      }
    : {
        url: absoluteUrl(ogCardPath(locale)),
        alt: meta.ogImageAlt,
        ...OG_CARD,
      };

  return {
    title: page.absoluteTitle ? { absolute: page.absoluteTitle } : page.title,
    description,
    alternates: {
      canonical: url,
      languages:
        page.alternates === false ? undefined : languageAlternateUrls(page.path),
    },
    // No `icons` here on purpose: naming one would stop Next adding the
    // favicon and app/icon.svg by itself. iOS finds /apple-touch-icon.png at
    // the root without being told.
    robots: page.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          // Lets search results show the whole snippet and the large picture.
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: COMPANY.name,
      type: page.type ?? "website",
      locale: ogLocaleTag[locale],
      alternateLocale:
        page.alternates === false
          ? undefined
          : locales.filter((l) => l !== locale).map((l) => ogLocaleTag[l]),
      images: [image],
      ...(isArticle
        ? {
            publishedTime: page.publishedTime ?? undefined,
            modifiedTime: page.modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

function absoluteImageUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : absoluteUrl(url);
}
