import Hero from "./components/hero";
import Services from "./components/services";
import Metrics from "./components/metrics";
import Offerings from "./components/offerings";
import Process from "./components/process";
import UseCases from "./components/use-cases";
import Banner from "./components/banner";
import Industries from "./components/industries";
import Portfolio from "./components/portfolio";
import Reports from "./components/reports";
import Testimonial from "./components/testimonial";
import Insights from "./components/insights";
import Footer from "./components/footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTrustLogos } from "@/lib/trust";

// Revalidate so CMS-managed content (case studies, insights, reports,
// use cases) refreshes periodically.
export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  const trustLogos = await getTrustLogos();

  return (
    <main>
      <Hero dict={dict.hero} trust={dict.trust} logos={trustLogos} />
      <Services locale={locale} />
      <Metrics locale={locale} />
      <Offerings locale={locale} />
      <Process locale={locale} />
      <UseCases locale={locale} />
      <Industries locale={locale} />
      <Banner dict={dict.banners.documents} />
      <Portfolio locale={locale} />
      <Reports locale={locale} />
      <Testimonial locale={locale} />
      <Insights locale={locale} />
      <Banner dict={dict.banners.move} className="border-t border-night-line" />
      <Footer locale={locale} />
    </main>
  );
}
