import type { Metadata } from "next";
import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import LocaleLink from "./locale-link";
import { Arrow } from "./ui";
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

      {/* Overview */}
      {overview.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {d.overviewTitle}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5">
              {overview.map((p, i) => (
                <Reveal key={p} delay={0.05 + i * 0.04}>
                  <p
                    className={
                      i === 0
                        ? "text-[19px] leading-[1.7] text-ink"
                        : "text-[16px] leading-[1.75] text-ink-soft"
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <SectionHeading title={d.benefitsTitle} className="mb-14" />
            <Stagger
              className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
              gap={0.06}
            >
              {benefits.map((b, i) => (
                <StaggerItem key={b.title} className="h-full">
                  <article className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 sm:p-8">
                    <span className="font-serif text-3xl font-light text-[#c3cede]">
                      {num(i)}
                    </span>
                    <h3 className="mt-5 text-xl font-semibold text-ink">{b.title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                      {b.description}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Approach */}
      {approach.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <SectionHeading eyebrow={d.label} title={d.approachTitle} className="mb-14" />
            <Stagger
              className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
              gap={0.08}
            >
              {approach.map((s, i) => (
                <StaggerItem key={s.title} className="h-full">
                  <div className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 sm:p-8">
                    <span className="font-serif text-5xl font-light text-lime">
                      {num(i)}
                    </span>
                    <h3 className="mt-7 text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
                      {s.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <SectionHeading title={d.deliverablesTitle} className="mb-14" />
            <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.05}>
              {deliverables.map((item) => (
                <StaggerItem key={item} className="h-full">
                  <div className="flex h-full items-start gap-3 rounded border border-cream-line bg-white p-5">
                    <Check className="mt-0.5 size-5 shrink-0 text-lime" />
                    <span className="text-[15px] leading-[1.6] text-ink">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {d.faqTitle ?? "FAQ"}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {faq.map((item) => (
                <StaggerItem key={item.q}>
                  <details className="group rounded border border-cream-line bg-white p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime transition-transform duration-300 group-open:rotate-45">
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

      {/* Related sub-services and the way back up */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
          <Reveal>
            <LocaleLink
              href={hrefBase}
              className="group inline-flex items-center gap-2.5 text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-lime-deep"
            >
              <Arrow className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
              {parent.title}
            </LocaleLink>
          </Reveal>
          {siblings.length > 0 && (
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
              {siblings.map(([otherSlug, entry]) => (
                <StaggerItem key={otherSlug} className="h-full">
                  <LocaleLink
                    href={`${hrefBase}/${otherSlug}`}
                    className="group flex h-full flex-col rounded border border-cream-line bg-white p-7 transition-colors duration-300 hover:border-lime"
                  >
                    <h3 className="font-serif text-[1.4rem] font-medium leading-tight text-ink">
                      {entry.name}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
                      {entry.teaser}
                    </p>
                    <span className="mt-auto flex items-center pt-6 text-lime-deep">
                      <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
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
