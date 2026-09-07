import Image from "next/image";

import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  CASES. Three pieces of work, as a staggered editorial spread.
 *
 *  THE STAGGER IS THE BAND. Three equal boxes in a row would read as a
 *  component; the reference instead starts each column at a different
 *  vertical offset and gives each image a different aspect ratio, so the
 *  eye travels down the row instead of scanning across it. The offsets
 *  and the ratios are therefore fixed per position, not per item, and
 *  they only exist from md up: below 768px the grid is four columns and
 *  every card is a full width 4:3 with no offset, because a stagger on a
 *  single column stack is just uneven whitespace.
 *
 *  The caption sits ABOVE the headline. That inversion is what makes the
 *  card read as editorial rather than as a tile with a subtitle, so the
 *  order of the three elements here is load bearing.
 *
 *  Server component: no state, no effects, hover is CSS.
 * ------------------------------------------------------------------ */

/** Per position, not per item: position 1 is tall, 2 drops and widens, 3
 *  drops furthest and narrows again. Index 0 carries no offset so the row
 *  still hangs off the band header's baseline. */
const SHAPES = [
  { offset: "", aspect: "aspect-[4/3] md:aspect-[4/5]" },
  { offset: "md:mt-24", aspect: "aspect-[4/3]" },
  { offset: "md:mt-48", aspect: "aspect-[4/3] md:aspect-[3/4]" },
] as const;

export default function Cases({ dict }: { dict: Dictionary["home"]["cases"] }) {
  return (
    <section className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 md:col-span-6 flex flex-col items-start gap-5 md:items-end md:justify-end">
            <p className="text-[1.125rem] text-moss">{dict.intro}</p>
            <LocaleLink href="/case-studies" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>

        <div className="pc-grid mt-16 md:mt-24">
          {dict.items.map((item, i) => {
            const shape = SHAPES[i] ?? SHAPES[0];

            /* The three images are abstract contour fields rendered to
               order, one per case, each at the aspect ratio of the card it
               sits in (see scripts, and public/assets/cases). They come
               from the same generative field as the hero video, which is
               what keeps this band and the top of the page in one family.
               Because each one is already cut to its card, `object-cover`
               is a no-op crop rather than a real one, and the shapes below
               can be chosen for the composition instead of for the source.
               An earlier draft pointed these at the client wordmark SVGs
               and needed a contain-versus-cover branch here; the art
               replaced it. */

            return (
              <LocaleLink
                key={item.key}
                href={item.href}
                className={`group col-span-4 block  ${shape.offset}`}
              >
                <div className={`relative overflow-hidden bg-paper-dim ${shape.aspect}`}>
                  <Image
                    src={item.image}
                    /* Empty on purpose: this is an abstract contour
                       field, not a photograph of the work, and the link
                       already carries the caption and the headline. The
                       descriptive `alt` in the dictionary stays there for
                       the case-study pages, which do show real imagery. */
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-6 text-[1.125rem] text-moss">{item.caption}</p>
                {/* `pc-link` draws the underline from 0 to full width, and
                    the group-hover pair is what lets a hover anywhere on the
                    card, image included, move the headline.

                    THE UNDERLINE MUST SIT ON AN INLINE SPAN, not on the h3.
                    `pc-link` paints a background 100% of its own box, and the
                    h3 is a block that fills the grid column: on a headline
                    whose last line is shorter than the column, the rule ran
                    on past the final word (measured at 472px of underline
                    under 394px of text). The span shrinks to the text, so the
                    underline ends where the words do. Stories does the same,
                    and the two bands sit directly on top of each other, so
                    any difference here shows. */}
                <h3 className="mt-2 text-heading-md text-ink">
                  <span className="pc-link group-hover:[background-size:100%_1px]">
                    {item.title}
                  </span>
                </h3>
              </LocaleLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
