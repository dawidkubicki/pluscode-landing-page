import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PageHero, CtaBand } from "../../components/page-hero";
import Footer from "../../components/footer";
import { Reveal, Stagger, StaggerItem } from "../../components/motion";
import LocaleLink from "../../components/locale-link";
import {
  isLocale,
  defaultLocale,
  localeDateTag,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getInsight, getRelatedInsights } from "@/lib/insights";
import { buildOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const data = await getInsight(slug, locale);
  if (!data) return {};
  return {
    title: data.card.title,
    description: data.card.excerpt,
    alternates: { canonical: `/${locale}/insights/${slug}` },
    openGraph: buildOpenGraph(locale, {
      title: data.card.title,
      description: data.card.excerpt,
      path: `/insights/${slug}`,
      type: "article",
      image: data.card.image,
    }),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Rich({ data }: { data: unknown }) {
  return <RichText data={data as any} />;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default async function InsightPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const data = await getInsight(slug, locale);
  if (!data) notFound();

  const { card, doc } = data;
  const labels = getDictionary(locale).insights;
  const article = getDictionary(locale).pages.insights.article;
  const related = await getRelatedInsights(slug, card.category, locale);

  const date = card.publishedAt
    ? new Date(card.publishedAt).toLocaleDateString(localeDateTag[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const eyebrow = `${labels.categories[card.category]} · ${card.readTime} ${labels.minRead}`;

  return (
    <main>
      <PageHero eyebrow={eyebrow} title={card.title} intro={card.excerpt} />

      <article className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            {/* Seven of twelve columns: the article is a reading column on
                the grid rather than a centred sheet. */}
            <div className="col-span-4 md:col-span-7">
              {/* byline */}
              <Reveal>
                <div className="mb-10 flex items-center gap-3 border-b border-rule pb-6 text-[0.875rem] text-moss">
                  <span>{card.author}</span>
                  {date && <span>· {date}</span>}
                </div>
              </Reveal>

              {/* cover */}
              <Reveal>
                <div className={`relative mb-12 aspect-[16/9] overflow-hidden ${card.gradient}`}>
                  {card.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.image.url} alt={card.image.alt} className="absolute inset-0 size-full object-cover" />
                  )}
                </div>
              </Reveal>

              <Reveal>
                {doc?.content ? (
                  <div className="prose-pc">
                    <Rich data={doc.content} />
                  </div>
                ) : (
                  <div className="prose-pc">
                    <p>{article.content.intro}</p>
                    <h2>{article.content.section1.title}</h2>
                    <p>{article.content.section1.paragraph}</p>
                    <h2>{article.content.section2.title}</h2>
                    <p>{article.content.section2.paragraph}</p>
                    <h2>{article.content.section3.title}</h2>
                    <p>{article.content.section3.paragraph}</p>
                    <h3>{article.content.keyTakeaways.title}</h3>
                    <ul>
                      <li>{article.content.keyTakeaways.item1}</li>
                      <li>{article.content.keyTakeaways.item2}</li>
                      <li>{article.content.keyTakeaways.item3}</li>
                    </ul>
                  </div>
                )}
              </Reveal>

              <div className="mt-12">
                <LocaleLink
                  href="/insights"
                  className="pc-link inline-block text-[1.125rem] text-moss"
                >
                  ← {article.breadcrumbParent}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <h2 className="col-span-4 text-heading-lg text-ink md:col-span-8">
                {article.related.title}
              </h2>
            </div>
            <Stagger className="pc-grid mt-16 md:mt-20" gap={0.08}>
              {related.map((r) => (
                <StaggerItem key={r.slug} className="col-span-4">
                  <LocaleLink href={`/insights/${r.slug}`} className="group block">
                    <div className={`aspect-[4/3] ${r.gradient}`} />
                    <h3 className="mt-6 text-heading-md text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {r.title}
                      </span>
                    </h3>
                    <span className="mt-4 inline-block text-[1rem] text-moss">
                      {labels.readMore}
                    </span>
                  </LocaleLink>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBand locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
