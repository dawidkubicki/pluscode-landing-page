import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { locales, defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Locale routing. Every public page lives under a locale prefix (`/en`, `/pl`).
 * Requests without one are redirected to the best match for the visitor's
 * `Accept-Language` header, defaulting to English.
 *
 * The matcher below keeps Payload's admin/API (`/admin`, `/api`), uploaded
 * media and Next internals out of this entirely — they must never be prefixed.
 */

/** Pick the best supported locale from an `Accept-Language` header. */
function negotiateLocale(header: string | null): string {
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
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = negotiateLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Run on everything except Payload admin/API, uploaded media, Next internals
  // and any file with an extension (favicon, og images, etc.).
  matcher: ["/((?!api|admin|_next|media|.*\\..*).*)"],
};
