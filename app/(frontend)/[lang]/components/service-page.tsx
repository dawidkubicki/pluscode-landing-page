import type { ReactNode } from "react";
import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { type VisualKind } from "./visual";
import { BrandMark } from "./brand-marks";
import LocaleLink from "./locale-link";
import { Eyebrow } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SubpageData } from "./service-subpage";

export type ServiceKey =
  | "machineLearning"
  | "analytics"
  | "consulting"
  | "softwareDevelopment"
  | "webDevelopment"
  | "mobile"
  | "mvpDevelopment"
  | "apiDevelopment"
  | "technologies"
  | "cloud"
  | "teamExtension"
  | "forwardDeployedEngineers";

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
  /** Named products we build on, each chip carrying its vendor mark. */
  techTitle?: string;
  tech?: { mark: string; name: string }[];
  /** Tooling chip row. On pages that also list `tech`, this is the methods half. */
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

/** One labelled row of chips, laid on the grid: label in the first three
 *  columns, chips wrapping across the remaining nine. */
function ToolRow({
  title,
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`pc-grid ${className}`}>
      {title && (
        <Reveal className="col-span-4 md:col-span-3">
          <Eyebrow>{title}</Eyebrow>
        </Reveal>
      )}
      <Stagger
        className={`col-span-4 flex flex-wrap gap-2.5 ${
          title ? "md:col-span-9" : "md:col-span-12"
        }`}
        gap={0.03}
      >
        {children}
      </Stagger>
    </div>
  );
}

/** Checkmark used in checklists on the page ground. Inherits its colour. */
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

