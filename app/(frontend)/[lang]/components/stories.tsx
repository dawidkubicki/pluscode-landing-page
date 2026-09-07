import Image from "next/image";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "./locale-link";

/* ------------------------------------------------------------------ *
 *  STORIES. The second half of the editorial middle of the page.
 *
 *  It keeps the `bg-paper` ground on purpose. Cases sits directly above
 *  on the same ground, so a reader scrolling out of one and into the
 *  other reads a single continuous column of work rather than two
 *  separate plates. The band header, the padding and the card anatomy
 *  are identical to Cases; only the stagger differs.
 *
 *  THE STAGGER IS MIRRORED against Cases: the tall card leads here and
 *  the offsets fall the other way, so the two bands share a rhythm
 *  without repeating the same silhouette twice in a row.
 *
 *  WHY THE CARDS SIT IN A NESTED `pc-grid`. The row needs one top margin
 *  (`mt-16 md:mt-24`) and each card needs its own stagger offset, and
 *  both are margin-top: putting them on the same element would leave two
 *  competing utilities on one class list. The wrapper carries the row
 *  margin, the cards carry the offsets. It spans the full 12 columns
 *  with the same gutter, so every card still lands on the page grid and
 *  lines up with the header above it.
 * ------------------------------------------------------------------ */

/** Per-card offset and image crop, desktop only. Below md every card is
 *  full width, 16/9 and flush: a stagger on four columns is just a gap.
 *
 *  WHY THERE IS NO RATIO HERE, unlike the Cases band above. Cases uses art
 *  rendered to order at whatever shape the card wants, so it can afford a
 *  3/4 portrait. These three are the insight covers, and each is a fixed
 *  1600x900 composition with its subject spread along the horizontal: the
 *  wordmark about 3 to 16 percent in from the left, the category bottom
 *  left, the motif right. ANY crop tighter than 16/9 cuts one of those off,
 *  and the first draft of this band cropped to 3/4 and 4/5 and produced two
 *  cards of empty ground. So every card holds 16/9 and the stagger comes
 *  entirely from the vertical offsets. If the covers are ever re-rendered
 *  per card shape, this is the one thing that changes with them.
 */
const CARD_LAYOUT = [
  { offset: "md:mt-32" },
  { offset: "" },
  { offset: "md:mt-16" },
] as const;

/** Every card, every breakpoint. See the note above: the covers are 16/9 and
 *  cannot be cropped without losing the wordmark or the category. */
const RATIO = "aspect-[16/9]";

export default function Stories({
  dict,
}: {
  dict: Dictionary["home"]["stories"];
}) {
  return (
    <section className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end">
            <p className="text-[1.125rem] text-moss">{dict.intro}</p>
            <LocaleLink href="/insights" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>

          <div className="pc-grid col-span-4 mt-16 md:col-span-12 md:mt-24">
            {dict.items.map((item, i) => {
              const layout = CARD_LAYOUT[i] ?? CARD_LAYOUT[1];

              return (
                <LocaleLink
                  key={item.key}
                  href={item.href}
                  className={`group col-span-4 block  ${layout.offset}`}
                >
                  <div
                    className={`relative w-full overflow-hidden bg-paper-dim ${RATIO}`}
                  >
                    <Image
                      src={item.image}
                      /* Empty on purpose. The link already has an
                         accessible name from the caption and the headline
                         beside it, and the cover is abstract art: reading
                         out a second, near identical title is noise to a
                         screen reader, not information. */
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-6 text-[1.125rem] text-moss">
                    {item.caption}
                  </p>
                  {/* The headline is what moves on hover: `pc-link` draws the
                      underline from 0% and the group-hover pair grows it to
                      full, so hovering anywhere on the card underlines it.
                      Guillemets arrive from the dictionary already set, and
                      they are rendered exactly as written. */}
                  <h3 className="mt-2 text-heading-md text-ink">
                    <span className="pc-link group-hover:bg-size-[100%_1px]">
                      {item.title}
                    </span>
                  </h3>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
