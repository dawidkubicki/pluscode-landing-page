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
 *  NO LOGOS. public/assets/portfolio holds marks for some of these
 *  clients and not others, and a logo row with an empty cell reads as a
 *  broken image rather than as a shorter list. The reference sets its
 *  customer row in the page's own type for the same reason, so the names
 *  are typed at heading-md and the logo files stay unused here.
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
 *  same failure the note above gives as the reason there are no logos.
 *  So the cell is 12 divided by the count, for the counts that divide
 *  the grid, and a third for anything else, which keeps a list of five
 *  as a tidy 3 + 2 rather than as four slivers and an orphan.
 *
 *  THE ITEMS COME FROM THE CMS WHEN THERE ARE ANY. `items` is whatever
 *  lib/home-bands.ts read out of the `clients` collection, and it is null
 *  whenever that collection is empty, unflagged or unreachable, which is
 *  every build with no database. The dictionary is the fallback and stays
 *  the shape of record: both sides are the same three fields, so nothing
 *  below this line knows which one it is rendering.
 * ------------------------------------------------------------------ */
export default function Clients({
  dict,
  items: cmsItems,
}: {
  dict: Dictionary["home"]["clients"];
  items?: ClientsItems | null;
}) {
  const items = cmsItems && cmsItems.length > 0 ? cmsItems : dict.items;

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