/**
 * Section heading: optional eyebrow, the section title, an optional intro.
 *
 * It used to be centred with a serif 40px title. Nothing is centred in this
 * system: a band header hangs off the left edge of the grid like every header
 * on the homepage. The root element is a plain div so the call site can place
 * it on the grid through `className`, which is also where its column span
 * comes from.
 */
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
    <div className={className}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 0.05 : 0}>
        <h2 className={`text-heading-lg text-ink ${eyebrow ? "mt-4" : ""}`}>
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
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
  ctaHref = "/contact",
}: {
  locale: Locale;
  service: ServiceKey;
  visual?: VisualKind;
  /** Base path for the sub-service cards, e.g. "/ai-data/consulting". */
  hrefBase?: string;
  /** Where both call-to-action buttons point. Pages whose offer is a
      conversation with a named person send it to the booking flow instead. */
  ctaHref?: string;
}) {
  const d = getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
  const features = Object.values(d.features);
  const steps = Object.values(d.process);
  const stats = d.stats ?? [];
  const deliverables = d.deliverables ?? [];
  const models = d.models ?? [];
  const tech = d.tech ?? [];
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
        cta={{ label: d.cta.button, href: ctaHref }}
      />

      {/* Proof band. The change of ground is the whole separation: no
          hairlines above and below a band that is already a different
          colour from the two it sits between. */}
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

      {/* Features */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          {d.featuresTitle && (
            <div className="pc-grid">
              <SectionHeading
                title={d.featuresTitle}
                intro={d.featuresIntro}
                className="col-span-4 md:col-span-8"
              />
            </div>
          )}
          <Stagger
            className={`pc-grid ${d.featuresTitle ? "mt-16 md:mt-24" : ""}`}
            gap={0.06}
          >
            {features.map((f, i) => (
              <StaggerItem
                key={f.title}
                className="col-span-4 border-t border-rule pt-8 "
              >
                <span className="text-[0.875rem] text-moss">{num(i)}</span>
                <h3 className="mt-3 text-heading-sm text-ink">{f.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {f.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            {d.deliverablesTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={d.deliverablesTitle}
                  intro={d.deliverablesIntro}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            <Stagger
              className={`pc-grid ${d.deliverablesTitle ? "mt-16 md:mt-24" : ""}`}
              gap={0.06}
            >
              {deliverables.map((item) => (
                <StaggerItem
                  key={item.title}
                  className="col-span-4 flex items-start gap-4 border-t border-rule pt-8 md:col-span-6"
                >
                  <Check className="mt-1 size-5 shrink-0 text-ink" />
                  <div>
                    <h3 className="text-heading-sm text-ink">{item.title}</h3>
                    <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              eyebrow={d.label}
              title={d.processTitle ?? d.title}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {steps.map((s, i) => (
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

      {/* Engagement models */}
      {models.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            {d.modelsTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={d.modelsTitle}
                  intro={d.modelsIntro}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            <Stagger
              className={`pc-grid ${d.modelsTitle ? "mt-16 md:mt-24" : ""}`}
              gap={0.08}
            >
              {models.map((m) => (
                <StaggerItem
                  key={m.name}
                  className="col-span-4 border-t border-rule pt-8 "
                >
                  <span className="text-[0.875rem] text-moss">{m.duration}</span>
                  <h3 className="mt-3 text-heading-md text-ink">{m.name}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {m.description}
                  </p>
                  <ul className="mt-6 flex flex-col gap-2.5 border-t border-rule pt-6">
                    {m.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-[1rem] leading-[1.375] text-moss"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-ink" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Built for */}
      {who.length > 0 && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            {d.whoTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={d.whoTitle}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            <Stagger
              className={`pc-grid ${d.whoTitle ? "mt-16 md:mt-24" : ""}`}
              gap={0.08}
            >
              {who.map((w) => (
                <StaggerItem
                  key={w.title}
                  className="col-span-4 border-t border-rule pt-8 md:col-span-3"
                >
                  <h3 className="text-heading-sm text-ink">{w.title}</h3>
                  <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                    {w.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Tooling. Two rows when a page separates the products it builds on
          (with their marks) from the methods it applies; one row otherwise. */}
      {(tech.length > 0 || tools.length > 0) && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            {tech.length > 0 && (
              <ToolRow title={d.techTitle}>
                {tech.map((t) => (
                  <StaggerItem key={t.name}>
                    <span className="inline-flex items-center gap-2 border border-rule px-3.5 py-2 text-[1rem] text-moss">
                      <BrandMark name={t.mark} className="size-[18px] shrink-0 text-ink" />
                      {t.name}
                    </span>
                  </StaggerItem>
                ))}
              </ToolRow>
            )}

            {tools.length > 0 && (
              <ToolRow
                title={d.toolsTitle}
                className={tech.length > 0 ? "mt-12 md:mt-16" : ""}
              >
                {tools.map((t) => (
                  <StaggerItem key={t}>
                    <span className="inline-block border border-rule px-3.5 py-2 text-[1rem] text-moss">
                      {t}
                    </span>
                  </StaggerItem>
                ))}
              </ToolRow>
            )}
          </div>
        </section>
      )}

      {/* Go deeper: sub-service cards */}
      {hrefBase && subEntries.length > 0 && (
        <section className="bg-paper-dim py-20 md:py-[104px]">
          <div className="pc-shell">
            {d.subTitle && (
              <div className="pc-grid">
                <SectionHeading
                  title={d.subTitle}
                  intro={d.subIntro}
                  className="col-span-4 md:col-span-8"
                />
              </div>
            )}
            <Stagger
              className={`pc-grid ${d.subTitle ? "mt-16 md:mt-24" : ""}`}
              gap={0.08}
            >
              {subEntries.map(([slug, s]) => (
                <StaggerItem
                  key={slug}
                  className="col-span-4 border-t border-rule pt-8 "
                >
                  {/* The whole cell is the link and the headline is what
                      moves, the same pairing the homepage cards use. The
                      underline sits on an inline span so it ends where the
                      words do rather than at the column edge. */}
                  <LocaleLink href={`${hrefBase}/${slug}`} className="group block">
                    <h3 className="text-heading-md text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px]">
                        {s.name}
                      </span>
                    </h3>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {s.teaser}
                    </p>
                  </LocaleLink>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {d.faq && d.faq.length > 0 && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <Reveal className="col-span-4 md:col-span-8">
                <h2 className="text-heading-lg text-ink">
                  {d.faqTitle ?? "FAQ"}
                </h2>
              </Reveal>
            </div>
            {/* Questions run in a reading column, each one a ruled row: the
                hairline is the separation, so there is no card to draw. */}
            <Stagger className="pc-grid mt-16 md:mt-20" gap={0.06}>
              {d.faq.map((item) => (
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

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.subtitle}
        cta={{ label: d.cta.button, href: ctaHref }}
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
