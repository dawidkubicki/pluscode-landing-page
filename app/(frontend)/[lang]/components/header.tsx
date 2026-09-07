/* ------------------------------------------------------------------ *
 *  THE SITE HEADER (the server half)
 *
 *  Keeps the signature layout.tsx calls, `<Header locale nav />`, and
 *  does one job the client half cannot: it reads `home.menu`, the three
 *  columns behind the Offerings trigger, straight from the dictionary.
 *
 *  WHY TWO MODULES. `@/lib/i18n/dictionaries` is `server-only`, and the
 *  bar needs scroll state, a focus trap and a scroll lock. A "use client"
 *  module may not import the dictionary and a server module may not call
 *  hooks, so the read and the interaction cannot share a file. Only the
 *  ~2KB menu slice crosses the boundary, which is why the header does not
 *  drag 300KB of page copy into the client bundle to reach it.
 *
 *  Everything visual lives in header-menu.tsx.
 * ------------------------------------------------------------------ */

import HeaderMenu from "./header-menu";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

export default function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["navigation"];
}) {
  const menu = getDictionary(locale).home.menu;

  return <HeaderMenu locale={locale} nav={nav} menu={menu} />;
}
