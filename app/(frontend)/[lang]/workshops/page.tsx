import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import Contact from "../components/contact";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
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

      {/* Proof band. The change of ground is the separation, so the band
          carries no hairlines of its own. */}
      {stats.length > 0 && (
        <section className="on-dark bg-ink py-20 md:py-[104px]">
          <div className="pc-shell">
            <Stagger className="pc-grid" gap={0.1}>
              {stats.map((s) => (
                <StaggerItem
                  key={s.label}
                  className={`col-span-4 border-t border-rule-dark pt-8 ${
                    stats.length >= 4 ? "md:col-span-3" : "md:col-span-4"
                  }`}
                >
                  <span className="block text-heading-lg text-white">
                    {s.value}
                  </span>
                  <span className="mt-4 block text-[1.125rem] leading-[1.375] text-sage">
                    {s.label}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {/* Two offerings to a row. The featured one is marked by an ink
              hairline and by its own label, not by a coloured border and a
              badge: there is no accent left to fill a badge with. */}
          <Stagger className="pc-grid" gap={0.08}>
            {o.items.map((item, i) => {
              const slug = SLUGS[i];
              return (
                <StaggerItem
                  key={slug}
                  className={`col-span-4 border-t pt-8 md:col-span-6 ${
                    item.featured ? "border-ink" : "border-rule"
                  }`}
                >
                  {item.featured && (
                    <span className="mb-3 block text-[0.875rem] text-ink">
                      {o.featuredLabel}
                    </span>
                  )}
                  <h2 className="text-heading-md text-ink">{item.name}</h2>
                  <p className="mt-3 text-[0.875rem] text-moss">{item.meta}</p>
                  <p className="mt-5 text-[1.125rem] leading-[1.375] text-moss">
                    {item.desc}
                  </p>

                  <p className="mt-5 text-[1rem] leading-[1.375] text-moss">
                    {o.forLabel}
                    <span className="ml-2 text-ink">{item.for}</span>
                  </p>

                  <ul className="mt-6 flex flex-col gap-2.5 border-t border-rule pt-6">
                    {item.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2.5 text-[1rem] leading-[1.375] text-moss"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-ink" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <LocaleLink
                      href={`/workshops/${slug}`}
                      className="btn btn-primary"
                    >
                      {item.cta}
                    </LocaleLink>
                    <LocaleLink
                      href={`/workshops/${slug}`}
                      className="pc-link text-[1.125rem] text-moss"
                    >
                      {idx.detailsCta}
                    </LocaleLink>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="pc-grid mt-16 md:mt-20">
            <Reveal className="col-span-4 md:col-span-8">
              <p className="text-[1.125rem] leading-[1.375] text-moss">
                {o.note}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How we pick tools, including the one we build ourselves */}
      {tooling.length > 0 && (
        <section className="on-dark bg-ink py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <div className="col-span-4 md:col-span-8">
                {extra.toolingTitle && (
                  <Reveal>
                    <h2 className="text-heading-lg text-white">
                      {extra.toolingTitle}
                    </h2>
                  </Reveal>
                )}
                {extra.toolingIntro && (
                  <Reveal delay={0.05}>
                    <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
                      {extra.toolingIntro}
                    </p>
                  </Reveal>
                )}
              </div>
            </div>

            <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
              {tooling.map((t) => (
                <StaggerItem
                  key={t.title}
                  className="col-span-4 border-t border-rule-dark pt-8 "
                >
                  <h3 className="text-heading-sm text-white">{t.title}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
                    {t.text}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            {extra.toolingCta && (
              <div className="pc-grid mt-12 md:mt-16">
                <Reveal delay={0.1} className="col-span-4 md:col-span-8">
                  <a
                    href={QUANTY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pc-link text-[1.125rem] text-white"
                  >
                    {extra.toolingCta}
                  </a>
                </Reveal>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How the engagements chain. The connecting arrows between the cards
          are gone: they were a flex-row device, and on the 12 column grid the
          step labels already read as a sequence. */}
      {path.length > 0 && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            {extra.pathTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={extra.pathTitle}
                  intro={extra.pathIntro}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            <Stagger
              className={`pc-grid ${extra.pathTitle ? "mt-16 md:mt-24" : ""}`}
              gap={0.08}
            >
              {path.map((p) => (
                <StaggerItem
                  key={`${p.slug}-${p.step}`}
                  className="col-span-4 border-t border-rule pt-8 md:col-span-3"
                >
                  <LocaleLink
                    href={`/workshops/${p.slug}`}
                    className="group block"
                  >
                    <span className="text-[0.875rem] text-moss">{p.step}</span>
                    <h3 className="mt-3 text-heading-sm text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {p.name}
                      </span>
                    </h3>
                    <p className="mt-2 text-[0.875rem] text-moss">
                      {p.duration}
                    </p>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {p.description}
                    </p>
                  </LocaleLink>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Which one fits */}
      {chooser.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            {extra.chooserTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={extra.chooserTitle}
                  intro={extra.chooserIntro}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            {/* One row per situation, spanning the full grid: the situation
                on the left, the offering it points at on the right. */}
            <Stagger
              className={`pc-grid ${extra.chooserTitle ? "mt-16 md:mt-20" : ""}`}
              gap={0.05}
            >
              {chooser.map((row) => (
                <StaggerItem
                  key={row.situation}
                  className="col-span-4 border-t border-rule py-6 md:col-span-12"
                >
                  <div className="flex flex-col gap-2.5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <span className="text-[1.125rem] leading-[1.375] text-ink">
                      {row.situation}
                    </span>
                    <LocaleLink
                      href={`/workshops/${row.slug}`}
                      className="pc-link shrink-0 text-[1.125rem] text-moss"
                    >
                      {row.recommendation}
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
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <Reveal className="col-span-4 md:col-span-8">
                <h2 className="text-heading-lg text-ink">{idx.faqTitle}</h2>
              </Reveal>
            </div>
            <Stagger className="pc-grid mt-16 md:mt-20" gap={0.06}>
              {faq.map((item) => (
                <StaggerItem
                  key={item.q}
                  className="col-span-4 border-t border-rule md:col-span-8"
                >
                  <details className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.125rem] leading-[1.375] text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center border border-rule text-moss transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                      {item.a}
                    </p>
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
