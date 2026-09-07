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
  return serviceMetadata(resolve(lang), "forwardDeployedEngineers");
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // The offer here is a conversation with the engineer who would be embedded,
  // so both buttons go to the booking flow rather than the contact form.
  return (
    <ServicePage
      locale={resolve(lang)}
      service="forwardDeployedEngineers"
      visual="nodes"
      ctaHref="/book-a-call"
    />
  );
}
