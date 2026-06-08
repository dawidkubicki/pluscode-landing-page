import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { img, type Img } from "./team";

export type Stat = { value: string; label: string | null };

export type CaseStudyCard = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  client: string | null;
  logo: Img;
  image: Img;
  gradient: string;
  featured: boolean;
};

/** Lexical rich-text fields are passed straight to <RichText>; shape is opaque here. */
export type CaseStudyDoc = {
  id: string | number;
  slug: string;
  title: string;
  category?: string | null;
  client?: string | null;
  excerpt?: string | null;
  logo?: unknown;
  heroImage?: unknown;
  gradient?: string | null;
  overview?: unknown;
  challenge?: unknown;
  solution?: unknown;
  results?: unknown;
  stats?: { value?: string | null; label?: string | null }[] | null;
  featured?: boolean | null;
  order?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const DEFAULT_GRADIENT =
  "bg-gradient-to-br from-night-soft via-night-soft to-night";

/** Static fallbacks used until the CMS is seeded — keyed to dictionary copy. */
const FALLBACK = [
  {
    slug: "zabka" as const,
    logo: "/assets/portfolio/zabka-logo.svg",
    gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
  },
  {
    slug: "ubs" as const,
    logo: "/assets/portfolio/ubs-logo.svg",
    gradient: "bg-gradient-to-br from-indigo-500 via-blue-600 to-slate-700",
  },
];

function toCard(d: CaseStudyDoc): CaseStudyCard {
  return {
    slug: d.slug,
    title: d.title,
    category: d.category ?? "",
    excerpt: d.excerpt ?? "",
    client: d.client ?? null,
    logo: img(d.logo as never, d.title),
    image: img(d.heroImage as never, d.title),
    gradient: d.gradient || DEFAULT_GRADIENT,
    featured: !!d.featured,
  };
}

function fallbackCards(locale: Locale): CaseStudyCard[] {
  const items = getDictionary(locale).portfolio.items;
  return FALLBACK.map((f) => {
    const t = items[f.slug];
    return {
      slug: f.slug,
      title: t.title,
      category: t.category,
      excerpt: t.description,
      client: t.title,
      logo: { url: f.logo, alt: f.slug },
      image: null,
      gradient: f.gradient,
      featured: true,
    };
  });
}

/** All case studies as cards — CMS first, dictionary fallback otherwise. */
export async function getCaseStudies(locale: Locale): Promise<CaseStudyCard[]> {
  const docs = await findDocs<CaseStudyDoc>("case-studies", {
    sort: "order",
    depth: 1,
    locale,
  });
  if (docs && docs.length > 0) return docs.map(toCard);
  return fallbackCards(locale);
}

export async function getFeaturedCaseStudies(
  locale: Locale,
  limit = 4,
): Promise<CaseStudyCard[]> {
  const all = await getCaseStudies(locale);
  const featured = all.filter((c) => c.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

/** Single case study: the full CMS doc when present, plus its resolved card. */
export async function getCaseStudy(
  slug: string,
  locale: Locale,
): Promise<{ card: CaseStudyCard; doc: CaseStudyDoc | null } | null> {
  const docs = await findDocs<CaseStudyDoc>("case-studies", {
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

export async function getCaseStudySlugs(): Promise<string[]> {
  const docs = await findDocs<CaseStudyDoc>("case-studies", { depth: 0 });
  if (docs && docs.length > 0) return docs.map((d) => d.slug);
  return FALLBACK.map((f) => f.slug);
}
