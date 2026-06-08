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

export const dynamic = "force-dynamic";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getCaseStudy(slug, resolve(lang));
  if (!data) return {};
  return { title: data.card.title, description: data.card.excerpt };
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

      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          {/* Stats */}
          {stats.length > 0 && (
            <Reveal>
              <div className="mb-14 grid grid-cols-2 gap-6 rounded-3xl border border-cream-line bg-cream-dim/40 p-8 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="display text-4xl text-lime-deep">{s.value}</div>
                    <p className="mt-2 text-xs leading-snug text-ink-soft">{s.label}</p>
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
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-deep">
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
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-deep">
                    {detail.overview.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink">
                    {detail.overview.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.overview.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-8 border-t border-cream-line pt-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                        {detail.overview.industry}
                      </p>
                      <p className="mt-1 text-ink">{detail.overview.industryValue}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                        {detail.overview.services}
                      </p>
                      <p className="mt-1 text-ink">{detail.overview.servicesValue}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-deep">
                    {detail.challenge.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink">
                    {detail.challenge.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.challenge.description}
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-deep">
                    {detail.solution.label}
                  </p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink">
                    {detail.solution.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {detail.solution.description}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {Object.values(detail.solution.steps).map((step, i) => (
                      <div key={i} className="rounded-2xl border border-cream-line bg-cream-dim/40 p-5">
                        <span className="font-mono text-[11px] text-lime-deep">
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
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep transition-colors hover:text-ink"
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
