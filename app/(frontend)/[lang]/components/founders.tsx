import Image from "next/image";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "./locale-link";

/* ------------------------------------------------------------------ *
 *  PEOPLE. The band that introduces the two of us, and the only ask on
 *  the page: one button, at the bottom, after the reader has met them.
 *
 *  The reference runs a single huge quote on the left against a
 *  full-bleed portrait on the right. We have two people, so that block
 *  runs twice and the second is mirrored, which is what stops a two
 *  person band reading as one template repeated.
 *
 *  THE MIRROR IS COLUMN PLACEMENT, NOT ORDER. Both rows put the text
 *  block first in the DOM and move it with `col-start`, so a screen
 *  reader hears caption, quote, attribution, portrait in both rows and
 *  the tab order matches the reading order. `flex-row-reverse` or a
 *  per-person DOM swap would give the same picture and a different
 *  reading order in row two. `md:row-start-1` is load bearing on the
 *  mirrored row: a definite `col-start-1` on the item that comes second
 *  would otherwise be auto placed onto a new row, since the cursor has
 *  already passed column 1.
 *
 *  Each row is its own `pc-grid` rather than more items on one grid.
 *  Every grid inside `pc-shell` resolves to the same 12 columns, so the
 *  rows still line up with each other and with every other band, and the
 *  large gap between people is a plain top margin instead of a fight
 *  with implicit row placement.
 * ------------------------------------------------------------------ */

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
          <p className="col-span-4 md:col-span-5 md:col-start-8 text-[1.125rem] leading-[1.375] text-moss">
            {dict.intro}
          </p>
        </div>

        {dict.items.map((person, index) => {
          const mirrored = index % 2 === 1;

          return (
            <div key={person.key} className="pc-grid mt-20 md:mt-32">
              <figure
                className={
                  mirrored
                    ? "col-span-4 md:col-span-6 md:col-start-7 md:row-start-1"
                    : "col-span-4 md:col-span-6 md:col-start-1 md:row-start-1"
                }
              >
                <p className="text-[1.125rem] leading-[1.375] text-moss">
                  {person.caption}
                </p>
                {/* The guillemets already live in the dictionary, so the
                    quote renders exactly as written and never gets a
                    second set of marks from CSS. */}
                <blockquote className="mt-6 text-heading-md text-ink">
                  {person.quote}
                </blockquote>
                <figcaption className="mt-8">
                  <span className="block text-[1.125rem] leading-[1.375] text-ink">
                    {person.name}
                  </span>
                  <span className="block text-[1rem] leading-[1.375] text-moss">
                    {person.role}
                  </span>
                </figcaption>
              </figure>

              <div
                className={`relative aspect-[4/5] overflow-hidden bg-paper-dim ${
                  mirrored
                    ? "col-span-4 md:col-span-5 md:col-start-1 md:row-start-1"
                    : "col-span-4 md:col-span-5 md:col-start-8 md:row-start-1"
                }`}
              >
                <Image
                  src={person.image}
                  alt={person.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}

        <div className="pc-grid mt-16">
          <div className="col-span-4 md:col-span-6">
            <LocaleLink href="/book-a-call" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
