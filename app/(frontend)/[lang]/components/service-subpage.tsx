import type { Metadata } from "next";
import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Check,
  SectionHeading,
  type ServiceData,
  type ServiceKey,
} from "./service-page";

type Item = { title: string; description: string };

export type SubpageData = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  overviewTitle: string;
  overview: string[];
  benefitsTitle: string;
  benefits: Item[];
  approachTitle: string;
  approach: Item[];
  deliverablesTitle: string;
  deliverables: string[];
  faqTitle?: string;
  faq?: { q: string; a: string }[];
  cta: { title: string; subtitle: string; button: string };
};

/** Two-digit index label ("01", "02", ...). */
const num = (i: number) => String(i + 1).padStart(2, "0");

function parentData(locale: Locale, service: ServiceKey): ServiceData {
  return getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
}

/** Subpage content for one slug, or null when it does not exist. */
export function getSubpage(
  locale: Locale,
  service: ServiceKey,
  slug: string,
): SubpageData | null {
  return parentData(locale, service).subpages?.[slug] ?? null;
}

/** Slugs of all subpages a service declares (canonical EN dictionary). */
export function subpageSlugs(service: ServiceKey): string[] {
  return Object.keys(parentData("en", service).subpages ?? {});
}

/** Shared metadata helper for sub-service pages. */
export function subpageMetadata(
  locale: Locale,
  service: ServiceKey,
  slug: string,
): Metadata {
  const d = getSubpage(locale, service, slug);
  return d ? { title: d.title, description: d.subtitle } : {};
}

export default function ServiceSubpage({
  locale,
  service,
  slug,
  hrefBase,
}: {
  locale: Locale;
  service: ServiceKey;
  slug: string;
  /** Base path of the parent service page, e.g. "/ai-data/consulting". */
  hrefBase: string;
}) {
  const parent = parentData(locale, service);
  const d = parent.subpages?.[slug];
  if (!d) return null;

  const overview = d.overview ?? [];
  const benefits = d.benefits ?? [];
  const approach = d.approach ?? [];
  const deliverables = d.deliverables ?? [];
  const faq = d.faq ?? [];
  const siblings = Object.entries(parent.sub ?? {}).filter(([s]) => s !== slug);

  return (
    <main>
      <PageHero
        eyebrow={parent.title}
        title={d.title}
        intro={d.subtitle}
        cta={{ label: d.cta.button, href: "/contact" }}
      />

      {/* Overview. Prose runs in seven of twelve columns and the paragraph
          keeps its own measure, which is what a reading column is for. */}
      {overview.length > 0 && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <div className="col-span-4 md:col-span-7">
                <Reveal>
                  <h2 className="text-heading-lg text-ink">{d.overviewTitle}</h2>
                </Reveal>
                <div className="mt-8 space-y-5">
                  {overview.map((p, i) => (
                    <Reveal key={p} delay={0.05 + i * 0.04}>
                      <p
                        className={`max-w-[46ch] text-[1.125rem] leading-[1.375] ${
                          i === 0 ? "text-ink" : "text-moss"
                        }`}
                      >
                        {p}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <SectionHeading
                title={d.benefitsTitle}
                className="col-span-4 md:col-span-8"
              />
            </div>
            <Stagger className="pc-grid mt-16 md:mt-24" gap={0.06}>
              {benefits.map((b, i) => (
                <StaggerItem
                  key={b.title}
                  className="col-span-4 border-t border-rule pt-8 "
                >
                  <span className="text-[0.875rem] text-moss">{num(i)}</span>
                  <h3 className="mt-3 text-heading-sm text-ink">{b.title}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {b.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Approach */}
      {approach.length > 0 && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <SectionHeading
                eyebrow={d.label}
                title={d.approachTitle}
                className="col-span-4 md:col-span-8"
              />
            </div>
            <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
              {approach.map((s, i) => (
                <StaggerItem
                  key={s.title}
                  className="col-span-4 border-t border-rule pt-8 md:col-span-3"
                >
                  <span className="text-[0.875rem] text-moss">{num(i)}</span>
                  <h3 className="mt-3 text-heading-sm text-ink">{s.title}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {s.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <SectionHeading
                title={d.deliverablesTitle}
                className="col-span-4 md:col-span-8"
              />
            </div>
            <Stagger className="pc-grid mt-16 md:mt-24" gap={0.05}>
              {deliverables.map((item) => (
                <StaggerItem
                  key={item}
                  className="col-span-4 flex items-start gap-3 border-t border-rule pt-6 md:col-span-6"
                >
                  <Check className="mt-1 size-5 shrink-0 text-ink" />
                  <span className="text-[1.125rem] leading-[1.375] text-ink">
                    {item}
                  </span>
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
                <h2 className="text-heading-lg text-ink">
                  {d.faqTitle ?? "FAQ"}
                </h2>
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

      {/* Related sub-services and the way back up */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-8">
              <LocaleLink
                href={hrefBase}
                className="pc-link inline-block text-[1.125rem] text-moss"
              >
                ← {parent.title}
              </LocaleLink>
            </Reveal>
          </div>
          {siblings.length > 0 && (
            <Stagger className="pc-grid mt-12 md:mt-16" gap={0.08}>
              {siblings.map(([otherSlug, entry]) => (
                <StaggerItem
                  key={otherSlug}
                  className="col-span-4 border-t border-rule pt-8 "
                >
                  <LocaleLink
                    href={`${hrefBase}/${otherSlug}`}
                    className="group block"
                  >
                    <h3 className="text-heading-md text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {entry.name}
                      </span>
                    </h3>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {entry.teaser}
                    </p>
                  </LocaleLink>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.subtitle}
        cta={{ label: d.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}
