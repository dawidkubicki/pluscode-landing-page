import { Reveal } from "./motion";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type BannerDict = Dictionary["banners"]["move"];

/** The route the booking flow lives on, and the default ask. */
const BOOKING_HREF = "/book-a-call";

/**
 * BANNER. The closing ask, on ink.
 *
 * The same object as `CtaBand` in page-hero.tsx, and deliberately so: an
 * inner page should close the same way whichever of the two it reaches
 * for. The ask sits on the left half of the grid, the sentence and the
 * button on the right, aligned to the right edge above 768px.
 *
 * What is gone: the lifted ground with its two hairlines, the pinstripe,
 * the accent glow under the button, the 32px round face beside it and the
 * coloured word inside the headline. The system has no glow, no radius
 * and no highlighted word in a headline, and the change of ground from
 * paper to ink is the whole separation this band needs.
 *
 * `on-dark` switches the global focus ring from ink to white. Without it
 * the ring on these buttons would be invisible against the ground.
 *
 * The headline is stored in three pieces because it used to tint the
 * middle one. It renders as one plain sentence now. `secondary` stays
 * unrendered unless a caller has a real second label to give it: there is
 * no invented copy standing in for one.
 */
export default function Banner({
  dict,
  href = BOOKING_HREF,
  secondary,
  className = "",
}: {
  dict: BannerDict;
  href?: string;
  secondary?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={`on-dark bg-ink py-20 md:py-[104px] ${className}`}>
      <div className="pc-shell">
        <div className="pc-grid">
          <Reveal className="col-span-4 md:col-span-6">
            <h2 className="text-heading-lg text-white">
              {dict.titleStart}
              {dict.titleEm}
              {dict.titleEnd}
            </h2>
          </Reveal>
          <Reveal
            delay={0.08}
            className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end"
          >
            <p className="max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
              {dict.text}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <LocaleLink href={href} className="btn btn-invert">
                {dict.cta}
              </LocaleLink>
              {secondary && (
                <LocaleLink
                  href={secondary.href}
                  className="btn btn-outline-dark"
                >
                  {secondary.label}
                </LocaleLink>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
