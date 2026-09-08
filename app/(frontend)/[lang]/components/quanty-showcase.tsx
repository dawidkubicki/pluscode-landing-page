"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 *  QUANTY SHOWCASE. The product, moving, on /quanty.
 *
 *  EVERY PIXEL A VISITOR SEES HERE IS A REAL SCREEN CAPTURE. The repo
 *  bans synthetic app windows and the one exception is a genuine capture
 *  of our own product, unedited. So the motion is built out of two real
 *  captures rather than out of divs pretending to be a table:
 *
 *    showcase-sheet-2x.webp   the Quanty sheet, invoices read into rows,
 *                             the source popover open beside a value
 *    showcase-chat-2x.webp    the agent adding a Delivery status column
 *                             to an orders sheet and counting the overdue
 *
 *  Both are `sharp extract` crops of the two captures that already ship
 *  in this repo (`sheet-2x.webp`, `chat-2x.webp`). The crop exists for
 *  one reason: the two originals are 2240x1282 and 2552x1362, which are
 *  different shapes, and a crossfade between two different shapes inside
 *  one box either letterboxes or crops unpredictably. The derived files
 *  are both exactly 1.860, so the two states register on top of each
 *  other to the pixel. What was removed is the empty ground below the
 *  sheet's page tabs (78px) and 9px of window padding from each side of
 *  the chat capture. No content is cut, nothing is scaled, recoloured,
 *  retouched or composited. Re-derive both whenever the originals are
 *  recaptured from quanty.ai.
 *
 *  THE MOTION. One 16 second CSS timeline drives four things in step:
 *  the two frames cross-dissolve, the entering frame settles from 1.02
 *  to its exact size, the caption under the box swaps (out first, then
 *  in, so two paragraphs never overlap while both are legible) and the
 *  active state label moves from sage to the Quanty accent. Nothing else
 *  moves. Only `opacity`, `transform` and one 14px `color` animate, so
 *  there is no layout thrash and no JavaScript in the frame loop.
 *
 *  The settle is deliberately confined to the entrance. At 1.02 a frame
 *  is cropped by about 1% on each edge, which on the chat capture is
 *  close to the panel's close button; because it only happens while the
 *  frame is partly transparent, the RESTING image is always the exact,
 *  uncropped capture. That is the whole reason the pan runs on the way
 *  in rather than continuously.
 *
 *  IT PAUSES OFF SCREEN. The animations are declared paused and only run
 *  while `data-playing="true"`, which one IntersectionObserver sets. The
 *  observer is the only JavaScript here and it does not animate anything;
 *  if it never runs, or if scripts are off entirely, the band stays at
 *  the 0% keyframe, which is state A, opaque and untransformed. That is
 *  the same still frame `prefers-reduced-motion` gets, so every failure
 *  mode of this component is "the product is shown, it just does not
 *  change".
 * ------------------------------------------------------------------ */

/** The two derived captures, in the order the timeline shows them. The
 *  dictionary supplies the label, the caption and the alt text for each,
 *  and this array supplies the file: copy is content, a path is code. */
const CAPTURES = [
  "/assets/quanty/showcase-sheet-2x.webp",
  "/assets/quanty/showcase-chat-2x.webp",
] as const;

/** Measured off the derived files: 2240x1204 and 2533x1362 are both
 *  1.8605 and 1.8598, which differ by 0.04% and so crop by less than a
 *  pixel against this box at any width. */
const FRAME_ASPECT = "2240 / 1204";

/** The figure spans all twelve columns of the shell, so its width is the
 *  content width: the viewport less the shell's padding, which is 24px a
 *  side and 16px a side below 640. */
const FRAME_SIZES =
  "(max-width: 639px) calc(100vw - 32px), calc(100vw - 48px)";

