import Image from "next/image";

import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  PLATFORM. Quanty, presented as our own product.
 *
 *  This is the only dark plate between the hero and the map, so the band
 *  carries `on-dark` as well as `bg-ink`: that class is what switches the
 *  global focus ring from ink to white, and without it the ring on the
 *  call to action would be invisible against this ground.
 *
 *  THE COPY AND THE MARK ARE QUANTY'S OWN. Both are taken from
 *  quanty.ai in all three languages, rather than written fresh here, so
 *  the two sites describe the product with the same words. If quanty.ai
 *  changes its tagline, this band should follow it, not diverge from it.
 *  The wordmark is the real `quanty-light.svg` from that site, the cut
 *  drawn for a dark ground, which is why the band shows it rather than
 *  setting "Quanty" in the page's own face like every other heading.
 *
 *  THE SCREENSHOT IS A REAL CAPTURE OF THE PRODUCT, not a mock-up. The
 *  repo has a rule against synthetic app windows, and a genuine screenshot
 *  of our own product is the one exception to it: `sheet-2x.webp` is the
 *  Quanty sheet as it renders at quanty.ai, invoices read into rows with
 *  the source popover open beside a value, captured at 2240x1282. It is
 *  never edited, retouched or composited. When the product UI changes the
 *  file is captured again from quanty.ai and replaced, so the band always
 *  shows what a user would actually see. Its ground is near black and the
 *  band is ink, so a 1px rule-dark hairline draws the edge of the window;
 *  there is no browser chrome and no shadow, by the same rule as every
 *  other image on the page.
 *
 *  IT IS NOT FULL WIDTH ANY MORE. The capture used to span all twelve
 *  columns under the header, which made a 2240px screenshot the largest
 *  object on the home page and left the band reading as a poster for
 *  someone else's app. It now sits in the six right-hand columns, opposite
 *  the header text, so the header and the product are one two-up
 *  composition and the capture is roughly a quarter of the area it was.
 *
 *  At six columns the whole 2240x1282 window would render its table text
 *  around 8px, so the band shows a DERIVED CROP instead:
 *  `sheet-table-2x.webp` is `sheet-2x.webp` cut to the table panel alone
 *  (sharp `extract`, left 444, top 118, 1772x908), which drops the left
 *  navigation rail and the window's title bar and keeps the toolbar, the
 *  column headers, all ten rows, the totals line and the open source
 *  popover. Nothing is scaled, recoloured, retouched or composited: it is
 *  the same pixels, in a tighter frame, and every row of content that was
 *  visible in the wide shot is still whole. Re-derive it from the new
 *  capture whenever `sheet-2x.webp` is replaced. The whole window still
 *  appears, at a size where it can be read, on /quanty.
 *
 *  THE BUTTON GOES TO OUR OWN PAGE. "See Quanty" is a LocaleLink to
 *  /quanty, the platform page on this site, not an anchor to quanty.ai:
 *  a reader who wants to know what the product is should be told that by
 *  us, in their own language, without leaving pluscode.io. The product
 *  itself does live on another host, so the domain sits beside the button
 *  as a small external link. Both are needed; neither replaces the other.
 *
 *  The note line is a disclosure, not decoration. Quanty is built by
 *  Pluscode, it is not a partner platform and not a certification, so the
 *  note renders at full label contrast in the flow of the band rather
 *  than tucked into a corner. Never drop it and never soften it into
 *  partner language.
 *
 *  Everything sits on the one 12 column grid, so the four feature boxes
 *  and the industry hairlines line up with the columns of every other
 *  band on the page.
 *
 *  THE FOUR FEATURES ARE BOXES, and the box is the one place on the page
 *  where the hover is a gradient. At rest each is a 1px hairline in the
 *  band's own rule colour, square, unfilled, so it reads as four ruled
 *  cells and not as four cards. On hover the hairline becomes a 135deg
 *  sweep from ember into sage and the feature name goes ember with it;
 *  nothing moves, nothing lifts, nothing fills. Ember is a hover colour by
 *  rule, so neither the border nor the name may ever be ember at rest.
 *
 *  The industries row at the foot is the shortest honest answer to "would
 *  this work for us": six named trades, one line each, straight from the
 *  product's own navigation. It is a list of facts, so the cells are not
 *  links and have no hover.
 * ------------------------------------------------------------------ */

