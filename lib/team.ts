import { findDocs } from "./cms";
import type { Locale } from "./i18n/config";

/** A Payload upload relation: populated object, an id, or empty. */
type MediaRel =
  | { url?: string | null; alt?: string | null }
  | string
  | number
  | null
  | undefined;

type TeamDoc = {
  id: string | number;
  name: string;
  role?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  photo?: MediaRel;
  featuredOnHome?: boolean | null;
  order?: number | null;
};

export type Img = { url: string; alt: string } | null;

/** Map a Payload upload relation (populated or id) to a renderable image. */
export function img(rel: MediaRel, fallbackAlt = ""): Img {
  if (rel && typeof rel === "object" && "url" in rel && rel.url) {
    return { url: rel.url, alt: rel.alt ?? fallbackAlt };
  }
  return null;
}

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  photo: Img;
};

function resolve(m: TeamDoc): TeamMember {
  return {
    id: String(m.id),
    name: m.name,
    role: m.role ?? null,
    bio: m.bio ?? null,
    email: m.email ?? null,
    phone: m.phone ?? null,
    linkedin: m.linkedin ?? null,
    photo: img(m.photo, m.name),
  };
}

/** All team members, ordered. Empty array when the CMS is unreachable. */
export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  const docs = await findDocs<TeamDoc>("team", {
    sort: "order",
    limit: 100,
    depth: 1,
    locale,
  });
  return docs ? docs.map(resolve) : [];
}

export type Featured = {
  name: string;
  role: string | null;
  phone: string | null;
  photo: Img;
} | null;

/** First team member flagged for the homepage hero card, resolved with photo. */
export async function getFeatured(locale: Locale): Promise<Featured> {
  const docs = await findDocs<TeamDoc>("team", {
    where: { featuredOnHome: { equals: true } },
    sort: "order",
    limit: 1,
    depth: 1,
    locale,
  });
  const member = docs && docs.length > 0 ? resolve(docs[0]) : null;
  if (!member) return null;
  return {
    name: member.name,
    role: member.role,
    phone: member.phone,
    photo: member.photo,
  };
}

/** Office fallback number when the featured member has no phone set. */
const OFFICE_PHONE = "+48 667 688 927";

/** Build wa.me / tel: links from a human-entered phone string. */
export function contactLinks(phone: string | null | undefined) {
  const digits = (phone || OFFICE_PHONE).replace(/[^0-9]/g, "");
  return { whatsappUrl: `https://wa.me/${digits}`, telUrl: `tel:+${digits}` };
}