/* One timeline, four animations, expressed as plain keyframes so nothing
 * here needs a frame loop. Percentages of a 16s cycle:
 *
 *    0 - 45    state A holds
 *   45 - 50    the frames cross-dissolve, B settles from 1.02
 *   50 - 92    state B holds
 *   92 - 100   the frames cross-dissolve back, A settles from 1.02
 *
 * The caption pair runs three points ahead of the frames on the way out
 * and three behind on the way in, which is what stops two paragraphs of
 * text being half readable on top of each other mid-swap.
 *
 * Unlayered on purpose, like `ITEM_CSS` in platform.tsx: it beats the
 * utilities layer, so a `text-sage` on the same element cannot undo the
 * animated colour. Reduced motion is handled explicitly at the foot AND
 * by the global rule in globals.css that flattens every animation, and
 * in both cases the element falls back to its base rule below, which is
 * exactly the 0% keyframe. */
const SHOWCASE_CSS = `
.pc-qs {
  /* QUANTY'S OWN ACCENT, scoped to this element and nothing else, and
     declared here rather than inherited so the component is correct
     wherever it is mounted. #9d9de6 is quanty.ai's own --accent-lift,
     the step it publishes for text on a dark ground; it measures 7.59:1
     on carbon. The raw brand #5b5bd6 is only 3.53:1 there, which is why
     the label uses the lift and not the accent. See the fuller note in
     quanty/page.tsx. Never promote this to :root. */
  --q-accent: #5b5bd6;
  --q-accent-lift: #9d9de6;
}

.pc-qs-frame,
.pc-qs-cap,
.pc-qs-label,
.pc-qs-tick {
  animation-duration: 16s;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}
.pc-qs[data-playing="true"] .pc-qs-frame,
.pc-qs[data-playing="true"] .pc-qs-cap,
.pc-qs[data-playing="true"] .pc-qs-label,
.pc-qs[data-playing="true"] .pc-qs-tick {
  animation-play-state: running;
}

/* --- the two frames. Base state = state A, opaque, untransformed. --- */
.pc-qs-frame {
  position: absolute;
  inset: 0;
  animation-name: pc-qs-fade-a, pc-qs-settle-a;
  animation-timing-function: linear, var(--ease-out-cubic);
}
.pc-qs-frame-b {
  opacity: 0;
  animation-name: pc-qs-fade-b, pc-qs-settle-b;
}

@keyframes pc-qs-fade-a {
  0%, 45% { opacity: 1; }
  50%, 92% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes pc-qs-fade-b {
  0%, 45% { opacity: 0; }
  50%, 92% { opacity: 1; }
  100% { opacity: 0; }
}
/* The settle runs only while the frame is fading in, so the frame at rest
   is always the exact capture and never a 1.02 crop of it. */
@keyframes pc-qs-settle-a {
  0%, 92% { transform: none; }
  92.5% { transform: scale(1.02); }
  100% { transform: none; }
}
@keyframes pc-qs-settle-b {
  0%, 40% { transform: scale(1.02); }
  50%, 100% { transform: none; }
}

/* --- the caption pair, stacked in one grid cell --- */
.pc-qs-cap {
  animation-name: pc-qs-cap-a;
  animation-timing-function: linear;
}
.pc-qs-cap-b {
  opacity: 0;
  animation-name: pc-qs-cap-b;
}
@keyframes pc-qs-cap-a {
  0%, 42% { opacity: 1; }
  46%, 95% { opacity: 0; }
  99%, 100% { opacity: 1; }
}
@keyframes pc-qs-cap-b {
  0%, 46% { opacity: 0; }
  50%, 90% { opacity: 1; }
  95%, 100% { opacity: 0; }
}

/* --- the state labels. The live one is the Quanty accent, the other is
       the band's own muted green. Measured on carbon #0e1111:
       #9d9de6 is 7.59:1 and #91a6a4 is 7.40:1, so both clear 4.5:1 at
       14px and the accent is not carrying the meaning on its own, the
       swap of the caption underneath is. --- */
.pc-qs-label {
  color: var(--q-accent-lift);
  animation-name: pc-qs-label-a;
  animation-timing-function: linear;
}
.pc-qs-label-b {
  color: var(--color-sage);
  animation-name: pc-qs-label-b;
}
@keyframes pc-qs-label-a {
  0%, 45% { color: var(--q-accent-lift); }
  50%, 92% { color: var(--color-sage); }
  100% { color: var(--q-accent-lift); }
}
@keyframes pc-qs-label-b {
  0%, 45% { color: var(--color-sage); }
  50%, 92% { color: var(--q-accent-lift); }
  100% { color: var(--color-sage); }
}

/* --- the tick. A 2px rule in the raw Quanty brand colour, lit over
       whichever label is live, riding the frames' own fade keyframes so
       the ruler and the picture can never disagree. #5b5bd6 on carbon is
       3.53:1, which clears the 3:1 a graphic needs; it is deliberately
       not text, because as text the same colour would fail. It is also
       redundant: the label above it changes colour and the caption below
       it changes words, so nobody has to see this line to follow the
       band. --- */
.pc-qs-tick {
  background: var(--q-accent);
  animation-name: pc-qs-fade-a;
  animation-timing-function: linear;
}
.pc-qs-tick-b {
  opacity: 0;
  animation-name: pc-qs-fade-b;
}

@media (prefers-reduced-motion: reduce) {
  .pc-qs-frame,
  .pc-qs-cap,
  .pc-qs-label,
  .pc-qs-tick {
    animation-name: none;
  }
}
`;

