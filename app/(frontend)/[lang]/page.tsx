import Hero from "./components/hero";
import Latest from "./components/latest";
import Clients from "./components/clients";
import Services from "./components/services";
import Offerings from "./components/offerings";
import Platform from "./components/platform";
import Cases from "./components/cases";
import Stories from "./components/stories";
import Founders from "./components/founders";
import Approach from "./components/approach";
import Locations from "./components/locations";
import Footer from "./components/footer";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MAP_VIEWBOX, MAP_BACKDROP } from "@/lib/europe-map";

export const revalidate = 60;

/**
 * The home page.
 *
 * This file decides the sequence and nothing else. Every band owns its own
 * ground, its own vertical padding and its own grid placement, and no band
 * knows what sits above or below it.
 *
 * THE ORDER IS AN ARGUMENT, in the order a buyer asks it:
 *
 *   1.  Hero        the promise, over the video          (deep)
 *   2.  Latest      what is happening here now           (paper)
 *   3.  Clients     who has already bought               (paper)
 *   4.  Services    what we actually do, five of them    (paper)
 *   5.  Offerings   how to start, four ways in           (paper-dim)
 *   6.  Platform    the product we built ourselves       (ink)
 *   7.  Cases       proof that the work shipped          (paper)
 *   8.  Stories     how we think about the problem       (paper)
 *   9.  Founders    the two people who do it             (paper)
 *  10.  Approach    the rules the work follows           (paper-dim)
 *  11.  Locations   where we are and where we consult    (deep)
 *  12.  Footer                                           (carbon)
 *
 * The middle of the page alternates ground so eleven bands read as a set of
 * plates rather than one long scroll. Only Cases and Stories deliberately
 * share a ground: they are the editorial spine, and a reader should feel one
 * continuous column of work across the two.
 *
 * Services and Offerings are the substance a visitor is shopping for, so they
 * sit ABOVE the product and the proof. A reader who bounces at Quanty has
 * still been told what the consultancy does.
 *
 * There is no closing call-to-action band. The ask lives twice where it is
 * useful: on Offerings, next to the four ways to start, and on Founders, next
 * to the faces of the people who answer.
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
      <Services dict={home.services} />
      <Offerings dict={home.offerings} />
      <Platform dict={home.platform} />
      <Cases dict={home.cases} />
      <Stories dict={home.stories} />
      <Founders dict={home.founders} />
      <Approach dict={home.approach} />
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
