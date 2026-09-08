import type { Metadata } from "next";
import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { SectionHeading, Check } from "./service-page";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildOpenGraph } from "@/lib/seo";

/* ------------------------------------------------------------------ *
 *  THE SOLUTION PAGE. One template, six routes.
 *
 *  WHY IT EXISTS. The fullscreen Offerings menu and the footer both list
 *  five or six things a buyer might want ("Paperwork automation",
 *  "Assistants and automation", "Data governance") and every one of them
 *  used to land on one of three generic /ai-data pages. Somebody clicking
 *  "Assistants and automation" arrived at a page headed "Machine Learning
 *  Solutions" that was not about what they clicked. These six routes are
 *  the pages those links were always promising.
 *
 *  THE DIFFERENCE FROM /services/*. A service page describes how we work
 *  (an engagement, a stack, a team). A solution page describes a problem
 *  the reader already has, in their words, and what is different on the
 *  Monday after it is solved. So there is no technology chip row here and
 *  no stat band: the bands are what this is, what it does, what you walk
 *  away with, how it runs, who it suits and what it costs in time. That
 *  last one is calendar time, which is the question every buyer asks
 *  second and almost no agency page answers.
 *
 *  ALL COPY COMES FROM THE DICTIONARY, under one top level `solutions`
 *  key written by scripts/content/solutions.ts in all three locales at
 *  once. Nothing on this page is hardcoded English.
 *
 *  THE CAST on `getSolutions`. `Dictionary` is `typeof en.json`, so the
 *  key only becomes part of the type once the content script has run.
 *  Reading it through an explicit shape keeps the template compiling in
 *  either order and, more usefully, states the contract the script has to
 *  satisfy in one place rather than leaving it implied by JSON.
 *
 *  Server component throughout: no state, no effects, no client bundle.
 * ------------------------------------------------------------------ */

/** One row in a ruled list: an index, a headline, a sentence. */
type Row = { title: string; body: string };

/** A row of the time band. `span` is calendar time, never effort. */
type Phase = { span: string; title: string; body: string };

/** A card that leaves the page. `href` carries no locale prefix. */
type Onward = { title: string; body: string; href: string };

export type SolutionPageData = {
  label: string;
  title: string;
  intro: string;
  metaDescription: string;

  /** What this is, in prose, plus the honesty note under it. */
  whatTitle: string;
  whatBody: string[];
  whatNote: string;

  /** What it does. The ruled list, five rows. */
  doesTitle: string;
  doesIntro: string;
  does: Row[];

  /** What you walk away with. The dark plate. */
  getTitle: string;
  getIntro: string;
  get: Row[];

  /** How it runs. The steps. */
  stepsTitle: string;
  steps: Row[];

  /** Who this suits. */
  whoTitle: string;
  who: Row[];

  /** What it costs in time. Calendar weeks, stated as a plan. */
  timeTitle: string;
  timeIntro: string;
  time: Phase[];

  /** Where to go instead, or next. */
  relatedTitle: string;
  related: Onward[];

  cta: { title: string; text: string; button: string };
};

export type SolutionsIndexData = {
  label: string;
  /** The "all six" link, used by the footer and the sitemap page rather than
   *  by the index itself. */
  allLabel: string;
  title: string;
  intro: string;
  metaDescription: string;
  listTitle: string;
  listIntro: string;
  items: { key: SolutionKey; slug: string; name: string; teaser: string }[];
  startTitle: string;
  startIntro: string;
  start: Row[];
  elsewhereTitle: string;
  elsewhere: Onward[];
  cta: { title: string; text: string; button: string };
};

export type SolutionsContent = {
  index: SolutionsIndexData;
  pages: Record<SolutionKey, SolutionPageData>;
};

export type SolutionKey =
  | "paperworkAutomation"
  | "answersFromDocuments"
  | "assistantsAndAutomation"
  | "forecastingAndReporting"
  | "processMapping"
  | "dataGovernance";

