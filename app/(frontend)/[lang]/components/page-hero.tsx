import type { ReactNode } from "react";
import { Reveal } from "./motion";
import { BandGlow, Eyebrow } from "./ui";
import { type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Cta = { label: string; href: string };

/**
 * Shared hero banner for routed subpages.
 *
 * Eleven routes open with this, so it carries the site's first impression
 * everywhere except the homepage. Page ground, a tinted eyebrow pill, one
 * display headline and one sentence: the same language as the home hero, and
 * nothing behind the words. The top padding clears the fixed header.
 *
 * THE ONE GRID. This used to wrap in `max-w-[1240px] px-5 sm:px-10`, which was
 * a third container beside the homepage's shell and the footer's own copy of
 * the same 1240 wrapper. Eleven subpages therefore lined up with nothing. It
 * now sits on `.pc-shell` > `.pc-rules` > `.pc-grid` at `col-[2/-2]`, the same
 * 1,276px measure inside the same two hairlines that every homepage band uses,
 * so a headline here starts on the same x as a headline there.
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
    <section className="border-b border-cream-line bg-cream">
      <div className="pc-shell">
        <div className="pc-rules">
          {/* The header is 72px and fixed, and the layout already pushes the
              page down past the announcement bar, so `pt-32` leaves 56px of
              clear ground under the bar rather than 72. */}
          <div className="pc-grid pb-14 pt-32 lg:pb-16 lg:pt-36 xl:pb-18 xl:pt-40">
            <div className="col-[2/-2] flex flex-col items-start">
              <Reveal>
                <Eyebrow>{eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="display mt-6 max-w-[16em] text-balance text-heading-md text-ink sm:text-heading-lg xl:text-heading-xl">
                  {title}
                </h1>
              </Reveal>
              {intro && (
                <Reveal delay={0.1}>
                  <p className="mt-5 max-w-[32em] text-[17px] leading-[1.6] text-ink-soft">
                    {intro}
                  </p>
                </Reveal>
              )}
              {cta && (
                <Reveal delay={0.15}>
                  <div className="mt-8">
                    <LocaleLink href={cta.href} className="btn btn-primary">
                      {cta.label}
                    </LocaleLink>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Closing call-to-action band for subpages.
 *
 * On `night`, one step above the page, pinstriped and radially masked, with
 * both hairlines and the same accent glow as the homepage banner, so it reads
 * as the same ask rather than as a second, competing one. It used to be a
 * full accent-coloured ground, which spent the whole page's accent budget on a
 * band nobody reads twice.
 *
 * On the same grid as everything else, with `.pc-rules-dark` carrying the two
 * vertical hairlines through onto the dark ground, so the band's edges line up
 * with the light bands above it instead of stopping 100px short of them.
 * The split is Attio's 24/8: the ask at columns 2 to 13, the sentence and the
 * button at 14 to 25.
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
    <section className="relative isolate overflow-hidden border-y border-night-line bg-night text-bone">
      <div
        aria-hidden
        className="pinstripe-dark texture-mask pointer-events-none absolute inset-0 -z-10"
      />
      <BandGlow />
      <div className="pc-shell">
        <div className="pc-rules-dark">
          <div className="pc-grid gap-y-8 py-16 lg:py-20">
            <div className="col-[2/-2] lg:col-[2/13] lg:self-center">
              <Reveal>
                <h2 className="display max-w-[12em] text-balance text-heading-md lg:text-heading-lg">
                  {resolvedTitle}
                </h2>
              </Reveal>
            </div>
            <div className="col-[2/-2] lg:col-[14/-2] lg:self-center">
              <Reveal delay={0.08}>
                <p className="max-w-[32em] text-[16px] leading-[1.6] text-bone-soft">
                  {resolvedText}
                </p>
                <LocaleLink
                  href={resolvedCta.href}
                  className="btn btn-primary mt-7"
                >
                  {resolvedCta.label}
                </LocaleLink>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
