import type { Metadata } from "next";
import { BookingScreen } from "../components/booking-screen";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const c = getDictionary(resolve(lang)).consultation;
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function BookACallPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const dict = getDictionary(locale);
  const c = dict.consultation;

  return (
    <BookingScreen
      locale={locale}
      form={dict.workshops.form}
      booking={dict.booking}
      clients={dict.trust.clients}
      eyebrow={c.eyebrow}
      title={c.title}
      intro={c.subtitle}
      offering="general"
      fields={["company", "useCase", "timeline", "message"]}
      submitLabel={c.submit}
      source="/book-a-call"
      back={{ href: "/", label: c.backLabel }}
    />
  );
}
