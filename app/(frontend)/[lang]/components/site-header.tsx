import HeaderBar from "./chrome/header-bar";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* The four destinations, in order. Shared with the hero and the menu. They
   live in chrome/nav-items so a client component can import the array too. */
export { NAV_ITEMS, type NavKey } from "./chrome/nav-items";

/**
 * The site header. The bar reads the route and the scroll position, so it is
 * a client component; this wrapper keeps the layout's import a server one and
 * hands over only the navigation labels.
 */
export default function SiteHeader({
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  return <HeaderBar nav={nav} />;
}
