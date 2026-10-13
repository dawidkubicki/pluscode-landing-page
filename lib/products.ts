import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { ALL_LOCALES, resolveText } from "./pages";
import { mediaImage } from "./people";

/**
 * The portfolio: the `products` collection in Order, or `products` from the
 * dictionaries when the collection is empty or the database is unreachable.
 *
 * A CMS product is matched to a dictionary product by slug. The match fills
 * any field the CMS leaves empty, in the order described in lib/pages.ts, and
 * supplies the logo and screenshot that ship with the site when none has been
 * uploaded. Never throws.
 */

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  badge: string | null;
  tags: string[];
  logo: { url: string; alt: string };
  image: { url: string; alt: string } | null;
};

type ProductDoc = {
  slug?: string | null;
  name?: string | null;
  tagline?: unknown;
  description?: unknown;
  url?: string | null;
  badge?: unknown;
  tags?: unknown;
  logo?: unknown;
  image?: unknown;
};

/** The CMS keeps tags as one comma separated line. */
const splitTags = (line: string) =>
  line
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

function fromDictionary(locale: Locale): Product[] {
  return getDictionary(locale).products.map((product) => ({
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    url: product.url,
    badge: product.badge || null,
    tags: product.tags,
    logo: { url: product.logo, alt: product.name },
    image: product.image ? { url: product.image, alt: product.imageAlt } : null,
  }));
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  const fallback = fromDictionary(locale);
  const docs = await findDocs<ProductDoc>("products", {
    sort: "order",
    depth: 1,
    locale: ALL_LOCALES,
  });
  if (!docs || docs.length === 0) return fallback;

  const products: Product[] = [];
  for (const doc of docs) {
    const slug = doc.slug?.trim();
    const name = doc.name?.trim();
    if (!slug || !name) continue;
    if (products.some((product) => product.slug === slug)) continue;
    const known = fallback.find((product) => product.slug === slug);

    // The card is built around the logo. A product with no upload and no logo
    // shipped with the site is left out until it has one.
    const logo = mediaImage(doc.logo, locale, name) ?? known?.logo ?? null;
    if (!logo) continue;

    const tags = splitTags(resolveText(doc.tags, locale, known?.tags.join(", ")));

    products.push({
      slug,
      name,
      tagline: resolveText(doc.tagline, locale, known?.tagline),
      description: resolveText(doc.description, locale, known?.description),
      url: doc.url?.trim() || known?.url || "",
      badge: resolveText(doc.badge, locale, known?.badge ?? "") || null,
      tags,
      logo,
      image:
        mediaImage(doc.image, locale, known?.image?.alt ?? name) ??
        known?.image ??
        null,
    });
  }

  // Rows exist but none can be shown: the dictionary beats an empty section.
  return products.length > 0 ? products : fallback;
}
