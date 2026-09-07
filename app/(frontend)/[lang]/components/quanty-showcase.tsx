import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { QUANTY_URL } from "@/lib/social";

/**
 * The one image in this band: a real capture of quanty.ai's hero product
 * window (headless Chromium, dark theme, 2x), not a mock drawn here. The
 * dimensions are the file's pixels; the layout below decides how much of
 * it is on screen.
 */
const SHEET = {
  src: "/assets/quanty/sheet-2x.webp",
  width: 2240,
  height: 1282,
};

/** `chip` is not in the dictionary yet; the fallback is the English label. */
type QuantyDict = Dictionary["quanty"] & { chip?: string };

/** A 16px check, drawn in the accent text colour. */
function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="mt-[3px] size-4 shrink-0 text-lime-soft"
    >
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The arrow that says "this leaves the site": up and to the right. */
function ArrowOut({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Band 8, our own product. Proof that the two people on this page ship
 * software of their own, not only consulting hours.
 *
 * Quanty is Pluscode's product and the band says so three times, in three
 * registers: the pill ("Our own product"), the chip on the window ("Built
 * by Pluscode") and the small note under the link, which is the exact
 * sentence Quanty's own footer carries. It is never called a partner.
 *
 * THE OBJECT. One product window, cut by the band's bottom rule. Quanty's
 * own hero draws its window 640 tall in a 560 box, so the sheet runs off
 * the section edge and reads as a screen you are looking through rather
 * than a picture you are looking at; this band does the same with the
 * capture. The `.pc-rules` wrapper carries the clip, so the cut lands
 * exactly on the hairlines: the bottom rule cuts the last rows and the
 * right rule takes the last few pixels of the window's own frame, so no
 * bezel border ever sits beside a container rule.
 *
 * HEIGHT. The body is a fixed 480px from `xl` (500 at 1440 would be the
 * same picture with more empty sheet). The copy column at 1440 measures
 * about 400 in EN and 460 in PL, so the window sets the height and the
 * copy never does. Below `xl` the body takes its height from the copy and
 * the window sits on the rule without a crop, which is plain and correct
 * at 1024. Below `lg` everything stacks: the copy, then a 316px window
 * pushed 259px to the left so a phone shows the sheet from the supplier
 * column to the window's right edge (the amount, the due date, the source
 * card) rather than the sidebar and the file names.
 */
export default function QuantyShowcase({ dict }: { dict: QuantyDict }) {
  const chip = dict.chip ?? "Built by Pluscode";

  return (
    <section
      id="quanty"
      className="scroll-mt-24 border-t border-cream-line bg-cream-dim"
    >
      <div className="pc-shell">
        {/* `overflow-hidden` here, not on the section: the clip has to happen
            at the vertical rules, so the window is cut by the same lines that
            frame every other band. */}
        <div className="pc-rules overflow-hidden">
          {/* The band header. Closes on its own rule. */}
          <div className="pc-grid border-b border-cream-line pt-14 pb-6 lg:pt-16 lg:pb-7 xl:pt-20">
            <div
              className="col-[3/-3] flex flex-col items-start gap-5 lg:col-[2/-2]"
              data-reveal
            >
              <span className="pc-pill">{dict.label}</span>
              <h2 className="display max-w-[24em] text-balance text-heading-md">
                <span className="text-ink">{dict.title} </span>
                <span className="text-ink-soft">{dict.greyClause}</span>
              </h2>
            </div>
          </div>

          <div className="pc-grid xl:h-[480px]">
            {/* ---- the copy: three rows, one link, one line of small print */}
            <div
              className="col-[3/-3] flex flex-col pt-10 pb-10 lg:col-[2/10] lg:pt-8 lg:pb-12 lg:pr-10 xl:pr-14"
              data-reveal
            >
              <ul className="border-t border-cream-line">
                {dict.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 border-b border-cream-line py-4 text-[15px] leading-[1.5] text-ink-soft"
                  >
                    <Check />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href={QUANTY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline group"
                >
                  {dict.cta}
                  <ArrowOut className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <p className="text-[13px] leading-[1.5] text-ink-mute">
                  {dict.note}
                </p>
              </div>
            </div>

            {/* ---- the window ---------------------------------------------
                Below `lg` this box is the whole width of the rules and 316px
                tall, and it clips its own content, because on a phone the
                window is wider than the screen and shifted left. From `lg`
                it stops clipping (the rules wrapper does that) and from `xl`
                the bezel is taken out of flow so the fixed 480 body, not the
                bezel's height, decides where the rule falls. */}
            <div
              className="relative col-[1/-1] h-[316px] overflow-hidden md:h-[420px] md:pt-4 lg:col-[10/-1] lg:h-auto lg:overflow-visible lg:pt-8 xl:h-full"
              data-reveal
              style={{ "--reveal-delay": "0.08" } as CSSProperties}
            >
              <div className="max-md:w-[624px] max-md:-translate-x-[259px] lg:w-[calc(100%+8px)] xl:absolute xl:top-8 xl:left-0">
                <div className="overflow-hidden rounded-xl border border-cream-line bg-cream-surface p-1.5">
                  <Image
                    src={SHEET.src}
                    alt={dict.imageAlt}
                    width={SHEET.width}
                    height={SHEET.height}
                    sizes="(min-width: 1024px) 64vw, (min-width: 768px) 100vw, 610px"
                    loading="lazy"
                    className="block h-auto w-full rounded-[7px]"
                  />
                </div>
              </div>

              {/* The chip sits on the bezel's top edge from `md` and inside
                  the window's empty header bar on a phone, where the edge is
                  clipped. Positioned against the column, not the bezel, so
                  the phone's 259px shift cannot carry it off screen. */}
              <span className="pc-pill absolute top-3 left-3 z-10 md:top-1 md:left-4 lg:top-5">
                {chip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
