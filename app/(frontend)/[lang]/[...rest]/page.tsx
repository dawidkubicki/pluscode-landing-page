import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Every address under a locale that no other route claims. Without this the
 * framework answers with its own bare 404; calling `notFound()` from inside
 * the locale segment hands the request to `[lang]/not-found.tsx`, so the
 * visitor gets the site's page, header and footer included.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: getDictionary(resolveLocale(lang)).notFound.title,
    robots: { index: false, follow: true },
  };
}

export default function CatchAll() {
  notFound();
}
