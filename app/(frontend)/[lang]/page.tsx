import Hero from "./components/hero";
import Clients from "./components/clients";
import Services from "./components/services";
import Offerings from "./components/offerings";
import TimeSaved from "./components/time-saved";
import TokenMeasure from "./components/token-measure";
import Figures from "./components/figures";
import QuantyShowcase from "./components/quanty-showcase";
import People from "./components/people";
import Europe from "./components/europe";
import Banner from "./components/banner";
import Footer from "./components/footer";
import { Spacer } from "./components/ui";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTrustLogos } from "@/lib/trust";

// Revalidate so the CMS-managed content on this page (the client marks and
// the team members behind the people band) refreshes periodically.
export const revalidate = 60;

/**
 * The homepage band order, September 2026. This file decides the sequence
 * and nothing else: every band owns its own ground, padding and height.
 *
 *   1. Hero            the promise, on the WebGL mesh
 *   2. Clients         who we have built for: three named teams, one line each
 *   3. Services        five ways we take work off a desk, one 3D stage
 *   4. Offerings       four ways to start, each with a plain example
 *   5. TimeSaved       four jobs, hours today and after
 *   6. TokenMeasure    the paired half: what runs, by process
 *   7. Figures         four checkable numbers about this company
 *   8. QuantyShowcase  our own product, as proof we ship
 *   9. People          the two people who do the work
 *  10. Europe          where we are from and the rules the work follows
 *  11. Banner          the one dark call to action
 *  12. Footer
 *
 * The proof used to be one 130px strip of three names and three figures
 * under the hero. It is now two bands in two places: the names right after
 * the promise, where a reader asks "who else", and the figures after the
 * savings, where a reader asks "and can I believe you".
 */
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
      <Hero dict={dict.hero} />
      <Clients dict={dict.clients} logos={trustLogos} />
      <Services locale={locale} />
      <Offerings locale={locale} />
      <TimeSaved dict={dict.timeSaved} />
      <TokenMeasure locale={locale} />
      <Figures dict={dict.figures} stats={dict.hero.stats} />
      <QuantyShowcase dict={dict.quanty} />
      <Spacer h={120} />
      <People locale={locale} />
      <Europe locale={locale} />
      <Spacer h={96} />
      <Banner dict={dict.banners.move} />
      <Footer locale={locale} />
    </main>
  );
}
