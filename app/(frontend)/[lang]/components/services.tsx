import LocaleLink from "./locale-link";
import { SERVICE_ICONS } from "./band-icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  SERVICES. The five engagements, as a ruled list of five links.
 *
 *  A GLYPH BESIDE EACH TITLE. Five rows of text that differ only in their
 *  words do not scan; the number tells you where you are in the list, not
 *  what the row is. Every row therefore opens with a single-colour glyph
 *  for the engagement (sheets, a bubble, brackets, a growing block, bars),
 *  so the list can be told apart before it is read. They are solid ink
 *  slabs rather than line icons because ink is the only decoration this
 *  system allows: no accent, no radius, no second weight. Looked up by the
 *  item's key, and the slot keeps its 40px whether or not the key resolves,
 *  so a row without a glyph still starts its title on the same line and the
 *  same x as the other four.
 *
 *  ON THE TITLE'S LINE, NOT UNDER THE NUMBER. The glyph used to hang below
 *  the number in the first column, which made it read as a second, quieter
 *  list running down the left margin and left the title with nothing beside
 *  it. Asked for on 2026-09-08: the object belongs next to the thing it
 *  names, and all five have to sit on one x.
 *
 *  THE NUMBER KEEPS ITS OWN COLUMN, for exactly that reason. Putting it on
 *  the title's line would have made the glyph's x depend on the width of
 *  the numerals in front of it, and one shared x was the whole of the
 *  request; column 1 is a grid line, so it holds whatever the row says. It
 *  also keeps the number what it is, a position in a list read down the
 *  left margin, rather than a prefix to the title.
 *
 *  CENTRED ON THE CAP BAND, NOT HUNG FROM THE LINE BOX. The slot is exactly
 *  one line box tall (`--text-heading-md`, which is set at leading 1) and
 *  centres the glyph in it. Inter's ascender minus its descender is its cap
 *  height, so the middle of a line box set at leading 1 lands on the middle
 *  of the capitals: centring on the line box centres on the word. The glyph
 *  is 40px here rather than the 56px it takes in Offerings, where it opens a
 *  cell of its own and can be a slab. Beside a 35px headline 40px puts about
 *  28px of ink against a 25px cap, which reads as one object with the words
 *  instead of floating over them. The gap is 16px because the glyph already
 *  carries 15% of clear space inside its own viewBox.
 *
 *  A LIST, NOT CARDS. This is the densest band on the page: five items,
 *  each carrying a number, a headline and a sentence. Five cards in a
 *  row would leave every column too narrow to read and five cards in a
 *  grid would push the band past a screen and a half, so the items are
 *  set as a table of contents instead. The hairline above each row is
 *  the only structure, which is the same device Clients and Platform
 *  use, and it means the band stays quiet next to the case spread that
 *  follows it.
 *
 *  EACH ROW RE-ENTERS THE GRID. A row spans all 12 columns, so a nested
 *  `pc-grid` inside it resolves to exactly the same column lines as the
 *  outer one. That is what puts the number, the title and the body on
 *  page columns rather than on a flex split of the row. The split is
 *  1 + 5 + 6: the number takes the first column, the glyph and the
 *  headline the next five, and the sentence the right half of the page,
 *  so every body starts on column 7, which is the same line the band
 *  header's intro and button hang from. Below 768px the grid is four
 *  columns and every cell claims all four, so the row stacks: the number
 *  on its own line, then the glyph and the title together on one line,
 *  then the sentence under them. The glyph and the title are a flex pair
 *  inside one cell rather than two cells precisely so that stacking can
 *  never break them apart.
 *
 *  An earlier draft carried a fourth column of tags on the right. It
 *  was cut in review: three columns of text on one row was already the
 *  most the eye would take, and the tags repeated what the sentence
 *  said. The dictionary no longer has the field.
 *
 *  EVERY ROW IS A LINK. This reverses the decision that used to be
 *  recorded here, that the rows were descriptions and not destinations and
 *  that the band's one action was the button in its header. There are real
 *  pages behind all five of them now (`/solutions/*` and `/services/*`), so
 *  a reader who wants the detail should not have to go back up to the
 *  button and hunt. The path comes from the dictionary rather than from a
 *  table in this file, because a path is content: it travels with the copy
 *  and it is the same in all three locales.
 *
 *  QUIET AT REST. The whole row is the target, and at rest it looks exactly
 *  as it did as static text: no colour, no rule, no arrow. On hover the
 *  title takes the same `pc-link` ember underline the editorial cards use,
 *  and the label under the sentence fades up in place. The label is always
 *  in the layout at opacity 0, so nothing moves when it arrives, and it is
 *  14px ink rather than ember, because on a touch screen it is visible at
 *  rest and ember is never a resting colour. As on the cards, the underline
 *  sits on an inline span and never on the block heading: `pc-link` paints
 *  a background the full width of its own box, and on an h3 that fills the
 *  column the rule would run on past the last word.
 *
 *  TOUCH GETS THE LABEL, NOT THE HOVER. Tailwind's hover variants already
 *  live inside `@media (hover: hover)`, so a tap cannot leave a row wearing
 *  the underline after the finger has gone. That alone would leave a phone
 *  with no affordance at all, so `(hover: none)` pins the label to full
 *  opacity instead: sentence, then Learn more, on every row, with the whole
 *  row as one tap target. A keyboard gets both halves back through
 *  `group-focus-visible`, on top of the global focus ring.
 *
 *  Server component: no state, no effects, hover and focus are CSS.
 * ------------------------------------------------------------------ */

