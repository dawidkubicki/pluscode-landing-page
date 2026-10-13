import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "../../components/json-ld";
import LocaleLink from "../../components/locale-link";
import { formatNewsDate, newsCategoryLabel } from "../../components/news-card";
import PageHero from "../../components/page-hero";
import RichText from "../../components/rich-text";
import { ArrowLink, ChevronIcon, Container } from "../../components/ui";
import { locales, resolveLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNewsArticle, getNewsSlugs } from "@/lib/news";
import { getNewsPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd, newsArticleLd } from "@/lib/structured-data";

export const revalidate = 60;

type Params = Promise<{ lang: string; slug: string }>;

/** Articles published after the build are rendered on first request. */
export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

// The metadata and the page ask for the same article in one request.
const loadArticle = cache((locale: Locale, slug: string) => getNewsArticle(locale, slug));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const article = await loadArticle(locale, slug);
  if (!article) {
    return { title: getDictionary(locale).notFound.title, robots: { index: false } };
  }
  return pageMetadata(locale, {
    path: `/news/${article.slug}`,
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    type: "article",
    image: article.image,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const article = await loadArticle(locale, slug);
  if (!article) notFound();

  const dict = getDictionary(locale);
  const newsPage = await getNewsPage(locale);
  const date = formatNewsDate(article.publishedAt, locale);
  const category = newsCategoryLabel(article.category, dict.newsCategories);
  const meta = [
    date && article.publishedAt && (
      <time key="date" dateTime={article.publishedAt}>
        {date}
      </time>
    ),
    <span key="read">
      {article.readTime} {dict.ui.minRead}
    </span>,
    category && <span key="category">{category}</span>,
  ].filter(Boolean);

  return (
    <main id="main">
      <article>
        <PageHero size="short" titleSize="display" title={article.title}>
          <LocaleLink
            href="/news"
            className="-my-3 inline-flex min-h-11 items-center gap-2.5 text-small text-grey-light transition-colors duration-200 hover:text-white"
          >
            <ChevronIcon className="h-2.5 w-1.5 rotate-180" />
            {dict.ui.backToNews}
          </LocaleLink>
        </PageHero>

        <Container className="pc-section">
          <div className="mx-auto max-w-[44rem]">
            <p className="flex flex-wrap gap-x-2 gap-y-1 text-small text-grey">
              {meta.map((part, i) => (
                <span key={i} className="inline-flex gap-x-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  {part}
                </span>
              ))}
            </p>

            {article.image && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-[4px] bg-grey-light">
                <Image
                  src={article.image.url}
                  alt={article.image.alt}
                  fill
                  preload
                  sizes="(min-width: 800px) 44rem, 92vw"
                  unoptimized={!article.image.url.startsWith("/")}
                  className="object-cover"
                />
              </div>
            )}

            <RichText data={article.content} locale={locale} className="mt-10" />

            <div className="mt-16 border-t border-grey-mid pt-8">
              <ArrowLink href="/news">{dict.ui.allNews}</ArrowLink>
            </div>
          </div>
        </Container>
      </article>

      <JsonLd
        data={[
          newsArticleLd(locale, article),
          breadcrumbLd(locale, [
            { name: dict.nav.home, path: "" },
            { name: newsPage.heading, path: "/news" },
            { name: article.title, path: `/news/${article.slug}` },
          ]),
        ]}
      />
    </main>
  );
}
