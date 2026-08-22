import type { Metadata } from "next";
import ServicePage, { serviceMetadata } from "../../components/service-page";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return serviceMetadata(resolve(lang), "teamExtension");
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ServicePage locale={resolve(lang)} service="teamExtension" visual="aurora" />;
}
