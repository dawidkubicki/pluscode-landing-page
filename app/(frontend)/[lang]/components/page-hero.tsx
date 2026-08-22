import type { ReactNode } from "react";
import { Reveal } from "./motion";
import { Arrow } from "./ui";
import { Visual, type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Cta = { label: string; href: string };

/**
 * Shared hero banner for routed subpages.
 *
 * Full-bleed dark navy with a serif display headline, so every subpage opens
 * with the same brand language as the home hero, while clearing the fixed
 * header. The blueprint grid is on by default and off on form pages.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  visual,
  cta,
  grid = true,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  visual?: VisualKind;
  cta?: Cta;
  /** Faint blueprint grid. Off on form pages, where the surface stays plain. */
  grid?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night text-bone">
      {visual && (
        <>
          <Visual kind={visual} className="absolute inset-0 -z-20 opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/85 to-night/55" />
        </>
      )}
      {grid && <div className="blueprint-grid absolute inset-0 -z-10" />}
      <div className="absolute -right-44 -top-44 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(43,92,255,0.2)_0%,rgba(43,92,255,0)_65%)]" />

      <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-40 sm:px-10 sm:pb-20 sm:pt-[11rem]">
        <Reveal>
          <div className="mb-7 flex items-center gap-2.5">
            <span className="inline-block size-2 rounded-full bg-lime animate-pulse-dot" />
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone-dim sm:text-[13px]">
              {eyebrow}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display max-w-[940px] text-balance text-5xl sm:text-6xl lg:text-[4.5rem]">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[620px] text-lg leading-[1.65] text-bone-soft sm:text-[19px]">
              {intro}
            </p>
          </Reveal>
        )}
        {cta && (
          <Reveal delay={0.15}>
            <div className="mt-10">
              <LocaleLink
                href={cta.href}
                className="group inline-flex items-center gap-3 rounded-[2px] bg-lime px-[30px] py-4 text-[15.5px] font-semibold text-white transition-colors hover:bg-lime-bright"
              >
                {cta.label}
                <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
              </LocaleLink>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Closing cobalt call-to-action band pointing subpages back to /contact. */
export function CtaBand({
  locale,
  title,
  text,
  cta,
}: {
  locale: Locale;
  title?: string;
  text?: string;
  cta?: Cta;
}) {
  const t = getDictionary(locale).cta;
  const resolvedTitle = title ?? t.title;
  const resolvedText = text ?? t.text;
  const resolvedCta = cta ?? { label: t.button, href: "/contact" };
  return (
    <section className="bg-lime text-white">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="display text-balance text-4xl leading-[1.1] sm:text-5xl">
            {resolvedTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="text-[16.5px] leading-[1.7] text-white/90">{resolvedText}</p>
            <LocaleLink
              href={resolvedCta.href}
              className="mt-7 inline-block rounded-[2px] bg-white px-[30px] py-[15px] text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-night hover:text-white"
            >
              {resolvedCta.label}
            </LocaleLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
