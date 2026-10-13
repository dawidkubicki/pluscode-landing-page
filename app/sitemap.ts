import type { MetadataRoute } from "next";

import { findGlobal } from "@/lib/cms";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { getNews, getNewsSlugs } from "@/lib/news";
import { languageAlternateUrls, pageUrl } from "@/lib/seo";

/* Rebuilt at most every five minutes. `next build` runs without a database,
   so the copy made there lists the pages only and the articles join it on the
   first rebuild after the container has started. The short interval keeps
   that gap, and the wait before a new article is listed, small. */
export const revalidate = 300;

/**
 * The day this version of the site went up. No page is older than it, so it
 * is the floor for every `lastmod`, and the whole answer for a page whose
 * copy lives in the dictionaries. Move it when those pages are rewritten.
 */
const SITE_REVISED = "2026-10-14";

/** Pages edited in the CMS, with the global that holds each one's copy. */
const CMS_PAGES = [
  { path: "", global: "home-page", listsNews: true },
  { path: "/about", global: "about-page", listsNews: false },
  { path: "/news", global: "news-page", listsNews: true },
  { path: "/contact", global: "contact-page", listsNews: false },
] as const;

const LEGAL_PAGES = ["/privacy-policy", "/terms-of-use"] as const;

/** The most recent of some dates, ignoring the ones that are missing or unreadable. */
function latest(...dates: (string | null | undefined)[]): string {
  let best = SITE_REVISED;
  for (const date of dates) {
    if (date && !Number.isNaN(Date.parse(date)) && Date.parse(date) > Date.parse(best)) {
      best = date;
    }
  }
  return best;
}

/** One entry per language, each naming the other and the default. */
function entries(path: string, lastModified: string): MetadataRoute.Sitemap {
  const languages = languageAlternateUrls(path);
  return locales.map((locale) => ({
    url: pageUrl(locale, path),
    lastModified,
    alternates: { languages },
  }));
}

/** The helpers already swallow a database that is down. This is for anything else. */
async function safely<T>(read: Promise<T>, fallback: T): Promise<T> {
  try {
    return await read;
  } catch {
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, cards, edited] = await Promise.all([
    safely(getNewsSlugs(), []),
    safely(getNews(defaultLocale), []),
    Promise.all(
      CMS_PAGES.map((page) =>
        safely(
          findGlobal<{ updatedAt?: string | null }>(page.global, { depth: 0 }),
          null,
        ).then((doc) => doc?.updatedAt ?? null),
      ),
    ),
  ]);

  const published = new Map(cards.map((card) => [card.slug, card.publishedAt]));
  // `cards` is newest first, so the first date is the newest article's.
  const newestArticle = cards.find((card) => card.publishedAt)?.publishedAt;
  // The slugs decide what is listed; the cards only lend their order and dates.
  const listed = new Set(slugs);
  const ordered = [
    ...new Set([...cards.map((card) => card.slug).filter((slug) => listed.has(slug)), ...slugs]),
  ];

  return [
    ...CMS_PAGES.flatMap((page, i) =>
      entries(
        page.path,
        latest(edited[i], page.listsNews ? newestArticle : null),
      ),
    ),
    ...LEGAL_PAGES.flatMap((path) => entries(path, SITE_REVISED)),
    // An article keeps the date it was published with. One slug serves every
    // language: Payload shows the English text until a translation exists.
    ...ordered.flatMap((slug) =>
      entries(`/news/${slug}`, published.get(slug) ?? SITE_REVISED),
    ),
  ];
}
