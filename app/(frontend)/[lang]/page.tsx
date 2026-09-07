import Hero from "./components/hero";
import Latest from "./components/latest";
import Clients from "./components/clients";
import Platform from "./components/platform";
import Cases from "./components/cases";
import Stories from "./components/stories";
import Founders from "./components/founders";
import Locations from "./components/locations";
import Footer from "./components/footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MAP_VIEWBOX, MAP_BACKDROP } from "@/lib/europe-map";

export const revalidate = 60;

/**
 * The home page, September 2026.
 *
 * This file decides the sequence and nothing else. Every band owns its own
 * ground, its own vertical padding and its own grid placement, and no band
 * knows what sits above or below it.
 *
 * The order alternates ground so the page reads as a set of plates rather
 * than a scroll of boxes. Only three grounds exist and they are used in
 * this rhythm:
 *
 *   1. Hero        deep green over a video loop        (dark)
 *   2. Latest      the page ground, an index and one   (pale)
 *                  open story beside it
 *   3. Clients     the page ground, one ruled row      (pale)
 *   4. Platform    ink, and the only product on the    (dark)
 *                  site that is ours: Quanty
 *   5. Cases       the page ground, staggered grid     (pale)
 *   6. Stories     the page ground, staggered grid     (pale)
 *   7. Founders    the page ground, two quotes         (pale)
 *   8. Locations   deep green, the map                 (dark)
 *   9. Footer      carbon                              (dark)
 *
 * Cases and Stories deliberately share a ground and a grid: they are the
 * editorial middle of the page, and the reader should feel one long column
 * of work rather than two competing sections.
 *
 * There is no closing CTA band. The founders band carries the only ask on
 * the page, next to the faces of the people who answer.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  const home = dict.home;

  return (
    <main>
      <Hero dict={home.hero} />
      <Latest dict={home.latest} />
      <Clients dict={home.clients} />
      <Platform dict={home.platform} />
      <Cases dict={home.cases} />
      <Stories dict={home.stories} />
      <Founders dict={home.founders} />
      {/* The map's backdrop path is 60KB and is imported HERE, on the
          server, then handed down. Locations is a client component (the map
          and the pills share one selection), so importing the whole map
          module inside it would put every byte of that path into the client
          chunk as well as into the HTML. */}
      <Locations
        dict={home.locations}
        viewBox={MAP_VIEWBOX}
        backdrop={MAP_BACKDROP}
      />
      <Footer locale={locale} />
    </main>
  );
}
