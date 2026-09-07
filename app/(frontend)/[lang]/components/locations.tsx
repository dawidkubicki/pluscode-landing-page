"use client";

/* ------------------------------------------------------------------ *
 *  LOCATIONS. The closing band before the footer: where Pluscode is
 *  (Poznan) and where it consults (Germany, Italy, both remote). No
 *  country here is an office except Poland, and the detail block says so
 *  in the copy rather than in the styling.
 *
 *  "use client" because the whole point of the band is one shared
 *  selection: the map and the pills are two controls over the SAME piece
 *  of state, so clicking Italy on the map lights the Italy pill and vice
 *  versa. Nothing else here needs the client.
 *
 *  THE MAP is generated (lib/europe-map.ts), never authored here. The
 *  backdrop is every other country as a single quiet path; the three
 *  active countries are separate paths so each can be lit and clicked.
 *  The svg scales to its grid cell, so the map has no fixed size and the
 *  band reflows with the column rather than with a breakpoint.
 *
 *  A NOTE ON THE SVG's ACCESSIBILITY. role="img" on the svg makes every
 *  shape inside it presentational, so the countries cannot also be
 *  controls: an earlier version gave each one role="button" and
 *  tabIndex={0}, which produced three tab stops that announced nothing at
 *  all, the worst of both designs. The pills below are the real control,
 *  ordinary buttons with aria-pressed, and clicking the map is a pointer
 *  shortcut on top of them rather than a second, broken path to the same
 *  state.
 * ------------------------------------------------------------------ */

import { useState } from "react";
import { MAP_ACTIVE } from "@/lib/europe-map";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Locations = Dictionary["home"]["locations"];

/* THREE fills, not two, and the middle one is the point of the band.

   The first version gave an unselected country the backdrop's own value so
   it "read as part of the continent". It read as part of the continent so
   well that Germany and Italy were invisible: the band said Pluscode works
   in three countries and showed one. All three now sit a step above the
   backdrop whether or not they are selected, so the answer is legible
   before anyone clicks, and the selection is a further step up from there.
   Hover lands between the two: far enough to answer the pointer, not so far
   that it is mistaken for the current selection. */
const FILL_SELECTED = "fill-[var(--color-sage)]";
const FILL_IDLE =
  "fill-[color-mix(in_srgb,var(--color-sage)_45%,var(--color-moss))] group-hover:fill-[color-mix(in_srgb,var(--color-sage)_72%,var(--color-moss))]";
const FILL_TRANSITION =
  "transition-[fill] duration-200 ease-[var(--ease-io-attio)]";

export default function Locations({
  dict,
  viewBox,
  backdrop,
}: {
  dict: Locations;
  /* The viewBox string and the backdrop path arrive as props from the
     server. `lib/europe-map.ts` is 60KB, almost all of it the single
     backdrop path, and importing the module here would ship every byte of
     it into the client chunk on top of the copy already in the HTML. Only
     MAP_ACTIVE is imported directly: three short paths that the click
     handlers genuinely need on the client. */
  viewBox: string;
  backdrop: string;
}) {
  /* THE one piece of state in this band. Both the map paths and the pills
     write to it, and everything below reads from it. */
  const [selected, setSelected] = useState("PL");

  /* Falls back to the first country so a dictionary that ever drops PL
     still renders a detail block instead of nothing. */
  const active =
    dict.countries.find((c) => c.code === selected) ?? dict.countries[0];

  /* The map's own label, translated with the rest of the band. It is the
     only accessible name the svg has, now that the country shapes inside
     it are presentational. */
  const mapLabel = dict.countries.map((c) => c.name).join(", ");

  return (
    <section className="on-dark bg-deep py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid items-center">
          <div className="col-span-4 md:col-span-7">
            <svg
              viewBox={viewBox}
              role="img"
              aria-label={mapLabel}
              className="h-auto w-full"
            >
              <path d={backdrop} fill="var(--color-moss)" aria-hidden />
              {MAP_ACTIVE.map((country) => {
                const isSelected = country.code === active.code;
                return (
                  /* POINTER ONLY, deliberately. The svg is role="img",
                     which makes everything inside it presentational, so a
                     focusable shape in here would be a tab stop that
                     announces nothing at all. The three pills below are the
                     real control: ordinary buttons, in the tab order, with
                     aria-pressed. Clicking the map is a shortcut for a
                     sighted pointer user and is never the only way in. */
                  <g
                    key={country.code}
                    onClick={() => setSelected(country.code)}
                    className="group cursor-pointer"
                  >
                    <path
                      d={country.d}
                      className={`${FILL_TRANSITION} ${
                        isSelected ? FILL_SELECTED : FILL_IDLE
                      }`}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="col-span-4 mt-10 md:col-start-9 md:mt-0">
            <h2 className="text-heading-md text-white">{dict.title}</h2>
            <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
              {dict.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {dict.countries.map((country) => {
                const isSelected = country.code === active.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(country.code)}
                    className={`border px-5 py-4 text-[1.125rem] leading-none transition-colors duration-200 ease-[var(--ease-io-attio)] ${
                      isSelected
                        ? "border-white bg-white text-ink"
                        : "border-rule-deep bg-transparent text-mist hover:border-white hover:bg-white hover:text-ink"
                    }`}
                  >
                    {country.name}
                  </button>
                );
              })}
            </div>

            {/* The detail swaps on every click, and the three bodies wrap to
                different line counts. The min-height holds the tallest of
                them so the entity line below, and the footer under it, stay
                put while the reader tries each country. */}
            <div className="mt-8 min-h-[264px] border-t border-rule-deep pt-8 md:min-h-[236px]">
              <p className="text-[1.125rem] leading-[1.375] text-white">
                {active.city}
              </p>
              <p className="mt-4 text-[0.875rem] text-sage">{dict.roleLabel}</p>
              <p className="text-[1.125rem] leading-[1.375] text-mist">
                {active.role}
              </p>
              <p className="mt-4 text-[1.125rem] leading-[1.375] text-mist">
                {active.body}
              </p>
            </div>

            <p className="mt-10 text-[0.875rem] text-sage">{dict.entity}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
