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

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          {/* Stats */}
          {stats.length > 0 && (
            <Reveal>
              <div className="mb-14 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-cream-line py-8 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="display text-4xl text-ink">{s.value}</div>
                    <p className="mt-2 text-[13px] leading-snug text-ink-soft">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {hasRich ? (
            <div className="space-y-12">
              {richBlocks.map((b) => (
                <Reveal key={b.label}>
                  <div>
                    <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                      {b.label}
                    </p>
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
                  <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                    {detail.overview.label}
                  </p>
                  <h2 className="mt-3 font-serif text-[1.75rem] font-medium tracking-[-0.01em] text-ink">
                    {detail.overview.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.overview.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-8 border-t border-cream-line pt-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                        {detail.overview.industry}
                      </p>
                      <p className="mt-1 text-ink">{detail.overview.industryValue}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                        {detail.overview.services}
                      </p>
                      <p className="mt-1 text-ink">{detail.overview.servicesValue}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                    {detail.challenge.label}
                  </p>
                  <h2 className="mt-3 font-serif text-[1.75rem] font-medium tracking-[-0.01em] text-ink">
                    {detail.challenge.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.challenge.description}
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                    {detail.solution.label}
                  </p>
                  <h2 className="mt-3 font-serif text-[1.75rem] font-medium tracking-[-0.01em] text-ink">
                    {detail.solution.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.solution.description}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {Object.values(detail.solution.steps).map((step, i) => (
                      <div key={i} className="rounded border border-cream-line bg-white p-5">
                        <span className="font-mono text-xs text-lime">
                          0{i + 1}
                        </span>
                        <h3 className="mt-2 font-medium text-ink">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          <div className="mt-14">
            <LocaleLink
              href="/case-studies"
              className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-lime transition-colors hover:text-ink"
            >
              ← {detail.cta.viewAll}
            </LocaleLink>
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
