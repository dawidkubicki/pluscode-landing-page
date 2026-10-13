import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Locale routing, and the redirects from the site this one replaced.
 *
 * Every public page lives under a locale prefix (`/en`, `/pl`). A request
 * without one is sent to the best match for the visitor's `Accept-Language`
 * header, English when there is none, which is what a crawler gets.
 *
 * Until October 2026 this domain served a much larger site in three languages.
 * Its addresses are still linked and indexed, so each one is answered with a
 * single permanent redirect to the page that took its place. The mapping is
 * done here rather than in `next.config.ts` because the language and the
 * section both change for some of them (`/de/insights/x` to `/en/news/x`), and
 * two rules in the config would mean two hops.
 */

/** Languages the previous site served and this one does not. */
const RETIRED_LOCALES = new Map<string, Locale>([["de", "en"]]);

/** Sections that moved: whatever follows the name is kept. */
const MOVED_SECTIONS = new Map([["insights", "news"]]);

/** Single pages that were folded into another page. */
const MOVED_PAGES = new Map([["book-a-call", "contact"]]);

/** Sections that are gone. They and everything under them go to the home page. */
const REMOVED_SECTIONS = new Set([
  "quanty",
  "case-studies",
  "services",
  "solutions",
  "ai-data",
  "industries",
  "workshops",
  "announcements",
  "site-map",
]);

/**
 * Never prefixed and never redirected: Payload's admin and API, uploads, Next
 * internals, static folders, and anything that is a file. The matcher at the
 * foot of this file already keeps them out; this is the same rule in code, so
 * a change to one cannot silently expose them.
 */
const RESERVED = /^\/(?:api|admin|_next|media|assets|og|\.well-known)(?:\/|$)/;
const HAS_EXTENSION = /\.[^/]+$/;

/**
 * Where a path of the previous site lives now. `segments` is the path after
 * the locale. Returns null when the path is not one of the old ones.
 */
function relocate(segments: string[]): string[] | null {
  const [section, ...rest] = segments;
  if (!section) return null;
  const renamed = MOVED_SECTIONS.get(section);
  if (renamed) return [renamed, ...rest];
  const page = MOVED_PAGES.get(section);
  if (page) return [page];
  if (REMOVED_SECTIONS.has(section)) return [];
  return null;
}

/** Pick the best supported locale from an `Accept-Language` header. */
function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  // "pl-PL,pl;q=0.9,en;q=0.8" -> [{ tag: "pl", q: 1 }, ...] sorted by quality.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

function redirect(
  request: NextRequest,
  locale: Locale,
  segments: string[],
  status: 307 | 308,
) {
  // Cloning keeps the query string, so campaign parameters survive the hop.
  const url = request.nextUrl.clone();
  url.pathname = `/${[locale, ...segments].join("/")}`;
  return NextResponse.redirect(url, status);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (RESERVED.test(pathname) || HAS_EXTENSION.test(pathname)) return;

  const [first, ...rest] = pathname.split("/").filter(Boolean);
  // A language typed in capitals (`/PL/about`) is still that language.
  const prefix = first?.toLowerCase();

  // Already under a language the site serves: only the old addresses move.
  if (prefix && isLocale(prefix)) {
    const moved = relocate(rest);
    if (!moved && prefix === first) return;
    return redirect(request, prefix, moved ?? rest, 308);
  }

  // A retired language: its replacement, and the section's new home, at once.
  const replacement = prefix ? RETIRED_LOCALES.get(prefix) : undefined;
  if (replacement) {
    return redirect(request, replacement, relocate(rest) ?? rest, 308);
  }

  // No language in the address. The answer depends on a request header, so it
  // is a temporary redirect and says which header it varied on. An old address
  // without a prefix is mapped in the same step.
  const segments = first ? [first, ...rest] : [];
  const response = redirect(
    request,
    negotiateLocale(request.headers.get("accept-language")),
    relocate(segments) ?? segments,
    307,
  );
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Everything except the reserved prefixes above and any path whose last
  // segment has an extension (robots.txt, sitemap.xml, llms.txt, the manifest,
  // icons, images).
  matcher: [
    "/((?!(?:api|admin|_next|media|assets|og|\\.well-known)(?:/|$)|.*\\.[^/]+$).*)",
  ],
};