/** Key to route segment. The six slugs are fixed: the menu, the footer and
 *  two neighbouring pages link to them by name. */
export const SOLUTION_SLUGS: Record<SolutionKey, string> = {
  paperworkAutomation: "paperwork-automation",
  answersFromDocuments: "answers-from-documents",
  assistantsAndAutomation: "assistants-and-automation",
  forecastingAndReporting: "forecasting-and-reporting",
  processMapping: "process-mapping",
  dataGovernance: "data-governance",
};

export function getSolutions(locale: Locale): SolutionsContent {
  return (getDictionary(locale) as unknown as { solutions: SolutionsContent })
    .solutions;
}

/** Two-digit index label ("01", "02", ...), as everywhere else on the site. */
const num = (i: number) => String(i + 1).padStart(2, "0");

/* One closing hairline under a ruled list. Every rule belongs to the row
   below it, so without this the list is open at the bottom and the last row
   bleeds into the band padding. It is structure, not content. */
function ClosingRule() {
  return (
    <div
      aria-hidden="true"
      className="col-span-4 border-t border-rule md:col-span-12"
    />
  );
}

/** Three onward cards on the page-dim ground. Used by the six pages and by
 *  the index, which is why it takes its heading as a prop. */
export function OnwardBand({
  title,
  items,
}: {
  title: string;
  items: Onward[];
}) {
  return (
    <section className="bg-paper-dim py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <SectionHeading title={title} className="col-span-4 md:col-span-8" />
        </div>
        <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
          {items.map((item) => (
            <StaggerItem
              key={item.href}
              className="col-span-4 border-t border-rule pt-8"
            >
              {/* The whole cell is the target and the headline is what moves,
                  the same pairing the homepage cards use. */}
              <LocaleLink href={item.href} className="group block">
                <h3 className="text-heading-md text-ink">
                  <span className="pc-link group-hover:[background-size:100%_1px]">
                    {item.title}
                  </span>
                </h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {item.body}
                </p>
              </LocaleLink>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default function SolutionPage({
  locale,
  solution,
  ctaHref = "/book-a-call",
}: {
  locale: Locale;
  solution: SolutionKey;
  /** Where both calls to action point. These pages sell a conversation with
      an engineer, so the default is the booking flow rather than the form. */
  ctaHref?: string;
}) {
  const d = getSolutions(locale).pages[solution];

  return (
    <main>
      <PageHero
        eyebrow={d.label}
        title={d.title}
        intro={d.intro}
        cta={{ label: d.cta.button, href: ctaHref }}
      />

      {/* WHAT THIS IS. Prose, because this is the one band whose job is to
          let the reader recognise their own problem, and a bulleted list
          cannot do that. The title hangs off the left edge and the text
          runs in the right half, which is the same split the homepage
          band headers use. */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-5">
              <h2 className="text-heading-lg text-ink">{d.whatTitle}</h2>
            </Reveal>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              {d.whatBody.map((paragraph, i) => (
                <Reveal key={i} delay={0.05 * (i + 1)}>
                  <p
                    className={`text-[1.125rem] leading-[1.375] text-moss ${
                      i > 0 ? "mt-6" : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
              {/* The honesty note. Two engineers, EU hosting, the AI Act tier
                  settled before design. It is set apart by a hairline rather
                  than by a box, and it is the same 14px the labels use. */}
              <Reveal delay={0.2}>
                <p className="mt-8 border-t border-rule pt-6 text-[0.875rem] leading-[1.375] text-moss">
                  {d.whatNote}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES. Five rows as a table of contents, not five cards:
          each row re-enters the grid so the number, the headline and the
          sentence land on page columns 1, 2 to 6 and 7 to 12. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={d.doesTitle}
              intro={d.doesIntro}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.06}>
            {d.does.map((item, i) => (
              <StaggerItem
                key={item.title}
                className="col-span-4 border-t border-rule py-8 md:col-span-12"
              >
                <div className="pc-grid">
                  <p className="col-span-4 text-[0.875rem] text-moss md:col-span-1">
                    {num(i)}
                  </p>
                  <h3 className="col-span-4 text-heading-md text-ink md:col-span-5">
                    {item.title}
                  </h3>
                  <p className="col-span-4 text-[1.125rem] leading-[1.375] text-moss md:col-span-6">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
            <ClosingRule />
          </Stagger>
        </div>
      </section>

      {/* WHAT YOU WALK AWAY WITH. The dark plate. The change of ground is
          the whole separation, so there are no hairlines above or below the
          band, only the rule that opens each item. `on-dark` is what turns
          the global focus ring white here. */}
      <section className="on-dark bg-ink py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-8">
              <h2 className="text-heading-lg text-white">{d.getTitle}</h2>
            </Reveal>
            <Reveal delay={0.05} className="col-span-4 md:col-span-8">
              <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
                {d.getIntro}
              </p>
            </Reveal>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.06}>
            {d.get.map((item) => (
              <StaggerItem
                key={item.title}
                className="col-span-4 flex items-start gap-4 border-t border-rule-dark pt-8 md:col-span-6"
              >
                <Check className="mt-1 size-5 shrink-0 text-white" />
                <div>
                  <h3 className="text-heading-sm text-white">{item.title}</h3>
                  <p className="mt-3 text-[1.125rem] leading-[1.375] text-mist">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* HOW IT RUNS. Four steps across the twelve columns. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              eyebrow={d.label}
              title={d.stepsTitle}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {d.steps.map((step, i) => (
              <StaggerItem
                key={step.title}
                className="col-span-4 border-t border-rule pt-8 md:col-span-3"
              >
                <span className="text-[0.875rem] text-moss">{num(i)}</span>
                <h3 className="mt-3 text-heading-sm text-ink">{step.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {step.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* WHO THIS SUITS. Three, on thirds of the grid. */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={d.whoTitle}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {d.who.map((item) => (
              <StaggerItem
                key={item.title}
                className="col-span-4 border-t border-rule pt-8"
              >
                <h3 className="text-heading-sm text-ink">{item.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {item.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* WHAT IT COSTS IN TIME. Calendar time, in the span the reader will
          have to hold open, with what has to be true for it to hold. The
          span label sits where the two-digit index sits everywhere else. */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={d.timeTitle}
              intro={d.timeIntro}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {d.time.map((phase) => (
              <StaggerItem
                key={phase.span}
                className="col-span-4 border-t border-rule pt-8"
              >
                <span className="text-[0.875rem] text-moss">{phase.span}</span>
                <h3 className="mt-3 text-heading-sm text-ink">{phase.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {phase.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <OnwardBand title={d.relatedTitle} items={d.related} />

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.text}
        cta={{ label: d.cta.button, href: ctaHref }}
      />
      <Footer locale={locale} />
    </main>
  );
}

/** Shared metadata for one solution page, on the same shape the insight and
 *  case study routes use: title, description, canonical, full Open Graph. */
export function solutionMetadata(locale: Locale, solution: SolutionKey): Metadata {
  const d = getSolutions(locale).pages[solution];
  const path = `/solutions/${SOLUTION_SLUGS[solution]}`;
  return {
    title: d.title,
    description: d.metaDescription,
    alternates: { canonical: `/${locale}${path}` },
    openGraph: buildOpenGraph(locale, {
      title: d.title,
      description: d.metaDescription,
      path,
    }),
  };
}

/** Metadata for the /solutions index. */
export function solutionsIndexMetadata(locale: Locale): Metadata {
  const d = getSolutions(locale).index;
  return {
    title: d.title,
    description: d.metaDescription,
    alternates: { canonical: `/${locale}/solutions` },
    openGraph: buildOpenGraph(locale, {
      title: d.title,
      description: d.metaDescription,
      path: "/solutions",
    }),
  };
}
