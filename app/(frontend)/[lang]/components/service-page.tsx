import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import { Arrow } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SubpageData } from "./service-subpage";

export type ServiceKey =
  | "machineLearning"
  | "analytics"
  | "consulting"
  | "webDevelopment"
  | "mobile"
  | "cloud"
  | "teamExtension";

type Item = { title: string; description: string };
type Faq = { q: string; a: string };
type Stat = { value: string; label: string };
type EngagementModel = {
  name: string;
  duration: string;
  description: string;
  bullets: string[];
};

export type ServiceData = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  features: Record<string, Item>;
  process: Record<string, Item>;
  cta: { title: string; subtitle: string; button: string };
  faqTitle?: string;
  faq?: Faq[];
  /** Optional heading above the features grid. */
  featuresTitle?: string;
  featuresIntro?: string;
  /** Heading for the process section (falls back to the page title). */
  processTitle?: string;
  /** Dark proof band under the hero, 3-4 figures. */
  stats?: Stat[];
  /** Checklist of concrete outputs, two columns. */
  deliverablesTitle?: string;
  deliverablesIntro?: string;
  deliverables?: Item[];
  /** Engagement model cards (how we work together). */
  modelsTitle?: string;
  modelsIntro?: string;
  models?: EngagementModel[];
  /** Tooling chip row. */
  toolsTitle?: string;
  tools?: string[];
  /** "Built for" audience grid. */
  whoTitle?: string;
  who?: Item[];
  /** Cards linking to the sub-service subpages. */
  subTitle?: string;
  subIntro?: string;
  sub?: Record<string, { name: string; teaser: string }>;
  /** Full subpage content, consumed by the ServiceSubpage template. */
  subpages?: Record<string, SubpageData>;
};

/** Two-digit index label ("01", "02", ...). */
const num = (i: number) => String(i + 1).padStart(2, "0");

/** Green checkmark used in checklists on light surfaces. */
export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Centered section heading: optional mono eyebrow, serif title, intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <Reveal>
          <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 0.05 : 0}>
        <h2 className="mx-auto max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.7] text-ink-soft">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export default function ServicePage({
  locale,
  service,
  visual = "grid",
  hrefBase,
}: {
  locale: Locale;
  service: ServiceKey;
  visual?: VisualKind;
  /** Base path for the sub-service cards, e.g. "/ai-data/consulting". */
  hrefBase?: string;
}) {
  const d = getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
  const features = Object.values(d.features);
  const steps = Object.values(d.process);
  const stats = d.stats ?? [];
  const deliverables = d.deliverables ?? [];
  const models = d.models ?? [];
  const tools = d.tools ?? [];
  const who = d.who ?? [];
  const subEntries = hrefBase && d.sub ? Object.entries(d.sub) : [];

  return (
    <main>
      <PageHero
        eyebrow={d.label}
        title={d.title}
        intro={d.subtitle}
        visual={visual}
        cta={{ label: d.cta.button, href: "/contact" }}
      />

      {/* Proof band */}
      {stats.length > 0 && (
        <section className="border-t border-night-line bg-night text-bone">
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

      {/* Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          {d.featuresTitle && (
            <SectionHeading
              title={d.featuresTitle}
              intro={d.featuresIntro}
              className="mb-14"
            />
          )}
          <Stagger
            className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
            gap={0.06}
          >
            {features.map((f, i) => (
              <StaggerItem key={f.title} className="h-full">
                <article className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream sm:p-8">
                  <span className="font-serif text-3xl font-light text-[#c3cede]">
                    {num(i)}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{f.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                    {f.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {d.deliverablesTitle && (
              <SectionHeading
                title={d.deliverablesTitle}
                intro={d.deliverablesIntro}
                className="mb-14"
              />
            )}
            <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.06}>
              {deliverables.map((item) => (
                <StaggerItem key={item.title} className="h-full">
                  <div className="flex h-full items-start gap-4 rounded border border-cream-line bg-white p-6 sm:p-7">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-[1.65] text-ink-soft">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <SectionHeading eyebrow={d.label} title={d.processTitle ?? d.title} />
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
            gap={0.08}
          >
            {steps.map((s, i) => (
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

      {/* Engagement models */}
      {models.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {d.modelsTitle && (
              <SectionHeading
                title={d.modelsTitle}
                intro={d.modelsIntro}
                className="mb-14"
              />
            )}
            <Stagger className="grid gap-5 lg:grid-cols-3" gap={0.08}>
              {models.map((m) => (
                <StaggerItem key={m.name} className="h-full">
                  <article className="flex h-full flex-col rounded border border-cream-line bg-white p-7 transition-colors duration-300 hover:border-ink/20 sm:p-8">
                    <h3 className="font-serif text-[1.7rem] font-medium leading-tight text-ink">
                      {m.name}
                    </h3>
                    <div className="mt-2.5 font-mono text-[12.5px] uppercase tracking-[0.1em] text-lime-deep">
                      {m.duration}
                    </div>
                    <p className="mt-5 text-[15px] leading-[1.65] text-ink-soft">
                      {m.description}
                    </p>
                    <ul className="mt-6 flex flex-col gap-2.5 border-t border-cream-line pt-6">
                      {m.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-[14.5px] text-ink-soft"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-lime" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Built for */}
      {who.length > 0 && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {d.whoTitle && <SectionHeading title={d.whoTitle} className="mb-14" />}
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
              {who.map((w) => (
                <StaggerItem key={w.title} className="h-full">
                  <div className="h-full rounded border border-cream-line bg-white p-6 sm:p-7">
                    <h3 className="text-lg font-semibold text-ink">{w.title}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-[1.65] text-ink-soft">
                      {w.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Tooling */}
      {tools.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-6 px-5 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:gap-12">
            {d.toolsTitle && (
              <Reveal>
                <div className="shrink-0 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                  {d.toolsTitle}
                </div>
              </Reveal>
            )}
            <Stagger className="flex flex-wrap gap-2.5" gap={0.03}>
              {tools.map((t) => (
                <StaggerItem key={t}>
                  <span className="inline-block rounded-[2px] border border-cream-line px-3.5 py-2 font-mono text-[13px] text-ink-soft">
                    {t}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Go deeper: sub-service cards */}
      {hrefBase && subEntries.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            {d.subTitle && (
              <SectionHeading
                title={d.subTitle}
                intro={d.subIntro}
                className="mb-14"
              />
            )}
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
              {subEntries.map(([slug, s]) => (
                <StaggerItem key={slug} className="h-full">
                  <LocaleLink
                    href={`${hrefBase}/${slug}`}
                    className="group flex h-full flex-col rounded border border-cream-line bg-white p-7 transition-colors duration-300 hover:border-lime sm:p-8"
                  >
                    <h3 className="font-serif text-2xl font-medium leading-tight text-ink">
                      {s.name}
                    </h3>
                    <p className="mt-3.5 text-[15px] leading-[1.65] text-ink-soft">
                      {s.teaser}
                    </p>
                    <span className="mt-auto flex items-center pt-7 text-lime-deep">
                      <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </LocaleLink>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {d.faq && d.faq.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {d.faqTitle ?? "FAQ"}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {d.faq.map((item) => (
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

/** Shared metadata helper for service pages. */
export function serviceMetadata(locale: Locale, service: ServiceKey) {
  const d = getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
  return { title: d.title, description: d.subtitle };
}
