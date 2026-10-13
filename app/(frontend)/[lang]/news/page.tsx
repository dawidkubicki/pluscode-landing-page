import type { Metadata } from "next";
import JsonLd from "../components/json-ld";
import LocaleLink from "../components/locale-link";
import NewsCard, { NewsMeta, NewsThumb } from "../components/news-card";
import PageHero from "../components/page-hero";
import { Container, Label } from "../components/ui";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews } from "@/lib/news";
import { getNewsPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd, webPageLd } from "@/lib/structured-data";

export const revalidate = 60;

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const page = await getNewsPage(locale);
  return pageMetadata(locale, {
    path: "/news",
    title: page.seoTitle,
    description: page.seoDescription,
  });
}

export default async function NewsPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const [page, news] = await Promise.all([getNewsPage(locale), getNews(locale)]);
  const [latest, ...rest] = news;

  return (
    <main id="main">
      <PageHero
        size="tall"
        image="news"
        locale={locale}
        title={page.heading}
        intro={page.intro.trim() || undefined}
      />

      <section className="pc-section">
        <Container>
          {!latest ? (
            <p className="text-lead text-grey">{dict.ui.noNews}</p>
          ) : (
            <>
              {/* The newest item, large. One link, like the cards below it. */}
              <LocaleLink
                href={`/news/${latest.slug}`}
                className="group grid items-center gap-x-8 gap-y-6 lg:grid-cols-12"
              >
                <NewsThumb
                  image={latest.image}
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  preload
                  className="rounded-[4px] lg:col-span-7"
                />
                <div className="lg:col-span-5">
                  <Label>{dict.ui.latest}</Label>
                  <h2 className="mt-3 text-display transition-colors duration-300 group-hover:text-blue">
                    {latest.title}
                  </h2>
                  {latest.excerpt && (
                    <p className="mt-4 max-w-[34rem] text-grey">{latest.excerpt}</p>
                  )}
                  <NewsMeta
                    item={latest}
                    locale={locale}
                    categories={dict.newsCategories}
                    className="mt-5"
                  />
                </div>
              </LocaleLink>

              {rest.length > 0 && (
                <ul className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item) => (
                    <li key={item.slug}>
                      <NewsCard item={item} locale={locale} categories={dict.newsCategories} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Container>
      </section>

      <JsonLd
        data={[
          webPageLd(locale, {
            path: "/news",
            name: page.seoTitle || page.heading,
            description: page.seoDescription,
            type: "CollectionPage",
          }),
          breadcrumbLd(locale, [
            { name: dict.nav.home, path: "" },
            { name: page.heading, path: "/news" },
          ]),
        ]}
      />
    </main>
  );
}
