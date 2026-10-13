/**
 * The four destinations, in order. Kept in a module with no directive of its
 * own so the server header, the client header bar and the hero can all import
 * the same array (a value exported from a "use client" file reaches a server
 * component as a reference, not as the array).
 */
export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
