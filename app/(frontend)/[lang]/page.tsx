import Hero from "./components/hero";
import Marquee from "./components/marquee";
import AboutIntro from "./components/about-intro";
import Services from "./components/services";
import Highlight from "./components/highlight";
import Industries from "./components/industries";
import Portfolio from "./components/portfolio";
import Stats from "./components/stats";
import Testimonial from "./components/testimonial";
import Insights from "./components/insights";
import Contact from "./components/contact";
import Footer from "./components/footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeatured, contactLinks } from "@/lib/team";

// Revalidate so CMS-managed content (case studies, insights) refreshes periodically.
export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  const featured = await getFeatured(locale);
  const { whatsappUrl, telUrl } = contactLinks(featured?.phone);

  return (
    <main>
      <Hero
        dict={dict.hero}
        featured={featured}
        whatsappUrl={whatsappUrl}
        telUrl={telUrl}
      />
      <Marquee />
      <AboutIntro locale={locale} />
      <Services locale={locale} />
      <Highlight locale={locale} />
      <Industries locale={locale} />
      <Portfolio locale={locale} />
      <Stats locale={locale} />
      <Testimonial locale={locale} />
      <Insights locale={locale} />
      <Contact locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
