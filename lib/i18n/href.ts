import { locales, type Locale } from "./config";

/**
 * Prefix an internal path with a locale (`/about` → `/pl/about`).
 *
 * Pass-through for anything that isn't a locale-routable internal path:
 * external URLs, `mailto:`/`tel:`, in-page `#anchors`, and paths that already
 * start with a known locale.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href; // external, mailto, tel, #hash, relative
  const [firstSegment] = href.slice(1).split("/");
  if ((locales as readonly string[]).includes(firstSegment)) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}