/* THE GRADIENT BORDER, as a scoped stylesheet rather than utilities.
 *
 *  A `border-color` cannot be a gradient, so the box paints two backgrounds
 *  instead: ink clipped to the padding box on top, the gradient clipped to
 *  the border box underneath, and a 1px transparent border between them is
 *  the ring through which the gradient shows. Two things stop this being
 *  written as Tailwind classes:
 *
 *    - An inline `style` for the rest state beats every class, so a
 *      `hover:[background:...]` utility could never override it.
 *    - Browsers do not interpolate between two gradients, so a transition
 *      on `background` would snap from hairline to sweep with no fade.
 *
 *  So the two colour stops are registered custom properties (`@property`,
 *  typed `<color>`) and the transition runs on THOSE. The gradient itself
 *  never changes shape; only its two colours move, and a registered colour
 *  interpolates like any other. A browser without `@property` still gets
 *  the border and the hover, it just arrives without the 240ms fade.
 *
 *  Unlayered on purpose, like the flatteners at the foot of globals.css:
 *  it beats the utilities layer so no stray `bg-*` on the box can undo the
 *  padding-box layer. The hover is gated on `(hover: hover)` exactly as
 *  Tailwind gates its own `hover:` variant, so a tap on a phone does not
 *  leave one box stuck in ember. Reduced motion is handled by the global
 *  rule that shortens every transition. */
const ITEM_CSS = `
@property --pc-platform-item-a {
  syntax: "<color>";
  inherits: false;
  initial-value: transparent;
}
@property --pc-platform-item-b {
  syntax: "<color>";
  inherits: false;
  initial-value: transparent;
}
.pc-platform-item {
  --pc-platform-item-a: var(--color-rule-dark);
  --pc-platform-item-b: var(--color-rule-dark);
  background:
    linear-gradient(var(--color-ink), var(--color-ink)) padding-box,
    linear-gradient(
        135deg,
        var(--pc-platform-item-a),
        var(--pc-platform-item-b)
      )
      border-box;
  transition:
    --pc-platform-item-a 240ms var(--ease-io-attio),
    --pc-platform-item-b 240ms var(--ease-io-attio);
}
@media (hover: hover) {
  .pc-platform-item:hover {
    --pc-platform-item-a: var(--color-ember);
    --pc-platform-item-b: var(--color-sage);
  }
}
`;

