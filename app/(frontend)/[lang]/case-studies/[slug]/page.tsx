import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PageHero, CtaBand } from "../../components/page-hero";
import Footer from "../../components/footer";
import { Reveal } from "../../components/motion";
import LocaleLink from "../../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCaseStudy } from "@/lib/case-studies";
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
  const data = await getCaseStudy(slug, locale);
  if (!data) return {};
  return {
    title: data.card.title,
    description: data.card.excerpt,
    alternates: { canonical: `/${locale}/case-studies/${slug}` },
    openGraph: buildOpenGraph(locale, {
      title: data.card.title,
      description: data.card.excerpt,
      path: `/case-studies/${slug}`,
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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const data = await getCaseStudy(slug, locale);
  if (!data) notFound();

  const { card, doc } = data;
  const t = getDictionary(locale).pages.caseStudies;
  const detail = t.detail;

  const hasRich = !!(doc && (doc.overview || doc.challenge || doc.solution || doc.results));

  const stats =
    doc?.stats && doc.stats.length > 0
      ? doc.stats.map((s) => ({ value: s.value ?? "", label: s.label ?? "" }))
      : Object.values(detail.results.metrics);

  const richBlocks = [
    { label: detail.overview.label, content: doc?.overview },
    { label: detail.challenge.label, content: doc?.challenge },
    { label: detail.solution.label, content: doc?.solution },
    { label: detail.results.label, content: doc?.results },
  ].filter((b) => !!b.content);

  return (
    <main>
      <PageHero
        eyebrow={card.category}
        title={card.title}
        intro={card.excerpt}
        visual="mesh"
      />

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* Stats. Full width cells with a rule over each figure, so the
              proof row lines up with the columns of every other band. */}
          {stats.length > 0 && (
            <Reveal>
              <div className="pc-grid">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="col-span-4 border-t border-rule pt-8 md:col-span-3"
                  >
                    <div className="text-heading-lg text-ink">{s.value}</div>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <div className={`pc-grid ${stats.length > 0 ? "mt-16 md:mt-24" : ""}`}>
            {/* The document runs in seven of twelve columns. Its blocks are
                separated by space and by their labels, never by a card. */}
            <div className="col-span-4 md:col-span-7">
              {hasRich ? (
                <div className="space-y-12">
                  {richBlocks.map((b) => (
                    <Reveal key={b.label}>
                      <div>
                        <p className="text-[0.875rem] text-moss">{b.label}</p>
                        <div className="prose-pc mt-4">
                          <Rich data={b.content} />
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="space-y-12">
                  <Reveal>
                    <div>
                      <p className="text-[0.875rem] text-moss">
                        {detail.overview.label}
                      </p>
                      <h2 className="mt-3 text-heading-md text-ink">
                        {detail.overview.title}
                      </h2>
                      <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                        {detail.overview.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-8 border-t border-rule pt-6">
                        <div>
                          <p className="text-[0.875rem] text-moss">
                            {detail.overview.industry}
                          </p>
                          <p className="mt-1 text-[1.125rem] leading-[1.375] text-ink">
                            {detail.overview.industryValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.875rem] text-moss">
                            {detail.overview.services}
                          </p>
                          <p className="mt-1 text-[1.125rem] leading-[1.375] text-ink">
                            {detail.overview.servicesValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal>
                    <div>
                      <p className="text-[0.875rem] text-moss">
                        {detail.challenge.label}
                      </p>
                      <h2 className="mt-3 text-heading-md text-ink">
                        {detail.challenge.title}
                      </h2>
                      <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                        {detail.challenge.description}
                      </p>
                    </div>
                  </Reveal>

                  <Reveal>
                    <div>
                      <p className="text-[0.875rem] text-moss">
                        {detail.solution.label}
                      </p>
                      <h2 className="mt-3 text-heading-md text-ink">
                        {detail.solution.title}
                      </h2>
                      <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                        {detail.solution.description}
                      </p>
                    </div>
                  </Reveal>
                </div>
              )}
            </div>
          </div>

          {/* The three solution steps close the fallback document. They are a
              row of the page grid rather than a nested grid inside the
              reading column, so they rule up with the stats above them. */}
          {!hasRich && (
            <div className="pc-grid mt-12 md:mt-16">
              {Object.values(detail.solution.steps).map((step, i) => (
                <div
                  key={i}
                  className="col-span-4 border-t border-rule pt-8 "
                >
                  <span className="text-[0.875rem] text-moss">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-heading-sm text-ink">{step.title}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="pc-grid mt-16 md:mt-20">
            <div className="col-span-4 md:col-span-7">
              <LocaleLink
                href="/case-studies"
                className="pc-link inline-block text-[1.125rem] text-moss"
              >
                ← {detail.cta.viewAll}
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={detail.cta.title}
        text={detail.cta.subtitle}
        cta={{ label: detail.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}
