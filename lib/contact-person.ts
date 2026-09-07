/**
 * The person behind the floating chat widget and the booking contact card.
 * Deliberately a static local constant rather than CMS content: this face and
 * name must be right on first paint, on every route, with no database round
 * trip and no chance of an empty CMS rendering initials.
 */
export const CONTACT_PERSON = {
  name: "Krzysztof Suliński",
  role: "AI Consultant",
  photo: { url: "/assets/team/krzysztof-avatar.jpg", alt: "Krzysztof Suliński" },
  /** Office line; override in the CMS `team` entry if he gets a direct number. */
  phone: "+48 667 688 927",
} as const;
