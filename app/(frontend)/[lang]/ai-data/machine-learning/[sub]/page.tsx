import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceSubpage, {
  getSubpage,
  subpageMetadata,
  subpageSlugs,
} from "../../../components/service-subpage";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const SERVICE = "machineLearning" as const;
const HREF_BASE = "/ai-data/machine-learning";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    subpageSlugs(SERVICE).map((sub) => ({ lang, sub })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; sub: string }>;
}): Promise<Metadata> {
  const { lang, sub } = await params;
  return subpageMetadata(resolve(lang), SERVICE, sub);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; sub: string }>;
}) {
  const { lang, sub } = await params;
  const locale = resolve(lang);
  if (!getSubpage(locale, SERVICE, sub)) notFound();
  return (
    <ServiceSubpage
      locale={locale}
      service={SERVICE}
      slug={sub}
      hrefBase={HREF_BASE}
    />
  );
}
