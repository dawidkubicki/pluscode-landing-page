import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "../components/legal-page";
import { resolveLocale } from "@/lib/i18n/config";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  return legalMetadata(resolveLocale(lang), "terms");
}

export default async function TermsOfUsePage({ params }: { params: Params }) {
  const { lang } = await params;
  return <LegalPage locale={resolveLocale(lang)} doc="terms" />;
}
