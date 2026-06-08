import type { ReactNode } from "react";
import { Reveal } from "./motion";
import { TagPill, Pill } from "./ui";
import { Visual, type VisualKind } from "./visual";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Cta = { label: string; href: string };

/**
 * Shared hero banner for routed subpages.
 *
 * Mirrors the dark, rounded "night" block used by the homepage Hero so every
 * subpage opens with the same brand language, while clearing the fixed header.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  visual,
  cta,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  visual?: VisualKind;
  cta?: Cta;
}) {
  return (
    <section className="px-2 pt-[5.5rem] sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-24 text-bone sm:px-10 sm:py-32">
        {visual && (
          <>
            <Visual kind={visual} className="absolute inset-0 -z-10 opacity-40" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/85 to-night/55" />
          </>
        )}
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <TagPill className="text-bone-soft">{eyebrow}</TagPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-4xl text-balance text-5xl font-medium leading-[1.04] tracking-tight text-bone sm:text-6xl lg:text-7xl">
              {title}
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-soft">
                {intro}
              </p>
            </Reveal>
          )}
          {cta && (
            <Reveal delay={0.15}>
              <div className="mt-9">
                <Pill variant="lime" href={cta.href}>
                  {cta.label}
                </Pill>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/** Closing call-to-action band that points subpages back to /contact. */
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
    <section className="px-2 py-6 sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-20 text-center text-bone sm:px-10 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-balance text-4xl font-medium leading-[1.06] tracking-tight text-bone sm:text-5xl">
              {resolvedTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-md text-bone-soft">{resolvedText}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex justify-center">
              <Pill variant="lime" href={resolvedCta.href}>
                {resolvedCta.label}
              </Pill>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
