import type { Metadata } from "next";
import SolutionPage, { solutionMetadata } from "../../components/solution-page";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return solutionMetadata(resolve(lang), "answersFromDocuments");
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SolutionPage locale={resolve(lang)} solution="answersFromDocuments" />;
}
