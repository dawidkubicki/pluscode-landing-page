import type { ClientsItems } from "@/lib/home-bands";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  SELECTED CLIENTS
 *
 *  The quietest band on the page: a title, then the names with one line
 *  each saying what the work was. No cards, no links, no hover. These
 *  are facts on the sheet, so the only structure is the hairline above
 *  each name and the change of colour between name and note.
 *
 *  LOGOS, BUT ONLY WHEN EVERY CLIENT HAS ONE. A mark above the name is
 *  the one thing this band shows that is not type, and a row where some
 *  cells carry one and others do not reads as a broken image rather than
 *  as a shorter list. So the row is all or nothing: `showLogos` below is
 *  true only when every item has a mark, and the moment a client without
 *  one is added the whole band drops back to names in type. That is the
 *  safe direction to fail, because names always exist.
 *
 *  THE MARKS ARE INK, NOT BRAND COLOUR. `brightness(0)` collapses each
 *  logo to a flat ink silhouette against the paper ground, which is what
 *  keeps two saturated freight-company palettes from fighting the muted
 *  page. Alpha survives the filter, so the anti-aliased edges stay clean.
 *  The files themselves keep their real colours: lib/case-studies.ts
 *  serves the same directory onto dark gradient cards, and an asset that
 *  had ink baked in would be unusable there.
 *
 *  ONE HEIGHT MEANS ONE ARTWORK SIZE. Both files carry the same share of
 *  vertical clearspace (artwork fills ~0.757 of the canvas, the ratio
 *  BTC's own SVG ships with), so one `h-14` renders both marks at the
 *  same optical weight without the component knowing anything about
 *  either, and a third logo needs no code here. Pad a new file to that
 *  same ratio before it lands in public/, or it will arrive in the row
 *  visibly larger or smaller than the marks beside it.
 *
 *  The name stays under the mark in full. A wordmark and a heading saying
 *  the same thing is mild redundancy, and it is worth it: it is what the
 *  band still reads as when an image fails, and it is the only part a
 *  screen reader and the page's own type have in common.
 *
 *  The cells live in a nested pc-grid inside a full width cell. That
 *  keeps a single `mt-16` under the title instead of one per cell, and
 *  because the wrapper spans all 12 columns the inner grid resolves to
 *  the same column positions as the outer one, so the names still land
 *  on the page's column lines.
 *
 *  THE ROW DIVIDES BY HOW MANY THERE ARE. The span used to be a fixed
 *  third, which was right only while there were exactly three. The list
 *  is editable in the CMS now and it lost a name today, and two thirds
 *  of a row leaves the last third bare: the two hairlines stop at column
 *  8 and the gap reads as a client that failed to load, which is the
 *  same failure the logo note above guards against.
 *  So the cell is 12 divided by the count, for the counts that divide
 *  the grid, and a third for anything else, which keeps a list of five
 *  as a tidy 3 + 2 rather than as four slivers and an orphan.
 *
 *  THE ITEMS COME FROM THE CMS WHEN THERE ARE ANY. `items` is whatever
 *  lib/home-bands.ts read out of the `clients` collection, and it is null
 *  whenever that collection is empty, unflagged or unreachable, which is
 *  every build with no database. The dictionary is the fallback and stays
 *  the shape of record: both sides are the same four fields, and both
 *  spell an absent mark "" rather than null, so nothing below this line
 *  knows which one it is rendering.
 * ------------------------------------------------------------------ */
export default function Clients({
  dict,
  items: cmsItems,
}: {
  dict: Dictionary["home"]["clients"];
  items?: ClientsItems | null;
}) {
  const items = cmsItems && cmsItems.length > 0 ? cmsItems : dict.items;

  /* All or nothing, per the note above. An absent mark is "" on both
     sides, dictionary and CMS alike, so one client without one empties
     the whole row of marks. */
  const showLogos = items.every((item) => !!item.logo);

  /* Written out rather than computed, because Tailwind scans source text
     for class names: `md:col-span-${12 / n}` is invisible to it and would
     ship as no class at all. */
  const SPAN: Record<number, string> = {
    1: "md:col-span-12",
    2: "md:col-span-6",
    3: "md:col-span-4",
    4: "md:col-span-3",
    6: "md:col-span-2",
  };
  const span = SPAN[items.length] ?? "md:col-span-4";

  return (
    <section className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-12">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>

          <div className="col-span-4 md:col-span-12 mt-16">
            {/* gap-y opens up the stacked mobile case, where the 16px
                gutter would crowd each note against the next hairline.
                On desktop they sit in one row, so it does nothing. */}
            <div className="pc-grid gap-y-10">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`col-span-4 border-t border-rule ${span}`}
                >
                  <div className="pt-8">
                    {showLogos && (
                      /* object-left keeps the mark on the cell's own column
                         line, so the logos line up with the names under
                         them rather than centring inside a wide cell. */
                      <img
                        src={item.logo}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="mb-6 h-10 w-auto max-w-full object-contain object-left md:h-14"
                        style={{ filter: "brightness(0)" }}
                      />
                    )}
                    <h3 className="text-heading-md text-ink">{item.name}</h3>
                    <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                      {item.what}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
