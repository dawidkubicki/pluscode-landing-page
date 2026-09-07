import { Reveal } from "./motion";
import LocaleLink from "./locale-link";
import { BandGlow } from "./ui";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type BannerDict = Dictionary["banners"]["move"];

/** The route the booking flow lives on. The face only appears beside a button
 *  that actually reaches the person whose face it is. */
const BOOKING_HREF = "/book-a-call";

/**
 * The single call-to-action band, on `night`, the one ground above the footer
 * that is lifted off the page. On a dark page that lift is one step, so the
 * band carries both hairlines and `BandGlow`, the accent light rising from
 * under the button; without them it read as a gap between two dark things.
 *
 * **Centred, and `dict.text` does not render.** The close is one headline and
 * one button, because the close is the one place on the page where symmetry
 * earns its keep: the eye should stop moving here, not carry on reading. The
 * paragraph that used to sit beside the heading said "thirty minutes with
 * Krzysztof Suliński", which the hero already says under its own buttons, and
 * a second telling of it under a button labelled "Book a call with Krzysztof"
 * is the third. He survives here as the 32px face beside the button, which is
 * the more persuasive of the two placements and costs no lines.
 *
 * It sits on `.pc-shell` and `.pc-rules-dark`, so its edges and its vertical
 * hairlines line up with the eight light bands above it instead of running on
 * a third, wider grid of its own, which is what made the old close feel like a
 * different page stapled to the bottom of this one.
 *
 * The pinstripe is masked radially: invisible behind the words, visible only
 * at the corners, so the ground has texture and none of it reaches the text.
 * The glow is masked linearly for the same reason: it stops below the headline.
 *
 * `href` defaults to the booking route because that is what the homepage close
 * asks for. A caller whose call to action is not "talk to Krzysztof", such as
 * the careers close on `/about`, passes its own `href` and the face drops out
 * with it. `secondary` is optional and stays unrendered unless a caller has a
 * real second label to give it. There is no invented copy standing in for one.
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
  const showPerson = href === BOOKING_HREF;

  return (
    <section
      className={`relative isolate overflow-hidden border-y border-night-line bg-night text-bone ${className}`}
    >
      <div
        aria-hidden
        className="pinstripe-dark texture-mask pointer-events-none absolute inset-0 -z-10"
      />
      <BandGlow />
      <div className="pc-shell">
        <div className="pc-rules-dark">
          <div className="pc-grid">
            <div className="col-[2/-2] flex flex-col items-center justify-center gap-9 py-24 text-center max-lg:gap-7 max-lg:py-20">
              <Reveal>
                {/*
                  Sized off the viewport rather than off a breakpoint, so the
                  break lands in the same place at 1280 and at 1920.

                  The measure is 11em and it is measured, not chosen. Two lines
                  is what the band's 380px is built on, and 11em is the widest
                  value that gives two lines in English, Polish and German
                  alike at every width from 640 up: at 12em the English close
                  collapses onto one line and the band loses 59px against the
                  German one, which is exactly the locale drift a fixed band
                  height exists to prevent.
                */}
                <h2
                  className="display max-w-[11em] text-balance leading-[1] text-bone"
                  style={{
                    fontSize: "clamp(36px, calc(26px + 2.5vw), 56px)",
                    letterSpacing:
                      "clamp(-0.84px, calc(-0.12px - 0.06vw), -0.36px)",
                  }}
                >
                  {dict.titleStart}
                  {/* Inter Tight ships roman only, so an italic here would be a
                      synthesised oblique. The colour does the emphasis. */}
                  <em className="not-italic text-lime-soft">{dict.titleEm}</em>
                  {dict.titleEnd}
                </h2>
              </Reveal>

              <Reveal
                delay={0.08}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                {showPerson && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/assets/team/krzysztof-avatar.jpg"
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-full object-cover object-center"
                  />
                )}
                <LocaleLink href={href} className="btn btn-primary">
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
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
