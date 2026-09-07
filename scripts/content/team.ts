/**
 * The two people who actually do the work, and only the two.
 *
 * This is the single source of truth for the `team` collection, shared by
 * scripts/seed.ts (first boot) and scripts/seed-team.ts (reconcile an existing
 * database). Names, contact details and ordering live here; the role line and
 * the bio are read from dictionaries/{en,pl,de}.json so the CMS and the
 * dictionary fallback on /about can never say two different things, and so
 * Polish and German visitors get their own copy instead of the English one.
 *
 * Nobody is invented here. Adding a person means adding a real one.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

export const TEAM_LOCALES = ["en", "pl", "de"] as const;
export type TeamLocale = (typeof TEAM_LOCALES)[number];

export type TeamPerson = {
  /** Key under pages.about.team.members in every dictionary. */
  key: "dawid" | "krzysztof";
  name: string;
  /** File in public/assets/team/. The 3:4 portrait register, /about only. */
  photo: string;
  email: string;
  phone?: string;
  linkedin?: string;
  /** The person on the booking card and in the contact widget. Exactly one. */
  featuredOnHome: boolean;
  /** Lower first. Dawid left, Krzysztof right, matching the founders photo. */
  order: number;
};

export const TEAM: TeamPerson[] = [
  {
    key: "dawid",
    name: "Dawid Kubicki",
    photo: "dawid-kubicki.jpg",
    email: "contact@pluscode.io",
    phone: "+48 667 688 927",
    linkedin: "https://www.linkedin.com/company/pluscode",
    featuredOnHome: false,
    order: 0,
  },
  {
    key: "krzysztof",
    name: "Krzysztof Suliński",
    photo: "krzysztof-sulinski.jpg",
    email: "contact@pluscode.io",
    featuredOnHome: true,
    order: 1,
  },
];

type Member = { name: string; role: string; bio: string };

/** pages.about.team.members for one locale, straight off the dictionary. */
function members(locale: TeamLocale): Record<string, Member> {
  const dict = JSON.parse(
    fs.readFileSync(path.join(root, `dictionaries/${locale}.json`), "utf8"),
  );
  return dict.pages.about.team.members;
}

/** The localized role line and bio for one person. */
export function copyFor(person: TeamPerson, locale: TeamLocale): { role: string; bio: string } {
  const m = members(locale)[person.key];
  if (!m) throw new Error(`dictionaries/${locale}.json has no about team member "${person.key}"`);
  return { role: m.role, bio: m.bio };
}

/** Absolute path to the portrait that belongs to this person. */
export function photoPath(person: TeamPerson): string {
  return path.join(root, "public/assets/team", person.photo);
}

/** The full default-locale record, ready for payload.create or .update. */
export function teamDoc(person: TeamPerson) {
  const { role, bio } = copyFor(person, "en");
  return {
    name: person.name,
    role,
    bio,
    email: person.email,
    phone: person.phone,
    linkedin: person.linkedin,
    featuredOnHome: person.featuredOnHome,
    order: person.order,
  };
}
