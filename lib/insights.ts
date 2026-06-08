import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { img, type Img } from "./team";

export type InsightCategory =
  | "ai"
  | "development"
  | "business"
  | "technology"
  | "cloud"
  | "mobile";

export type InsightCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  readTime: number;
  author: string;
  featured: boolean;
  gradient: string;
  image: Img;
  publishedAt: string | null;
};

export type InsightDoc = {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: InsightCategory | null;
  coverImage?: unknown;
  gradient?: string | null;
  content?: unknown;
  author?: string | null;
  readTime?: number | null;
  featured?: boolean | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const DEFAULT_GRADIENT =
  "bg-gradient-to-br from-night-soft via-night-soft to-night";

/** Static fallbacks used until the CMS is seeded — keyed to dictionary copy. */
const FALLBACK: {
  slug: string;
  key: "featured" | "post1" | "post2" | "post3";
  category: InsightCategory;
  readTime: number;
  featured: boolean;
  gradient: string;
}[] = [
  {
    slug: "ai-transforming-business",
    key: "featured",
    category: "ai",
    readTime: 8,
    featured: true,
    gradient: "bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400",
  },
  {
    slug: "scalable-microservices",
    key: "post1",
    category: "development",
    readTime: 5,
    featured: false,
    gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
  },
  {
    slug: "startup-to-scaleup",
    key: "post2",
    category: "business",
    readTime: 6,
    featured: false,
    gradient: "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400",
  },
  {
    slug: "cloud-native-best-practices",
    key: "post3",
    category: "technology",
    readTime: 4,
    featured: false,
    gradient: "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400",
  },
];

function toCard(d: InsightDoc): InsightCard {
  return {
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt ?? "",
    category: (d.category ?? "technology") as InsightCategory,
    readTime: d.readTime ?? 5,
    author: d.author ?? "Pluscode",
    featured: !!d.featured,
    gradient: d.gradient || DEFAULT_GRADIENT,
    image: img(d.coverImage as never, d.title),
    publishedAt: d.publishedAt ?? null,
  };
}

function fallbackCards(locale: Locale): InsightCard[] {
  const items = getDictionary(locale).insights.items;
  return FALLBACK.map((f) => {
    const t = items[f.key];
    return {
      slug: f.slug,
      title: t.title,
      excerpt: t.excerpt,
      category: f.category,
      readTime: f.readTime,
      author: "Pluscode",
      featured: f.featured,
      gradient: f.gradient,
      image: null,
      publishedAt: null,
    };
  });
}

/** All insights as cards — CMS first, dictionary fallback otherwise. */
export async function getInsights(locale: Locale): Promise<InsightCard[]> {
  const docs = await findDocs<InsightDoc>("insights", {
    sort: "-publishedAt",
    depth: 1,
    locale,
  });
  if (docs && docs.length > 0) return docs.map(toCard);
  return fallbackCards(locale);
}

export async function getFeaturedInsight(
  locale: Locale,
): Promise<InsightCard | null> {
  const all = await getInsights(locale);
  return all.find((i) => i.featured) ?? all[0] ?? null;
}

export async function getInsight(
  slug: string,
  locale: Locale,
): Promise<{ card: InsightCard; doc: InsightDoc | null } | null> {
  const docs = await findDocs<InsightDoc>("insights", {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    locale,
  });
  if (docs && docs.length > 0) {
    const doc = docs[0];
    return { card: toCard(doc), doc };
  }
  const card = fallbackCards(locale).find((c) => c.slug === slug);
  return card ? { card, doc: null } : null;
}

export async function getRelatedInsights(
  slug: string,
  category: InsightCategory,
  locale: Locale,
  limit = 3,
): Promise<InsightCard[]> {
  const all = await getInsights(locale);
  return all
    .filter((i) => i.slug !== slug && i.category === category)
    .slice(0, limit);
}

export async function getInsightSlugs(): Promise<string[]> {
  const docs = await findDocs<InsightDoc>("insights", { depth: 0 });
  if (docs && docs.length > 0) return docs.map((d) => d.slug);
  return FALLBACK.map((f) => f.slug);
}
