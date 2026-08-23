import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingScreen } from "../../components/booking-screen";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type WorkshopPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { duration: string; format: string; price: string; audience: string };
  overview: { title: string; paragraphs: string[] };
  outcomes: { title: string; items: string[] };
  agenda: { title: string; steps: { num: string; title: string; desc: string }[] };
  audience: { title: string; items: string[] };
  faq: { q: string; a: string }[];
  form: { title: string; note: string; cta: string };
};

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

export default async function WorkshopBookingPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const wp = getPage(locale, slug);
  if (!wp || !SLUGS.includes(slug as (typeof SLUGS)[number])) notFound();

  const dict = getDictionary(locale);
  const idx = dict.workshops.index;

  return (
    <BookingScreen
      locale={locale}
      form={dict.form}
      booking={dict.booking}
      clients={dict.trust.clients}
      eyebrow={wp.eyebrow}
      title={wp.title}
      intro={wp.subtitle}
      offering={slug}
      submitLabel={wp.form.cta}
      source={`/workshops/${slug}`}
      summary={{
        meta: [wp.meta.duration, wp.meta.format, wp.meta.price].join(" · "),
        points: wp.outcomes.items,
      }}
      back={{ href: "/workshops", label: idx.backToAll }}
    />
  );
}
