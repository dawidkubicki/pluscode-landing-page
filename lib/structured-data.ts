import { COMPANY, SITE_URL } from "./company";
import { locales, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { absoluteUrl, localePath, ogCardPath, OG_CARD } from "./seo";

/**
 * schema.org builders. Each returns a plain object for `<JsonLd data={...} />`.
 * Stable `@id`s let the blocks on different pages refer to the same
 * organization, site and people instead of describing them again.
 *
 * Only what the company can show a register entry, a page or a file for goes
 * in here. No offers, prices, ratings, founding dates or head counts: a
 * property that is not true is worse than a property that is missing.
 */

type Ld = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

/** `key` of the founder in `people`, which is what `founder` points at. */
const FOUNDER_KEY = "dawid";

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
  tags?: string[];
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
  category?: string;
  readTime?: number;
  image: { url: string; alt: string } | null;
};

const abs = (url: string) => (/^https?:\/\//.test(url) ? url : absoluteUrl(url));

/** Copy holds paragraphs; a schema.org text property is one run of text. */
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

export function personId(key: string): string {
  return `${SITE_URL}/#${key}`;
}

/** The square mark. Google asks for a logo of at least 112 by 112 pixels. */
function logoLd(): Ld {
  const url = absoluteUrl("/icon-512.png");
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url,
    contentUrl: url,
    width: 512,
    height: 512,
    caption: COMPANY.name,
  };
}

/**
 * The organization as other nodes embed it. A bare `{ "@id": ... }` is enough
 * for a JSON-LD processor, but Google reads `author` and `publisher` where it
 * finds them, so the name, the site's address and the logo travel with it.
 */
function organizationRef(): Ld {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    url: SITE_URL,
    logo: logoLd(),
  };
}

export function organizationLd(locale: Locale): Ld {
  const dict = getDictionary(locale);
  const founder = dict.people.find((p) => p.key === FOUNDER_KEY);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: logoLd(),
    image: { "@id": LOGO_ID },
    description: dict.meta.description,
    email: COMPANY.email,
    vatID: COMPANY.nip,
    // The two register numbers schema.org has no property of their own for.
    identifier: [
      { "@type": "PropertyValue", propertyID: "KRS", value: COMPANY.krs },
      { "@type": "PropertyValue", propertyID: "REGON", value: COMPANY.regon },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      postalCode: COMPANY.postalCode,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: COMPANY.email,
      availableLanguage: [...locales],
    },
    ...(founder
      ? {
          founder: {
            "@type": "Person",
            "@id": personId(founder.key),
            name: founder.name,
          },
        }
      : {}),
    // The products the company makes and runs under their own names.
    brand: dict.products.map((product) => ({
      "@type": "Brand",
      name: product.name,
      url: product.url,
    })),
    sameAs: [COMPANY.linkedin],
  };
}

/** One site in two languages, so the node is the same on `/en` and `/pl`. */
export function websiteLd(locale: Locale): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: COMPANY.name,
    alternateName: COMPANY.legalName,
    description: getDictionary(locale).meta.description,
    inLanguage: [...locales],
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
  const type = page.type ?? "WebPage";
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: page.name,
    description: oneLine(page.description),
    inLanguage: locale,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    // The About and Contact pages are about one thing: the company itself.
    ...(type === "AboutPage" || type === "ContactPage"
      ? { mainEntity: { "@id": ORG_ID } }
      : {}),
  };
}

export function personLd(person: PersonInput): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(person.key),
    name: person.name,
    jobTitle: person.role,
    description: oneLine(person.bio),
    image: abs(person.image.url),
    worksFor: { "@id": ORG_ID },
    ...(person.linkedin ? { sameAs: [person.linkedin] } : {}),
  };
}

/**
 * A product in the portfolio. Deliberately without `offers` or
 * `aggregateRating`: prices live on the product's own site and there are no
 * ratings to report, so Google will not draw a software rich result from this
 * block. It still says what the product is and who makes it.
 */
export function softwareApplicationLd(product: ProductInput): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#${product.slug}`,
    name: product.name,
    description: oneLine(product.description),
    disambiguatingDescription: oneLine(product.tagline),
    url: product.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    image: abs(product.image?.url ?? product.logo.url),
    ...(product.image
      ? {
          screenshot: {
            "@type": "ImageObject",
            url: abs(product.image.url),
            caption: product.image.alt,
          },
        }
      : {}),
    ...(product.tags?.length ? { keywords: product.tags.join(", ") } : {}),
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function newsArticleLd(locale: Locale, article: ArticleInput): Ld {
  const dict = getDictionary(locale);
  const url = absoluteUrl(localePath(locale, `/news/${article.slug}`));

  /* The byline is free text in the CMS. Only a name that matches someone on
     the People list becomes a Person; anything else, the default "Pluscode"
     included, is the company writing as itself. */
  const byline = article.author?.trim().toLowerCase();
  const writer = byline
    ? dict.people.find((p) => p.name.toLowerCase() === byline)
    : undefined;
  const author: Ld = writer
    ? {
        "@type": "Person",
        "@id": personId(writer.key),
        name: writer.name,
        ...(writer.linkedin ? { url: writer.linkedin } : {}),
      }
    : organizationRef();

  const categories: Record<string, string> = dict.newsCategories;
  const section = article.category ? categories[article.category] : undefined;

  // An article without a cover is shared with the site's card, so that is
  // also the picture it is described with.
  const image = article.image
    ? [abs(article.image.url)]
    : [
        {
          "@type": "ImageObject",
          url: absoluteUrl(ogCardPath(locale)),
          width: OG_CARD.width,
          height: OG_CARD.height,
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": SITE_ID },
    headline: oneLine(article.title),
    description: oneLine(article.excerpt),
    inLanguage: locale,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt || article.publishedAt
      ? { dateModified: article.updatedAt ?? article.publishedAt }
      : {}),
    image,
    ...(section ? { articleSection: section } : {}),
    ...(article.readTime ? { timeRequired: `PT${Math.round(article.readTime)}M` } : {}),
    author,
    publisher: organizationRef(),
  };
}

export function breadcrumbLd(
  locale: Locale,
  items: { name: string; path: string }[],
): Ld {
  const last = items.at(-1);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(last
      ? { "@id": `${absoluteUrl(localePath(locale, last.path))}#breadcrumb` }
      : {}),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localePath(locale, item.path)),
    })),
  };
}
