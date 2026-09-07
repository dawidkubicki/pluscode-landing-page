"use client";

/* ------------------------------------------------------------------ *
 *  LATEST. An index of five news items with exactly one of them open
 *  beside it: the tags read as a table of contents on the left, the
 *  chosen item is spelled out on the right.
 *
 *  "use client" because the open item is local state and the tags are
 *  real buttons. Nothing else in the band needs the client.
 *
 *  ONE COPY OF THE CONTENT, TWO LAYOUTS. Above md the panel sits in a
 *  second column beside the whole list; below md the grid only has four
 *  columns, so the two column split collapses and the panel has to fall
 *  directly under the tag that opened it. Rather than render the panel
 *  twice and hide one, the five buttons and the single panel are all
 *  direct children of one grid: on the phone `order` slots the panel in
 *  after the selected button, and above md every child is placed
 *  explicitly by row and column, which makes `order` irrelevant there.
 *  Explicit placement always beats order, so one DOM serves both.
 * ------------------------------------------------------------------ */

import { useState } from "react";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* Written out rather than built with a template string: Tailwind scans
   source text, so a class it never sees literally is never generated. */
const rowStart = [
  "md:row-start-1",
  "md:row-start-2",
  "md:row-start-3",
  "md:row-start-4",
  "md:row-start-5",
];

/** Clamped, not indexed. A sixth item added to the dictionary would
 *  interpolate `undefined` straight into the class list and silently lose
 *  its explicit row placement, which on a grid means it lands wherever
 *  auto-placement puts it: on top of the open panel. Clamping keeps the
 *  extra item stacked under the fifth instead. */
const rowFor = (i: number) => rowStart[Math.min(i, rowStart.length - 1)];

export default function Latest({ dict }: { dict: Dictionary["home"]["latest"] }) {
  const [selected, setSelected] = useState(0);
  const open = dict.items[selected];
  const external = open.href.startsWith("http");

  return (
    <section className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          {/* Plain divs, not `Reveal`. The eight other home bands wrap
              nothing, so a JS-driven entrance on this one band alone made
              the middle of the page animate in and its neighbours not. The
              design is still by intent, and globals.css already gives every
              band the same CSS entrance through `[data-reveal]`. */}
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>
          <div className="col-span-4 md:col-span-6 flex flex-col items-start gap-5 md:items-end md:justify-end">
            <p className="text-[1.125rem] text-moss">{dict.intro}</p>
            <LocaleLink href="/insights" className="btn btn-primary">
              {dict.cta}
            </LocaleLink>
          </div>
        </div>

        <div className="pc-grid mt-16 md:mt-20">
          {dict.items.map((item, i) => {
            const isOpen = i === selected;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelected(i)}
                aria-current={isOpen ? "true" : "false"}
                aria-controls="latest-open"
                /* Even numbers leave a gap after each button for the
                   panel to occupy on the phone. */
                style={{ order: i * 2 }}
                /* The closing hairline is set by index, not by `last:`: the
                   panel is the last child of this grid, so `last:` would
                   never reach the fifth button. */
                className={`col-span-4 w-full border-t border-rule py-5 text-left text-[1.125rem] transition-colors md:col-span-5 md:col-start-1 ${rowFor(i)} ${
                  i === dict.items.length - 1 ? "border-b" : ""
                } ${isOpen ? "text-ink" : "text-moss hover:text-ink"}`}
              >
                {item.tag}
              </button>
            );
          })}

          {/* The min-height is the whole reason selecting a different item
              does not make the page jump: the bodies differ by a couple of
              lines and without a floor the band would resize under the
              reader's cursor. It is desktop only, where the panel is beside
              a fixed height list; stacked on the phone it would just be a
              hole. `md:pt-5` lines the tag up with the first button's label,
              which starts one hairline and 20px of padding below the top. */}
          <div
            id="latest-open"
            style={{ order: selected * 2 + 1 }}
            className="col-span-4 pb-12 md:col-span-6 md:col-start-7 md:row-start-1 md:row-span-5 md:min-h-[360px] md:pb-0 md:pt-5"
          >
            <p className="text-[0.875rem] text-moss">{open.tag}</p>
            <h3 className="mt-4 text-heading-md text-ink">{open.title}</h3>
            <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
              {open.body}
            </p>
            {external ? (
              <a
                href={open.href}
                target="_blank"
                rel="noreferrer"
                className="pc-link text-[1.125rem] mt-8 inline-block"
              >
                {dict.readMore}
              </a>
            ) : (
              <LocaleLink
                href={open.href}
                className="pc-link text-[1.125rem] mt-8 inline-block"
              >
                {dict.readMore}
              </LocaleLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
