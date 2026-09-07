import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  SERVICES. The five engagements, as a ruled list.
 *
 *  A LIST, NOT CARDS. This is the densest band on the page: five items,
 *  each carrying a number, a headline, a sentence and a tag line. Five
 *  cards in a row would leave every column too narrow to read and five
 *  cards in a grid would push the band past a screen and a half, so the
 *  items are set as a table of contents instead. The hairline above each
 *  row is the only structure, which is the same device Clients and
 *  Platform use, and it means the band stays quiet next to the case
 *  spread that follows it.
 *
 *  EACH ROW RE-ENTERS THE GRID. A row spans all 12 columns, so a nested
 *  `pc-grid` inside it resolves to exactly the same column lines as the
 *  outer one. That is what puts the number, the title, the body and the
 *  tags on page columns rather than on a flex split of the row, and it
 *  is why the four parts here line up with the four cells of Offerings
 *  directly below. Below 768px the grid is four columns and every part
 *  claims all four, so the row stacks with the number above the title.
 *
 *  NO HOVER AND NO LINKS. These are descriptions, not destinations. The
 *  band has one action and it is the button in the header, so making the
 *  rows look clickable would offer five that do not exist.
 *
 *  Server component: no state, no effects.
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
          {dict.items.map((item) => (
            <div
              key={item.key}
              className="col-span-4 border-t border-rule py-8 md:col-span-12"
            >
              <div className="pc-grid">
                <p className="col-span-4 text-[0.875rem] text-moss md:col-span-1">
                  {item.num}
                </p>
                <h3 className="col-span-4 text-heading-md text-ink md:col-span-4">
                  {item.title}
                </h3>
                <p className="col-span-4 text-[1.125rem] leading-[1.375] text-moss md:col-span-4">
                  {item.body}
                </p>
                <p className="col-span-4 text-[1rem] leading-[1.375] text-moss md:col-span-3">
                  {item.tags}
                </p>
              </div>
            </div>
          ))}

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
