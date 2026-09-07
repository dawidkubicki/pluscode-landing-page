import Image from "next/image";

import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  PEOPLE. The band that introduces the two of us, as the same staggered
 *  editorial spread Cases uses, because the reference's People section
 *  is exactly that: three portraits at three heights, a caption, a
 *  quote, a name.
 *
 *  THREE CARDS FOR TWO PEOPLE. The third card is the two of them
 *  together. A two card row on a twelve column grid leaves a third of
 *  the page empty or forces each card to a half, and a half width
 *  portrait next to a half width portrait is a team page, not an
 *  editorial spread. The pair shot also carries the one line the other
 *  two cannot: that the reader talks to both of these people, and to
 *  nobody else.
 *
 *  THE STAGGER IS THE BAND. As in Cases, the offsets and the aspect
 *  ratios are fixed per position, not per person, and they only exist
 *  from md up: below 768px every card is full width at 4:5 with no
 *  offset, because a stagger on a single column stack is just uneven
 *  whitespace. All three source photographs are portrait orientation
 *  (the pair shot is 1350 by 1800), so neither the 3:4 nor the 4:5 crop
 *  loses a face. The portraits are already black and white; there is no
 *  filter here and there must not be one.
 *
 *  CAPTION ABOVE THE QUOTE. The same inversion Cases makes: the muted
 *  line comes first and the large line second, which is what makes the
 *  card read as editorial rather than as a tile with a subtitle. The
 *  order of the four elements is load bearing. Each card is a `figure`
 *  holding the portrait and the `blockquote`, and the `figcaption` is
 *  the attribution, so the name and the role are bound to the quote in
 *  the tree and not only on the screen. The guillemets live in the
 *  dictionary, so the quote renders exactly as written and never gets a
 *  second set of marks from CSS.
 *
 *  NOT LINKS. There is no person page to go to, so the cards carry no
 *  hover, no underline and no group: the only action in this band is
 *  the button in the header.
 *
 *  Server component: no state, no effects.
 * ------------------------------------------------------------------ */

/** Per position, not per person: position 1 hangs from the header's
 *  baseline, 2 drops furthest and widens, 3 drops half as far and
 *  narrows again. Index 0 carries no offset so the row still hangs off
 *  the band header. */
const SHAPES = [
  { offset: "", aspect: "aspect-[4/5] md:aspect-[3/4]" },
  { offset: "md:mt-24", aspect: "aspect-[4/5]" },
  { offset: "md:mt-12", aspect: "aspect-[4/5] md:aspect-[3/4]" },
] as const;

export default function Founders({
  dict,
}: {
  dict: Dictionary["home"]["founders"];
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
            <LocaleLink href="/book-a-call" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>

        <div className="pc-grid mt-16 md:mt-24">
          {dict.items.map((person, i) => {
            const shape = SHAPES[i] ?? SHAPES[0];

            /* `col-span-4` is a third of the page above md and the full
               width of the four column phone grid below it, so one class
               covers both. */
            return (
              <figure
                key={person.key}
                className={`col-span-4 ${shape.offset}`}
              >
                <div
                  className={`relative overflow-hidden bg-paper-dim ${shape.aspect}`}
                >
                  <Image
                    src={person.image}
                    alt={person.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-6 text-[1.125rem] leading-[1.375] text-moss">
                  {person.caption}
                </p>
                <blockquote className="mt-2 text-heading-md text-ink">
                  {person.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-[1.125rem] leading-[1.375] text-ink">
                    {person.name}
                  </span>
                  <span className="block text-[1rem] leading-[1.375] text-moss">
                    {person.role}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
