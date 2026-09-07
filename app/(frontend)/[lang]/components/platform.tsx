import Image from "next/image";

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
 *  The note line is a disclosure, not decoration. Quanty is built by
 *  Pluscode, it is not a partner platform and not a certification, so the
 *  note renders at full label contrast in the flow of the band rather
 *  than tucked into a corner. Never drop it and never soften it into
 *  partner language.
 *
 *  Everything sits on the one 12 column grid, so the item hairlines line
 *  up with the columns of every other band on the page.
 *
 *  The industries row at the foot is the shortest honest answer to "would
 *  this work for us": six named trades, one line each, straight from the
 *  product's own navigation. It is a list of facts, so the cells are not
 *  links and have no hover.
 * ------------------------------------------------------------------ */

export default function Platform({
  dict,
}: {
  dict: Dictionary["home"]["platform"];
}) {
  return (
    <section className="on-dark bg-ink py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
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
          </div>

          <div className="col-span-4 mt-10 md:col-span-5 md:col-start-8 md:mt-0">
            <p className="text-[1.125rem] leading-[1.375] text-mist">
              {dict.intro}
            </p>
            {/* quanty.ai is a separate host, so this is a plain anchor and
                never LocaleLink: there is no /pl of it to stay inside. */}
            <a
              href="https://quanty.ai"
              target="_blank"
              rel="noreferrer"
              className="btn btn-invert mt-8"
            >
              {dict.cta}
            </a>
          </div>

          {dict.items.map((item) => (
            <div
              key={item.key}
              className="col-span-4 mt-16 border-t border-rule-dark pt-8 md:col-span-3 md:mt-24"
            >
              <h3 className="text-heading-sm text-white">{item.name}</h3>
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
