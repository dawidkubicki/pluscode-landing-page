import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { img, type Img } from "./team";

export type ReportCard = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: Img;
};

export type ReportDoc = {
  id: string | number;
  title: string;
  eyebrow?: string | null;
  description?: string | null;
  image?: unknown;
  ctaLabel?: string | null;
  href?: string | null;
  featured?: boolean | null;
  publishedAt?: string | null;
};

function toCard(d: ReportDoc, fallbackCta: string): ReportCard {
  return {
    eyebrow: d.eyebrow ?? "AI Report",
    title: d.title,
    description: d.description ?? "",
    ctaLabel: d.ctaLabel || fallbackCta,
    href: d.href || "/insights",
    image: img(d.image as never, d.title),
  };
}

/**
 * Reports stacked on the landing page: CMS first (featured ones on top,
 * newest first), dictionary fallback otherwise.
 */
export async function getReports(
  locale: Locale,
  limit = 4,
): Promise<ReportCard[]> {
  const t = getDictionary(locale).reports;
  const docs = await findDocs<ReportDoc>("reports", {
    sort: "-publishedAt",
    depth: 1,
    locale,
  });
  if (docs && docs.length > 0) {
    const ordered = [...docs.filter((d) => d.featured), ...docs.filter((d) => !d.featured)];
    return ordered.slice(0, limit).map((d) => toCard(d, t.cta));
  }
  return t.items.map((item) => ({
    eyebrow: item.label,
    title: item.title,
    description: item.text,
    ctaLabel: t.cta,
    href: "/insights",
    image: null,
  }));
}
