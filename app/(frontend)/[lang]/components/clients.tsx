import type { ClientsItems } from "@/lib/home-bands";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  SELECTED CLIENTS
 *
 *  The quietest band on the page: a title, then three names with one
 *  line each saying what the work was. No cards, no links, no hover.
 *  These are facts on the sheet, so the only structure is the hairline
 *  above each name and the change of colour between name and note.
 *
 *  NO LOGOS. public/assets/portfolio holds marks for two of the three
 *  clients, and a logo row with one empty cell reads as a broken image
 *  rather than as a shorter list. The reference sets its customer row in
 *  the page's own type for the same reason, so the names are typed at
 *  heading-md and the logo files stay unused here.
 *
 *  The three cells live in a nested pc-grid inside a full width cell.
 *  That keeps a single `mt-16` under the title instead of one per cell,
 *  and because the wrapper spans all 12 columns the inner grid resolves
 *  to the same column positions as the outer one, so the names still
 *  land on the page's column lines.
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
                On desktop the three sit in one row, so it does nothing. */}
            <div className="pc-grid gap-y-10">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="col-span-4 border-t border-rule"
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
