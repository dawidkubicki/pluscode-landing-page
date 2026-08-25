import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndustryPage, {
  industryMetadata,
  type IndustrySlug,
} from "../../components/industry-page";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const SLUGS: IndustrySlug[] = [
  "finance",
  "healthcare",
  "ecommerce",
  "hr",
  "logistics",
  "legal",
  "ai",
  "saas",
  "manufacturing",
];

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);
const isSlug = (s: string): s is IndustrySlug =>
  (SLUGS as string[]).includes(s);

export function generateStaticParams() {
  return locales.flatMap((lang) => SLUGS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSlug(slug)) return {};
  return industryMetadata(resolve(lang), slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isSlug(slug)) notFound();
  return <IndustryPage locale={resolve(lang)} slug={slug} />;
}
