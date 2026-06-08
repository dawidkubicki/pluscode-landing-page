import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PageHero, CtaBand } from "../../components/page-hero";
import Footer from "../../components/footer";
import { Reveal, Stagger, StaggerItem } from "../../components/motion";
import { Arrow } from "../../components/ui";
import LocaleLink from "../../components/locale-link";
import {
  isLocale,
  defaultLocale,
  localeDateTag,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getInsight, getRelatedInsights } from "@/lib/insights";

export const dynamic = "force-dynamic";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getInsight(slug, resolve(lang));
  if (!data) return {};
  return { title: data.card.title, description: data.card.excerpt };
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

      <article className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          {/* byline */}
          <Reveal>
            <div className="mb-10 flex items-center gap-3 border-b border-cream-line pb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
              <span>{card.author}</span>
              {date && <span>· {date}</span>}
            </div>
          </Reveal>

          {/* cover */}
          <Reveal>
            <div className={`mb-12 h-64 overflow-hidden rounded-3xl ${card.gradient}`}>
              {card.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.image.url} alt={card.image.alt} className="size-full object-cover" />
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
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep transition-colors hover:text-ink"
            >
              ← {article.breadcrumbParent}
            </LocaleLink>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream-dim px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1500px]">
            <h2 className="text-2xl font-medium tracking-tight text-ink">
              {article.related.title}
            </h2>
            <Stagger className="mt-8 grid gap-6 md:grid-cols-3" gap={0.08}>
              {related.map((r) => (
                <StaggerItem key={r.slug}>
                  <LocaleLink
                    href={`/insights/${r.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream-line bg-cream transition-colors hover:border-lime/40"
                  >
                    <div className={`h-32 ${r.gradient}`} />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-medium text-ink transition-colors group-hover:text-lime-deep">
                        {r.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
                        {labels.readMore}
                        <Arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
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
