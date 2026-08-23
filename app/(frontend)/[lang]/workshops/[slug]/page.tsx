import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkshopPageView, {
  type WorkshopPage,
} from "../../components/workshop-page";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Bookable offerings. Must match the `offering` options the API accepts. */
const SLUGS = [
  "ai-opportunity-workshop",
  "ai-discovery-sprint",
  "genai-proof-of-concept",
  "fractional-ai-team",
] as const;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

function getPage(locale: Locale, slug: string): WorkshopPage | null {
  const pages = getDictionary(locale).workshops.pages as unknown as Record<
    string,
    WorkshopPage
  >;
  return pages[slug] ?? null;
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    SLUGS.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const wp = getPage(resolve(lang), slug);
  if (!wp) return {};
  return { title: wp.title, description: wp.subtitle };
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const wp = getPage(locale, slug);
  if (!wp || !SLUGS.includes(slug as (typeof SLUGS)[number])) notFound();

  return <WorkshopPageView locale={locale} slug={slug} page={wp} />;
}