export type ShowcaseFrame = {
  key: string;
  label: string;
  caption: string;
  alt: string;
};

export default function QuantyShowcase({
  frames,
}: {
  frames: readonly ShowcaseFrame[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The callback is asynchronous, so this never sets state during the
    // effect itself. `rootMargin` starts the cycle just before the band
    // arrives so the first cross-dissolve is not half over on entry.
    const observer = new IntersectionObserver(
      (entries) => setPlaying(entries[0]?.isIntersecting ?? false),
      { rootMargin: "10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-playing={playing ? "true" : "false"}
      className="pc-qs col-span-4 mt-14 md:col-span-12 md:mt-20"
    >
      {/* The child is a static module constant, never dictionary or CMS
          content, so nothing user supplied can reach a stylesheet. */}
      <style>{SHOWCASE_CSS}</style>

      <figure>
        {/* The hairline is load-bearing exactly as it is on the home page:
            the capture's own ground is near black and the band is carbon,
            so without a border there is no edge to say where the product
            window ends and the page begins. */}
        <div
          className="relative overflow-hidden border border-rule-dark"
          style={{ aspectRatio: FRAME_ASPECT }}
        >
          {frames.map((frame, i) => (
            <div
              key={frame.key}
              className={`pc-qs-frame${i === 1 ? " pc-qs-frame-b" : ""}`}
            >
              <Image
                src={CAPTURES[i]}
                alt={frame.alt}
                fill
                sizes={FRAME_SIZES}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <figcaption className="mt-7">
          {/* Two state labels, each over its own hairline, so the band
              says how many states there are before either one changes.
              They are read out, not decoration, so they are not hidden. */}
          <div className="flex gap-10">
            {frames.map((frame, i) => (
              <div key={frame.key} className="min-w-0">
                <span
                  aria-hidden="true"
                  className="relative block h-0.5 w-16 bg-rule-dark"
                >
                  <span
                    className={`absolute inset-0 block pc-qs-tick${
                      i === 1 ? " pc-qs-tick-b" : ""
                    }`}
                  />
                </span>
                <span
                  className={`mt-3 block text-[0.875rem] pc-qs-label${
                    i === 1 ? " pc-qs-label-b" : ""
                  }`}
                >
                  {frame.label}
                </span>
              </div>
            ))}
          </div>

          {/* Both captions occupy the same grid cell, so the block is as
              tall as the longer of the two in every language and nothing
              below it moves when they swap. */}
          <div className="mt-5 grid">
            {frames.map((frame, i) => (
              <p
                key={frame.key}
                className={`col-start-1 row-start-1 max-w-[56ch] text-[1.125rem] leading-[1.375] text-mist pc-qs-cap${
                  i === 1 ? " pc-qs-cap-b" : ""
                }`}
              >
                {frame.caption}
              </p>
            ))}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
