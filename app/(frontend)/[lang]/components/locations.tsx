"use client";

/* ------------------------------------------------------------------ *
 *  LOCATIONS. The closing band before the footer: where Pluscode is
 *  (Poznan) and where it consults (Germany, Italy, the Netherlands,
 *  Norway, Sweden and Finland, all remote). No country here is an office
 *  except Poland, and the detail block says so in the copy rather than in
 *  the styling. The band closes with a call to action because it used to
 *  be the only band on the page without one, and a reader who has just
 *  found their country needs somewhere to go.
 *
 *  "use client" because the whole point of the band is one shared
 *  selection: the map and the pills are two controls over the SAME piece
 *  of state, so clicking Italy on the map lights the Italy pill and vice
 *  versa. Nothing else here needs the client.
 *
 *  THE MAP is generated (lib/europe-map.ts), never authored here. It is
 *  drawn as whole countries with the viewBox fitted to them, so its edge
 *  is the coast and the eastern borders rather than a rectangle, and it
 *  comes out near square (923 x 947). The backdrop is every other country
 *  as a single quiet path; the seven active countries are separate paths
 *  so each can be lit and clicked. The svg scales to its grid cell up to
 *  a height cap (see the svg below), so the map has no fixed size and the
 *  band reflows with the column rather than with a breakpoint.
 *
 *  A NOTE ON THE SVG's ACCESSIBILITY. role="img" on the svg makes every
 *  shape inside it presentational, so the countries cannot also be
 *  controls: an earlier version gave each one role="button" and
 *  tabIndex={0}, which produced tab stops that announced nothing at all,
 *  the worst of both designs. The pills below are the real control,
 *  ordinary buttons with aria-pressed, and clicking the map is a pointer
 *  shortcut on top of them rather than a second, broken path to the same
 *  state.
 * ------------------------------------------------------------------ */

import { useState } from "react";
import LocaleLink from "./locale-link";
import { MAP_ACTIVE } from "@/lib/europe-map";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Locations = Dictionary["home"]["locations"];

/* THREE fills, not two, and the middle one is the point of the band.

   The first version gave an unselected country the backdrop's own value so
   it "read as part of the continent". It read as part of the continent so
   well that Germany and Italy were invisible: the band said Pluscode works
   in several countries and showed one. Every active country now sits a
   step above the backdrop whether or not it is selected, so the answer is
   legible before anyone clicks, and the selection is a further step up
   from there. Hover lands between the two: far enough to answer the
   pointer, not so far that it is mistaken for the current selection. */
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
     server. `lib/europe-map.ts` is around 20KB, most of it the single
     backdrop path, and importing the module here would ship every byte of
     it into the client chunk on top of the copy already in the HTML. Only
     MAP_ACTIVE is imported directly: seven short paths that the click
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
            {/* THE MAP'S HEIGHT. The drawing is near square, so at seven
                columns it would run past 800px tall on a laptop and past
                1100px on a wide monitor, far taller than the text beside
                it. `md:max-h-[720px]` caps the svg's box; the drawing
                inside is never distorted or clipped by that, because an
                inline svg fits its viewBox into whatever box it gets
                (`preserveAspectRatio`, `meet`) exactly the way
                `object-contain` fits an image. Below the cap the map is
                simply as wide as its cell, as before.

                Once the cap bites, the box is wider than the drawing, and
                `xMin` keeps the drawing on the grid's left edge rather
                than floating it in the middle of the cell, so the map
                stays aligned with the blocks in every other band. The
                text column is centred against the box by `items-center`
                on the grid, so it sits level with the map either way. On
                a phone the cap is off: the map is one column wide and
                shorter than the copy under it. */}
            <svg
              viewBox={viewBox}
              preserveAspectRatio="xMinYMid meet"
              role="img"
              aria-label={mapLabel}
              className="h-auto w-full md:max-h-[720px]"
            >
              <path d={backdrop} fill="var(--color-moss)" aria-hidden />
              {MAP_ACTIVE.map((country) => {
                const isSelected = country.code === active.code;
                return (
                  /* POINTER ONLY, deliberately. The svg is role="img",
                     which makes everything inside it presentational, so a
                     focusable shape in here would be a tab stop that
                     announces nothing at all. The seven pills below are the
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

            {/* Seven pills, so they wrap onto two rows in this column at
                every width. The wrap is the layout, not an overflow. */}
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

            {/* The detail swaps on every click, and the seven bodies wrap
                to different line counts. The min-height holds the tallest
                of them so the entity line below, and the footer under it,
                stay put while the reader tries each country. Every body is
                one sentence in all three languages (the longest is the
                Polish line for Germany, 82 characters), which fits inside
                these minimums with room to spare even in the narrowest
                four column text cell. */}
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

            <LocaleLink href="/book-a-call" className="btn btn-invert mt-8">
              {dict.cta}
            </LocaleLink>

            <p className="mt-10 text-[0.875rem] text-sage">{dict.entity}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