export default function Platform({
  dict,
}: {
  dict: Dictionary["home"]["platform"];
}) {
  return (
    <section className="on-dark bg-ink py-20 md:py-[104px]">
      {/* A <style> element renders nothing and takes no grid cell, so it
          can sit here inside the band that uses it. The child is a static
          module constant, never content from the dictionary or the CMS. */}
      <style>{ITEM_CSS}</style>
      <div className="pc-shell">
        <div className="pc-grid">
          {/* The header, five of twelve columns. It used to be split across
              the row (title left, sentence and button right) with the
              screenshot underneath. The capture now takes the right half,
              so the whole written argument stacks in one column: label,
              wordmark, tagline, sentence, the two ways to go. */}
          <div className="col-span-4 md:col-span-5">
            <p className="text-[0.875rem] text-sage">{dict.eyebrow}</p>

            {/* The product's own wordmark, not type. The explicit intrinsic
                size keeps the SVG from being laid out at its native 758x174
                before styles land. The heading is still an h2 for the
                document outline; the visible text lives in the alt, so a
                screen reader reads "Quanty" here exactly as it would have
                read the word.

                `unoptimized` is required, not a preference. Next routes
                every next/image src through /_next/image, and that endpoint
                REFUSES svg unless `images.dangerouslyAllowSVG` is set in
                next.config. Turning that flag on would let any future svg on
                the site be served with its scripts intact, which is a real
                XSS surface, and it would be switched on here for the sake of
                one 3KB vector that has nothing to optimise. `unoptimized`
                skips the endpoint and serves the file straight from /public,
                which is what a wordmark wants anyway. */}
            <h2 className="mt-5">
              <Image
                src="/assets/quanty/quanty-light.svg"
                alt={dict.logoAlt}
                width={758}
                height={174}
                unoptimized
                className="h-9 w-auto md:h-11"
              />
            </h2>

            <p className="mt-6 text-heading-md text-white">{dict.tagline}</p>

            <p className="mt-6 text-[1.125rem] leading-[1.375] text-mist">
              {dict.intro}
            </p>

            {/* TWO WAYS TO GO, and they go to different places.
                The button is now an internal LocaleLink to /quanty, our own
                platform page, so "See Quanty" keeps the reader on
                pluscode.io and inside their locale. The product itself
                still lives on a separate host, so the domain sits beside
                the button as a plain external anchor. Its label is the bare
                domain in every language: it needs no translation, it says
                where it goes, and a reader can tell the two apart without
                reading either one twice. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <LocaleLink href="/quanty" className="btn btn-invert">
                {dict.cta}
              </LocaleLink>
              {/* The colour sits on the anchor and `pc-link` on the span
                  inside it: `.pc-link` sets `color: inherit` and is declared
                  after Tailwind's own utilities in the same layer, so a
                  `text-sage` on the same element would lose to it. The arrow
                  is decoration and is hidden from the accessible name, which
                  is then exactly "quanty.ai". */}
              <a
                href="https://quanty.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[1rem] text-sage"
              >
                <span className="pc-link">quanty.ai</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </div>

          {/* The product itself, opposite the header rather than under it.
              Six of twelve columns above 768px, the full four below, and it
              is a crop of the real capture (see the note at the top of the
              file) so the table is still legible at half the width.

              The hairline is load-bearing: the capture's own ground is near
              black on an ink band, and without the border there would be no
              edge to say where the window ends.

              `sizes` is measured off this grid, not guessed. The shell is
              full bleed with 24px of padding and a 24px gutter, so six of
              twelve columns is `50vw - 36px`; below 768px the figure spans
              the content width, which is `100vw - 48px` and `100vw - 32px`
              under 640px where the shell's padding drops to 16.

              No `unoptimized` here; that exception is for the SVG wordmark
              only, and this is a raster that /_next/image serves resized. */}
          <figure className="col-span-4 mt-10 md:col-span-6 md:col-start-7 md:mt-0">
            <div className="relative aspect-[1772/908] overflow-hidden border border-rule-dark">
              <Image
                src="/assets/quanty/sheet-table-2x.webp"
                alt={dict.shotAlt}
                fill
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 48px), calc(50vw - 36px)"
                className="object-cover"
              />
            </div>
          </figure>

          {/* The four boxes. `border border-transparent` is load-bearing:
              it is the 1px ring the gradient in ITEM_CSS shows through, and
              the box has no other border. `group` lets the name answer the
              same hover as the ring, on the same 240ms curve, so the two
              read as one movement rather than a border and then a title.
              The top margin measures from the header row, which is now the
              header and the screenshot side by side, so the rhythm is one
              two-up plate, then the four boxes, then the trades. */}
          {dict.items.map((item) => (
            <div
              key={item.key}
              className="pc-platform-item group col-span-4 mt-16 border border-transparent p-7 md:col-span-3 md:mt-24"
            >
              <h3 className="text-heading-sm text-white transition-colors duration-[240ms] ease-[var(--ease-io-attio)] group-hover:text-ember">
                {item.name}
              </h3>
              <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
                {item.body}
              </p>
            </div>
          ))}

          {/* The six trades. Two columns on a phone, three on a tablet, six
              across on the page, so the row never becomes a long thin list
              on one side of the grid. */}
          <p className="col-span-4 mt-20 text-[0.875rem] text-sage md:col-span-12">
            {dict.forLabel}
          </p>
          {dict.industries.map((industry) => (
            <div
              key={industry.key}
              className="col-span-2 mt-6 border-t border-rule-dark pt-5 md:col-span-2"
            >
              <p className="text-[1.125rem] leading-[1.375] text-white">
                {industry.name}
              </p>
              <p className="mt-1 text-[1rem] leading-[1.375] text-sage">
                {industry.body}
              </p>
            </div>
          ))}

          <p className="col-span-4 mt-20 text-[0.875rem] text-sage md:col-span-12">
            {dict.note}
          </p>
        </div>
      </div>
    </section>
  );
}
