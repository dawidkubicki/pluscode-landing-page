import { COMPANY, SITE_URL } from "./company";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { absoluteUrl, localePath } from "./seo";

/**
 * schema.org builders. Each returns a plain object for `<JsonLd data={...} />`.
 * Stable `@id`s let the blocks on different pages refer to the same
 * organization, site and people instead of describing them again.
 */

type Ld = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

type PersonInput = {
  key: string;
  name: string;
  role: string;
  bio: string;
  linkedin: string | null;
  image: { url: string; alt: string };
};

type ProductInput = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  logo: { url: string; alt: string };
  image: { url: string; alt: string } | null;
};

type ArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  updatedAt?: string | null;
  author?: string;
  image: { url: string; alt: string } | null;
};

const abs = (url: string) => (url.startsWith("http") ? url : absoluteUrl(url));

export function personId(key: string): string {
  return `${SITE_URL}/#${key}`;
}

export function organizationLd(locale: Locale): Ld {
  const meta = getDictionary(locale).meta;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/icon-512.png"),
    description: meta.description,
    email: COMPANY.email,
    vatID: COMPANY.nip,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.countryCode,
    },
    sameAs: [COMPANY.linkedin],
  };
}

export function websiteLd(locale: Locale): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: COMPANY.name,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

export function webPageLd(
  locale: Locale,
  page: {
    path: string;
    name: string;
    description: string;
    type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  },
): Ld {
  const url = absoluteUrl(localePath(locale, page.path));
  return {
    "@context": "https://schema.org",
    "@type": page.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.name,
    description: page.description,
    inLanguage: locale,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function personLd(person: PersonInput): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(person.key),
    name: person.name,
    jobTitle: person.role,
    description: person.bio,
    image: abs(person.image.url),
    worksFor: { "@id": ORG_ID },
    ...(person.linkedin ? { sameAs: [person.linkedin] } : {}),
  };
}

export function softwareApplicationLd(product: ProductInput): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#${product.slug}`,
    name: product.name,
    description: product.description,
    url: product.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    image: abs(product.image?.url ?? product.logo.url),
    publisher: { "@id": ORG_ID },
  };
}

export function newsArticleLd(locale: Locale, article: ArticleInput): Ld {
  const url = absoluteUrl(localePath(locale, `/news/${article.slug}`));
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: article.title,
    description: article.excerpt,
    inLanguage: locale,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    ...(article.image ? { image: [abs(article.image.url)] } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbLd(
  locale: Locale,
  items: { name: string; path: string }[],
): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localePath(locale, item.path)),
    })),
  };
}
