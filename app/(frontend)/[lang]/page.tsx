import type { Metadata } from "next";
import JsonLd from "./components/json-ld";
import People from "./components/people";
import Portfolio from "./components/portfolio";
import Hero from "./components/home/hero";
import Mission from "./components/home/mission";
import NewsTeaser from "./components/home/news-teaser";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews } from "@/lib/news";
import { getHomePage } from "@/lib/pages";
import { getPeople } from "@/lib/people";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import {
  personLd,
  softwareApplicationLd,
  webPageLd,
} from "@/lib/structured-data";

export const revalidate = 60;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const home = await getHomePage(locale);
  return pageMetadata(locale, {
    path: "",
    absoluteTitle: home.seoTitle,
    description: home.seoDescription,
  });
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);

  const [home, people, products, news] = await Promise.all([
    getHomePage(locale),
    getPeople(locale),
    getProducts(locale),
    getNews(locale, { limit: 3 }),
  ]);

  return (
    <main id="main">
      <Hero locale={locale} tagline={home.heroTagline} nav={dict.nav} />
      <Mission locale={locale} heading={home.missionHeading} body={home.missionBody} />
      <Portfolio
        label={home.portfolioLabel}
        statement={home.portfolioStatement}
        products={products}
        ui={dict.ui}
      />
      <People
        people={people}
        heading={home.peopleHeading}
        intro={home.peopleIntro}
        ui={dict.ui}
        cta={{ label: dict.ui.aboutUs, href: "/about" }}
      />
      <NewsTeaser
        locale={locale}
        heading={home.newsHeading}
        allLabel={dict.ui.allNews}
        items={news}
      />
      <JsonLd
        data={[
          webPageLd(locale, {
            path: "",
            name: home.seoTitle,
            description: home.seoDescription,
          }),
          ...people.map(personLd),
          ...products.map(softwareApplicationLd),
        ]}
      />
    </main>
  );
}
