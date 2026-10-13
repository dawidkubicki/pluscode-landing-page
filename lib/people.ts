import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { ALL_LOCALES, resolveText } from "./pages";

/**
 * The people on the home and About pages: the `team` collection in Order, or
 * `people` from the dictionaries when the collection is empty or the database
 * is unreachable.
 *
 * A CMS person is matched to a dictionary person by name. The match supplies
 * the `key`, the portrait that ships with the site, and the role and bio for
 * any field the CMS leaves empty, in the order described in lib/pages.ts.
 * Never throws.
 */

export type Person = {
  key: string;
  name: string;
  role: string;
  bio: string;
  linkedin: string | null;
  image: { url: string; alt: string };
};

/** The portraits in public/assets/team/, for a person the dictionary no longer lists. */
const STATIC_PORTRAITS = new Set([
  "/assets/team/dawid-kubicki.webp",
  "/assets/team/ada-kubicka.webp",
]);

/** "Ada Kubicka" and " ada  kubicka" are one person, and one file name. */
const nameSlug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * A Payload upload read at depth 1, as something an `<img>` can use. Null for
 * an empty relation or an id that was not populated. `alt` is localized on
 * `media`, so it arrives as text or, with ALL_LOCALES, as one text per
 * language. Shared with lib/products.ts and lib/news.ts.
 */
export function mediaImage(
  media: unknown,
  locale: Locale,
  fallbackAlt: string,
): { url: string; alt: string } | null {
  if (media === null || typeof media !== "object") return null;
  const { url, alt } = media as { url?: unknown; alt?: unknown };
  if (typeof url !== "string" || url === "") return null;
  return { url, alt: resolveText(alt, locale, fallbackAlt) };
}

type TeamDoc = {
  name?: string | null;
  role?: unknown;
  bio?: unknown;
  linkedin?: string | null;
  photo?: unknown;
};

function fromDictionary(locale: Locale): Person[] {
  return getDictionary(locale).people.map((person) => ({
    key: person.key,
    name: person.name,
    role: person.role,
    bio: person.bio,
    linkedin: person.linkedin || null,
    image: { url: person.image, alt: person.alt },
  }));
}

export async function getPeople(locale: Locale): Promise<Person[]> {
  const fallback = fromDictionary(locale);
  const docs = await findDocs<TeamDoc>("team", {
    sort: "order",
    depth: 1,
    locale: ALL_LOCALES,
  });
  if (!docs || docs.length === 0) return fallback;

  const people: Person[] = [];
  for (const doc of docs) {
    const name = doc.name?.trim();
    if (!name) continue;
    const slug = nameSlug(name);
    const known = fallback.find((person) => nameSlug(person.name) === slug);
    const key = known?.key ?? slug;
    if (people.some((person) => person.key === key)) continue;

    // The uploaded photo wins. Without one, the portrait that ships with the
    // site. Without either there is nothing to put in a portrait card, so the
    // person is left out until a photo is uploaded.
    const shipped = `/assets/team/${slug}.webp`;
    const image =
      mediaImage(doc.photo, locale, known?.image.alt ?? name) ??
      known?.image ??
      (STATIC_PORTRAITS.has(shipped) ? { url: shipped, alt: name } : null);
    if (!image) continue;

    people.push({
      key,
      name,
      role: resolveText(doc.role, locale, known?.role),
      bio: resolveText(doc.bio, locale, known?.bio),
      linkedin: doc.linkedin?.trim() || known?.linkedin || null,
      image,
    });
  }

  // Rows exist but none can be shown: the dictionary beats an empty section.
  return people.length > 0 ? people : fallback;
}
