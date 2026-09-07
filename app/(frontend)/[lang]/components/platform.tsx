import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  PLATFORM. Quanty, presented as our own product.
 *
 *  This is the only dark plate between the hero and the map, so the band
 *  carries `on-dark` as well as `bg-ink`: that class is what switches the
 *  global focus ring from ink to white, and without it the ring on the
 *  call to action would be invisible against this ground.
 *
 *  The note line is a disclosure, not decoration. Quanty is built by
 *  Pluscode, it is not a partner platform and not a certification, so the
 *  note renders at full label contrast in the flow of the band rather
 *  than tucked into a corner. Never drop it and never soften it into
 *  partner language.
 *
 *  Everything sits on the one 12 column grid: the header pair, the four
 *  item cells and the note are all direct children of a single `pc-grid`,
 *  so the item hairlines line up with the columns of every other band.
 *  The items carry the band's own top margin per cell, which is what puts
 *  one gap under the header on desktop and an even rhythm between them
 *  once they stack into a column below 768px.
 *
 *  The reference marks each item with a small glyph. We have no icon set,
 *  and four invented glyphs would read as arbitrary, so the four labels
 *  do that work alone.
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
            <h2 className="mt-4 text-heading-xl text-white">{dict.title}</h2>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
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
              {/* The `explore` label used to print here, above every one of
                  the four names. It is a call to action ("Explore" / "Zobacz"
                  / "Ansehen") on a cell that is not a link, so it offered an
                  action that does not exist and did it four times. The four
                  names carry the band on their own, and the one real action
                  is the Quanty button in the header above. */}
              <h3 className="text-heading-sm text-white">{item.name}</h3>
              <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
                {item.body}
              </p>
            </div>
          ))}

          <p className="col-span-4 mt-16 text-[0.875rem] text-sage md:col-span-12">
            {dict.note}
          </p>
        </div>
      </div>
    </section>
  );
}
