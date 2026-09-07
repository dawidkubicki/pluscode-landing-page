import type { ReactNode } from "react";
import { Reveal } from "./motion";
import { Eyebrow } from "./ui";
import { type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Cta = { label: string; href: string };

/**
 * PAGE HERO. The top of every inner page.
 *
 * Eleven routes open with this, so it carries the first impression
 * everywhere except the homepage, and it has to be the same object as a
 * homepage band: page ground, the one 12 column grid, no artwork and
 * nothing behind the words.
 *
 * The top padding is doing real work. The header is fixed, so `pt-40`
 * (and `md:pt-48`) is what leaves clear ground under it rather than
 * letting the eyebrow run beneath the bar. The bottom padding is the
 * standard band value, so the first band below this one sits at the same
 * distance it would sit from any other band.
 *
 * The text runs to eight of twelve columns and the sentence is held to
 * roughly 46 characters, which is the measure the reference reads at.
 * Below 768px the grid is four columns wide, so the mobile span is
 * col-span-4 and the desktop one is prefixed.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  cta,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** @deprecated The hero carries no artwork on the page ground. Ignored. */
  visual?: VisualKind;
  cta?: Cta;
  /** @deprecated The blueprint grid is gone with the dark surfaces. Ignored. */
  grid?: boolean;
}) {
  return (
    <section className="bg-paper pb-20 pt-40 md:pb-[104px] md:pt-48">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-8">
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 text-heading-xl text-ink">{title}</h1>
            </Reveal>
            {intro && (
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                  {intro}
                </p>
              </Reveal>
            )}
            {cta && (
              <Reveal delay={0.15}>
                <LocaleLink href={cta.href} className="btn btn-primary mt-8">
                  {cta.label}
                </LocaleLink>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * CTA BAND. The closing ask on an inner page.
 *
 * A dark plate on ink, laid out on the same header pair every band on the
 * homepage uses: the ask on the left half, the sentence and the button on
 * the right, aligned to the right edge above 768px. It used to be a lifted
 * ground with two hairlines, a pinstripe and an accent glow under the
 * button. None of those exist in this system, so the change of ground is
 * the whole separation.
 *
 * `on-dark` is not cosmetic. It is what switches the global focus ring
 * from ink to white, and without it the ring on this button would be
 * invisible against the ground.
 */
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
  // Left on /contact deliberately: retargeting every subpage's closing ask at
  // /book-a-call is a routing decision, not a restyle.
  const resolvedCta = cta ?? { label: t.button, href: "/contact" };

  return (
    <section className="on-dark bg-ink py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <Reveal className="col-span-4 md:col-span-6">
            <h2 className="text-heading-lg text-white">{resolvedTitle}</h2>
          </Reveal>
          <Reveal
            delay={0.08}
            className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end"
          >
            <p className="max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
              {resolvedText}
            </p>
            <LocaleLink href={resolvedCta.href} className="btn btn-invert">
              {resolvedCta.label}
            </LocaleLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
