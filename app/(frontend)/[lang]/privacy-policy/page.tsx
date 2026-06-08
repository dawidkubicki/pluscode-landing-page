import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "../components/legal-page";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return legalMetadata(resolve(lang), "privacy");
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LegalPage locale={resolve(lang)} doc="privacy" />;
}
