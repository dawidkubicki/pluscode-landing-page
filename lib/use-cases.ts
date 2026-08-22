import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { img, type Img } from "./team";

export type UseCaseCard = {
  id: string;
  title: string;
  category: string;
  href: string | null;
  image: Img;
  featured: boolean;
};

export type UseCaseDoc = {
  id: string | number;
  title: string;
  category?: string | null;
  image?: unknown;
  href?: string | null;
  featured?: boolean | null;
  order?: number | null;
};

function toCard(d: UseCaseDoc): UseCaseCard {
  return {
    id: String(d.id),
    title: d.title,
    category: d.category ?? "",
    href: d.href ?? null,
    image: img(d.image as never, d.title),
    featured: !!d.featured,
  };
}

/**
 * Use cases for the home "Ambition in action" mosaic: CMS first, dictionary
 * fallback otherwise. The featured card is always first in the returned list.
 */
export async function getUseCases(
  locale: Locale,
  limit = 5,
): Promise<UseCaseCard[]> {
  const docs = await findDocs<UseCaseDoc>("use-cases", {
    sort: "order",
    depth: 1,
    locale,
  });
  if (docs && docs.length > 0) {
    const cards = docs.map(toCard);
    const featured = cards.find((c) => c.featured) ?? cards[0];
    return [featured, ...cards.filter((c) => c.id !== featured.id)].slice(0, limit);
  }
  return getDictionary(locale).useCases.items.map((item, i) => ({
    id: `fallback-${i}`,
    title: item.title,
    category: item.category,
    href: null,
    image: null,
    featured: i === 0,
  }));
}
