import type { Metadata } from "next";
import { Fragment } from "react";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import Contact from "../components/contact";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Arrow } from "../components/ui";
import { SectionHeading } from "../components/service-page";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { QUANTY_URL } from "@/lib/social";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/** Offering index, aligned with the order of `offerings.items` in the dict. */
const SLUGS = [
  "ai-opportunity-workshop",
  "ai-discovery-sprint",
  "genai-proof-of-concept",
  "fractional-ai-team",
];

/**
 * Sections the dictionaries are adding to `workshops.index`. They are read
 * through this local cast (not the generated `Dictionary` type) because the
 * canonical en.json may not carry them yet; every section gates on presence,
 * so the page renders exactly as before until the content lands.
 */
type IndexExtras = {
  /** Dark proof band right under the hero. */
  stats?: { value: string; label: string }[];
  /** "How the engagements chain" strip of linked cards. */
  pathTitle?: string;
  pathIntro?: string;
  path?: {
    step: string;
    name: string;
    duration: string;
    description: string;
    slug: string;
  }[];
  /** "Which one fits" situation-to-offering rows. */
  chooserTitle?: string;
  chooserIntro?: string;
  chooser?: { situation: string; recommendation: string; slug: string }[];
  /** FAQ entries, shown under the existing `faqTitle` heading. */
  faq?: { q: string; a: string }[];
  /**
   * "How we pick tools": the band where we say out loud that Quanty is our
   * own product, so a recommendation made in a workshop can be weighed.
   */
  toolingTitle?: string;
  toolingIntro?: string;
  tooling?: { title: string; text: string }[];
  toolingCta?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const idx = getDictionary(resolve(lang)).workshops.index;
  return { title: idx.metaTitle, description: idx.metaDescription };
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function WorkshopsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const dict = getDictionary(locale);
  const idx = dict.workshops.index;
  const extra = idx as typeof idx & IndexExtras;
  const o = dict.offerings;

  const stats = extra.stats ?? [];
  const path = extra.path ?? [];
  const chooser = extra.chooser ?? [];
  const faq = extra.faq ?? [];
  const tooling = extra.tooling ?? [];

  return (
    <main>
      <PageHero eyebrow={idx.eyebrow} title={idx.title} intro={idx.subtitle} visual="grid" />

      {/* Proof band. `night` is one step above the page, so the band is
          given both hairlines to read as lifted rather than as a gap. */}
      {stats.length > 0 && (
        <section className="border-y border-night-line bg-night text-bone">
          <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-10 sm:py-16">
            <Stagger
              className={`grid grid-cols-2 gap-x-10 gap-y-10 ${
                stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
              gap={0.1}
            >
              {stats.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="flex flex-col gap-2">
                    <span className="display text-4xl text-bone sm:text-5xl">
                      {s.value}
                    </span>
                    <span className="max-w-[15rem] text-[14px] leading-[1.5] text-bone-dim">
                      {s.label}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
          <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.08}>
            {o.items.map((item, i) => {
              const slug = SLUGS[i];
              return (
                <StaggerItem key={slug} className="h-full">
                  <div
                    className={`relative flex h-full flex-col rounded border p-7 transition-colors duration-300 sm:p-8 ${
                      item.featured ? "border-lime bg-cream-surface" : "border-cream-line bg-cream-surface hover:border-cream-line-strong"
                    }`}
                  >
                    {item.featured && (
                      <span className="absolute -top-3 left-8 rounded-[2px] bg-lime px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white">
                        {o.featuredLabel}
                      </span>
                    )}
                    <h2 className="font-serif text-[1.7rem] font-medium leading-tight text-ink">
                      {item.name}
                    </h2>
                    <div className="mt-2.5 font-mono text-[12.5px] uppercase tracking-[0.1em] text-lime-soft">
                      {item.meta}
                    </div>
                    <p className="mt-5 text-[15px] leading-[1.65] text-ink-soft">{item.desc}</p>

                    <div className="mt-5 text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                      {o.forLabel}
                      <span className="ml-2 normal-case tracking-normal text-ink-soft">{item.for}</span>
                    </div>

                    <ul className="mt-6 flex flex-col gap-2.5 border-t border-cream-line pt-6">
                      {item.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                          <Check className="mt-0.5 size-4 shrink-0 text-lime-soft" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      <LocaleLink
                        href={`/workshops/${slug}`}
                        className="btn btn-primary group"
                      >
                        {item.cta}
                        <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </LocaleLink>
                      <LocaleLink
                        href={`/workshops/${slug}`}
                        className="text-[14.5px] font-medium text-ink-soft underline-offset-4 transition-colors hover:text-lime-soft hover:underline"
                      >
                        {idx.detailsCta}
                      </LocaleLink>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal>
            <p className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 text-center text-[15px] leading-[1.6] text-ink-soft">
              <span className="hidden size-1.5 shrink-0 rounded-full bg-lime sm:inline-block" />
              {o.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* How we pick tools, including the one we build ourselves */}
      {tooling.length > 0 && (
        <section className="border-y border-night-line bg-night text-bone">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <div className="max-w-[720px]">
              {extra.toolingTitle && (
                <Reveal>
                  <h2 className="font-serif text-[2.25rem] font-medium leading-[1.12] tracking-[-0.01em] text-bone sm:text-[2.75rem]">
                    {extra.toolingTitle}
                  </h2>
                </Reveal>
              )}
              {extra.toolingIntro && (
                <Reveal delay={0.05}>
                  <p className="mt-5 text-[16.5px] leading-[1.7] text-bone-soft">
                    {extra.toolingIntro}
                  </p>
                </Reveal>
              )}
            </div>

            <Stagger className="mt-12 grid gap-5 sm:grid-cols-3" gap={0.08}>
              {tooling.map((t) => (
                <StaggerItem key={t.title} className="h-full">
                  <div className="flex h-full flex-col rounded border border-white/12 bg-white/[0.03] p-6 sm:p-7">
                    <h3 className="text-[17px] font-semibold leading-[1.35] text-bone">
                      {t.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-[1.65] text-bone-soft">
                      {t.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {extra.toolingCta && (
              <Reveal delay={0.1}>
                <a
                  href={QUANTY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2.5 text-[15px] font-semibold text-lime-soft transition-colors hover:text-bone"
                >
                  {extra.toolingCta}
                  <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* How the engagements chain */}
      {path.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {extra.pathTitle && (
              <SectionHeading
                title={extra.pathTitle}
                intro={extra.pathIntro}
                className="mb-14"
              />
            )}
            <Stagger className="flex flex-col items-stretch gap-4 lg:flex-row lg:gap-0" gap={0.08}>
              {path.map((p, i) => (
                <Fragment key={`${p.slug}-${p.step}`}>
                  {i > 0 && (
                    <StaggerItem className="hidden shrink-0 items-center self-stretch px-2.5 lg:flex">
                      <Arrow className="size-5 text-lime-soft" />
                    </StaggerItem>
                  )}
                  <StaggerItem className="min-w-0 lg:flex-1">
                    <LocaleLink
                      href={`/workshops/${p.slug}`}
                      className="group flex h-full flex-col rounded border border-cream-line bg-cream-surface p-6 transition-colors duration-300 hover:border-lime sm:p-7"
                    >
                      <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-lime-soft">
                        {p.step}
                      </span>
                      <h3 className="mt-3 font-serif text-[1.35rem] font-medium leading-tight text-ink">
                        {p.name}
                      </h3>
                      <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft">
                        {p.duration}
                      </div>
                      <p className="mt-3.5 text-[14px] leading-[1.6] text-ink-soft">
                        {p.description}
                      </p>
                      <span className="mt-auto flex items-center pt-5 text-lime-soft">
                        <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </LocaleLink>
                  </StaggerItem>
                </Fragment>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Which one fits */}
      {chooser.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {extra.chooserTitle && (
              <SectionHeading
                title={extra.chooserTitle}
                intro={extra.chooserIntro}
                className="mb-12"
              />
            )}
            <Stagger className="border-t border-cream-line" gap={0.05}>
              {chooser.map((row) => (
                <StaggerItem key={row.situation}>
                  <div className="grid gap-2.5 border-b border-cream-line py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:py-6">
                    <span className="text-[15.5px] leading-[1.6] text-ink">
                      {row.situation}
                    </span>
                    <LocaleLink
                      href={`/workshops/${row.slug}`}
                      className="group inline-flex items-center gap-2.5 text-[15px] font-semibold text-lime-soft transition-colors hover:text-ink sm:justify-self-end"
                    >
                      {row.recommendation}
                      <Arrow className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </LocaleLink>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {idx.faqTitle}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {faq.map((item) => (
                <StaggerItem key={item.q}>
                  <details className="group rounded border border-cream-line bg-cream-surface p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime-soft transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-ink-soft">{item.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <Contact locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