export default function Services({
  dict,
}: {
  dict: Dictionary["home"]["services"];
}) {
  return (
    <section className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end">
            <p className="text-[1.125rem] leading-[1.375] text-moss">
              {dict.intro}
            </p>
            <LocaleLink href="/services" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>

        <div className="pc-grid mt-16 md:mt-24">
          {dict.items.map((item) => {
            const Icon = SERVICE_ICONS[item.key];
            return (
              <LocaleLink
                key={item.key}
                href={item.href}
                className="group col-span-4 block border-t border-rule py-8 md:col-span-12"
              >
                <div className="pc-grid">
                  {/* The number alone in column 1. See the note above on why
                      it did not move up beside the title. */}
                  <p className="col-span-4 text-[0.875rem] text-moss md:col-span-1">
                    {item.num}
                  </p>

                  {/* Glyph and title, one line. The slot is a fixed 40px wide
                      so the five titles start on one x, and exactly one title
                      line box tall so the glyph centres on the capitals. */}
                  <div className="col-span-4 flex items-start gap-4 md:col-span-5">
                    <span className="flex h-[var(--text-heading-md)] w-10 shrink-0 items-center">
                      {Icon && <Icon className="size-10 text-ink" />}
                    </span>
                    <h3 className="text-heading-md text-ink">
                      <span className="pc-link group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
                        {item.title}
                      </span>
                    </h3>
                  </div>

                  <div className="col-span-4 md:col-span-6">
                    <p className="text-[1.125rem] leading-[1.375] text-moss">
                      {item.body}
                    </p>
                    {/* Reserved, not inserted: the label holds its place at
                        opacity 0 so the row is the same height hovered and
                        not, and it stays visible where there is no pointer. */}
                    <p className="mt-4 text-[0.875rem] text-ink opacity-0 transition-opacity duration-[260ms] ease-[var(--ease-io-attio)] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                      {dict.readMore}
                    </p>
                  </div>
                </div>
              </LocaleLink>
            );
          })}

          {/* The closing hairline. Every rule in this list belongs to the
              row below it, so without this the list would be open at the
              bottom and the last row would bleed into the band padding.
              It is a rule, not content, so it is hidden from the tree. */}
          <div
            aria-hidden="true"
            className="col-span-4 border-t border-rule md:col-span-12"
          />
        </div>
      </div>
    </section>
  );
}
