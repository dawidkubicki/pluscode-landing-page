import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import type { Dictionary } from "./i18n/dictionaries";
import { img } from "./team";

/* ------------------------------------------------------------------ *
 *  THE FOUR EDITABLE HOME BANDS: Clients, Cases, Insights, Stories.
 *
 *  Each reader returns EXACTLY the shape its band already renders, taken
 *  straight off the dictionary type, so a band's markup never has to know
 *  where its items came from. Nothing here maps to a new render model.
 *
 *  EVERY READER CAN RETURN null, and that is the whole point. findDocs
 *  already answers null rather than throwing when Payload or the database
 *  is unreachable, which is what lets the site build in CI with no
 *  DATABASE_URI. These readers extend that: null also means "the CMS is
 *  up and has nothing to say about this band", either because no document
 *  is flagged for it or because the flagged ones are missing a part the
 *  band cannot render without. The page then passes nothing down and the
 *  band falls through to dictionaries/{en,pl,de}.json, exactly as it did
 *  before any of this existed.
 *
 *  SO A HALF FILLED CMS NEVER HALF FILLS A BAND. An item with no image
 *  would render a grey box where a picture belongs, and one with no tag
 *  would put a blank button on the Insights tab strip, so incomplete
 *  documents are dropped rather than shown. If dropping them empties the
 *  band, the dictionary takes it back whole.
 *
 *  HREFS CARRY NO LOCALE. LocaleLink prefixes the current language, so a
 *  path built here is written "/insights/<slug>", never "/en/insights/…".
 *  The one exception is an item pointing somewhere else entirely, which
 *  the editor writes in full and the band opens in a new tab.
 * ------------------------------------------------------------------ */

export type ClientsItems = Dictionary["home"]["clients"]["items"];
export type CasesItems = Dictionary["home"]["cases"]["items"];
export type StoriesItems = Dictionary["home"]["stories"]["items"];
export type LatestItems = Dictionary["home"]["latest"]["items"];

/** A Payload upload relation, as `img()` accepts it. */
type MediaRel = Parameters<typeof img>[0];

/** Cases and Stories are three staggered cards, and the stagger is defined
 *  per position for exactly three. Insights is a five item tab strip. Past
 *  those counts the layouts repeat their first shape, so the readers cap
 *  instead: an editor who flags a fourth case gets the first three, not a
 *  band that quietly changes shape. */
const CARDS_PER_BAND = 3;
const TABS_IN_INSIGHTS_BAND = 5;

type ClientDoc = {
  id: string | number;
  name?: string | null;
  what?: string | null;
  logo?: MediaRel;
};

type CaseStudyBandDoc = {
  id: string | number;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  heroImage?: MediaRel;
};

type InsightBandDoc = {
  id: string | number;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  coverImage?: MediaRel;
  homeTag?: string | null;
  homeHref?: string | null;
};

/** An optional CMS string, or null when it is absent or only whitespace. */
function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Nothing to say: either no documents at all, or none complete enough. */
function orNull<T>(items: T[]): T[] | null {
  return items.length > 0 ? items : null;
}

/**
 * "Selected clients": a name and one line each, in Order.
 *
 * The logo is the one optional part of a client, so a document without one is
 * still complete and is returned as usual. It does cost the band its marks:
 * components/clients.tsx shows them only when every client has one.
 *
 * `depth: 1` is what resolves the upload relation to a document with a `url`
 * on it. At depth 0 it comes back as a bare id, `img()` reads that as no
 * image, and the band would lose every mark at once with nothing to say why.
 */
export async function getClientsBand(
  locale: Locale,
): Promise<ClientsItems | null> {
  const docs = await findDocs<ClientDoc>("clients", {
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 12,
    depth: 1,
    locale,
  });
  if (!docs) return null;

  return orNull(
    docs.flatMap((doc) => {
      const name = text(doc.name);
      const what = text(doc.what);
      if (!name || !what) return [];
      /* "" and not null for an absent mark, so a CMS client and a
         dictionary one are the same type and the band can treat both
         with a plain truthiness check. */
      return [
        { key: `client-${doc.id}`, name, what, logo: img(doc.logo, name)?.url ?? "" },
      ];
    }),
  );
}

/**
 * "Cases": the three case studies flagged for the home page.
 *
 * The caption is the case study's excerpt and the headline is its title,
 * because both already exist on the document and both already do this job
 * on the /case-studies cards. Only the flag is new.
 */
export async function getCasesBand(
  locale: Locale,
): Promise<CasesItems | null> {
  const docs = await findDocs<CaseStudyBandDoc>("case-studies", {
    where: { showOnHome: { equals: true } },
    sort: "order",
    limit: CARDS_PER_BAND,
    depth: 1,
    locale,
  });
  if (!docs) return null;

  return orNull(
    docs.flatMap((doc) => {
      const slug = text(doc.slug);
      const title = text(doc.title);
      const image = img(doc.heroImage, title ?? "");
      if (!slug || !title || !image) return [];
      return [
        {
          key: `case-${doc.id}`,
          caption: text(doc.excerpt) ?? "",
          title,
          image: image.url,
          alt: image.alt,
          href: `/case-studies/${slug}`,
        },
      ];
    }),
  );
}

/**
 * "Stories": the three insights flagged for the lower editorial band.
 *
 * Same anatomy as Cases, read out of `insights` instead, so an article can
 * appear here, in the Insights tab strip, in both, or in neither.
 */
export async function getStoriesBand(
  locale: Locale,
): Promise<StoriesItems | null> {
  const docs = await findDocs<InsightBandDoc>("insights", {
    where: { showInStoriesBand: { equals: true } },
    sort: "homeOrder",
    limit: CARDS_PER_BAND,
    depth: 1,
    locale,
  });
  if (!docs) return null;

  return orNull(
    docs.flatMap((doc) => {
      const slug = text(doc.slug);
      const title = text(doc.title);
      const image = img(doc.coverImage, title ?? "");
      if (!slug || !title || !image) return [];
      return [
        {
          key: `story-${doc.id}`,
          caption: text(doc.excerpt) ?? "",
          title,
          image: image.url,
          alt: image.alt,
          href: text(doc.homeHref) ?? `/insights/${slug}`,
        },
      ];
    }),
  );
}

/**
 * "Insights": the five item tab strip.
 *
 * The tag has no equivalent on the document (`category` is a fixed list of
 * six section names, not a label for one article), so an article without a
 * Home tag is left out rather than given a blank tab.
 */
export async function getLatestBand(
  locale: Locale,
): Promise<LatestItems | null> {
  const docs = await findDocs<InsightBandDoc>("insights", {
    where: { showInInsightsBand: { equals: true } },
    sort: "homeOrder",
    limit: TABS_IN_INSIGHTS_BAND,
    depth: 1,
    locale,
  });
  if (!docs) return null;

  return orNull(
    docs.flatMap((doc) => {
      const slug = text(doc.slug);
      const title = text(doc.title);
      const tag = text(doc.homeTag);
      const image = img(doc.coverImage, title ?? "");
      if (!slug || !title || !tag || !image) return [];
      return [
        {
          key: `insight-${doc.id}`,
          tag,
          title,
          body: text(doc.excerpt) ?? "",
          href: text(doc.homeHref) ?? `/insights/${slug}`,
          image: image.url,
          alt: image.alt,
        },
      ];
    }),
  );
}
