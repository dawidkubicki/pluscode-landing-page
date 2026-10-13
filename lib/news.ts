import type { Where } from "payload";

import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { mediaImage } from "./people";

/**
 * News, read from the `insights` collection, which the admin shows as "News".
 *
 * Published documents only: the collection has drafts, and a draft that was
 * never published sits in the same table as the published ones. There is no
 * dictionary fallback here. With nothing published, or no database, the list
 * is empty and the pages say so. Never throws.
 *
 * Text is read in the language asked for and falls back to English, which is
 * Payload's own rule for an article nobody has translated yet.
 */

export type NewsCard = {
  slug: string;
  title: string;
  excerpt: string;
  /** The stored value of the Category select ("ai", "development", "business",
   *  "technology", "cloud", "mobile"), not a label: `newsCategories` in the
   *  dictionaries has the words. */
  category: string;
  publishedAt: string | null;
  readTime: number;
  image: { url: string; alt: string } | null;
};

export type NewsArticle = NewsCard & {
  /** Lexical editor state. */
  content: unknown;
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string | null;
};

type NewsDoc = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  category?: string | null;
  coverImage?: unknown;
  content?: unknown;
  author?: string | null;
  readTime?: number | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

const PUBLISHED: Where = { _status: { equals: "published" } };

/** More than the site will hold for years. The list is sorted here, not in
 *  SQL, so it has to be read whole. */
const MAX_NEWS = 500;

const usable = (doc: NewsDoc): doc is NewsDoc & { slug: string; title: string } =>
  Boolean(doc.slug && doc.title);

const time = (value: string | null | undefined) => {
  const parsed = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Newest first by Published date. An article published without a date goes
 * after the dated ones, newest created first. Postgres would put those at the
 * top of a descending sort, which is why this is not left to the query.
 */
function newestFirst(a: NewsDoc, b: NewsDoc): number {
  const [left, right] = [time(a.publishedAt), time(b.publishedAt)];
  if (left !== null && right !== null) return right - left;
  if (left !== null) return -1;
  if (right !== null) return 1;
  return (time(b.createdAt) ?? 0) - (time(a.createdAt) ?? 0);
}

function toCard(doc: NewsDoc & { slug: string; title: string }, locale: Locale): NewsCard {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt ?? "",
    category: doc.category || "technology",
    publishedAt: doc.publishedAt ?? null,
    readTime: doc.readTime ?? 5,
    image: mediaImage(doc.coverImage, locale, doc.title),
  };
}

async function published(locale: Locale | undefined, depth: number): Promise<NewsDoc[]> {
  const docs = await findDocs<NewsDoc>("insights", {
    where: PUBLISHED,
    limit: MAX_NEWS,
    depth,
    locale,
  });
  return docs ?? [];
}

/** Published news as cards, newest first. Empty when there is none. */
export async function getNews(
  locale: Locale,
  opts: { limit?: number } = {},
): Promise<NewsCard[]> {
  const cards = (await published(locale, 1))
    .filter(usable)
    .sort(newestFirst)
    .map((doc) => toCard(doc, locale));
  const limit = opts.limit;
  return typeof limit === "number" && limit >= 0 ? cards.slice(0, limit) : cards;
}

/** One published article by slug, or null. */
export async function getNewsArticle(
  locale: Locale,
  slug: string,
): Promise<NewsArticle | null> {
  if (!slug) return null;
  const docs = await findDocs<NewsDoc>("insights", {
    where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    limit: 1,
    depth: 1,
    locale,
  });
  const doc = docs?.[0];
  if (!doc || !usable(doc)) return null;
  return {
    ...toCard(doc, locale),
    content: doc.content ?? null,
    author: doc.author || "Pluscode",
    seoTitle: doc.seoTitle || null,
    seoDescription: doc.seoDescription || null,
    updatedAt: doc.updatedAt ?? null,
  };
}

/** Slugs of every published article. Empty when the CMS is down. */
export async function getNewsSlugs(): Promise<string[]> {
  return (await published(undefined, 0)).filter(usable).map((doc) => doc.slug);
}
