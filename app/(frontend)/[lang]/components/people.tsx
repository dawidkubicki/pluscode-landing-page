import Image from "next/image";
import { Reveal } from "./motion";
import { Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * The two text links this band is allowed. Never a filled button: buttons
 * belong to the hero and the dark CTA band, and a third ask here would make
 * the page ask twice in the same breath.
 *
 * Both links belong to the BAND, not to one person. The previous build put
 * "Book a call" under Krzysztof and nothing under Dawid, which read as a
 * ranking. `min-h-11` is the 44px tap target on a 14px line.
 *
 * The accent is absent at rest and arrives on hover, as `lime-soft`, the
 * accent-as-text value that clears the dark ground. Spec gate I.3 keeps the
 * accent "out of the people band at rest", which outranks the `text-lime-ink`
 * shown in the D6 sketch: this is the only band carrying faces and an accent
 * sitting beside them at rest competes with them.
 */
const LINK_CLASS =
  "group inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium transition-colors duration-300 ease-io-attio hover:text-lime-soft hover:duration-50";

/** One person: a 40px circle, a name and a role. Nothing else lives here. */
function Person({
  src,
  name,
  role,
}: {
  src: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-cream-dim px-5 py-4">
      {/* `alt=""`: the name sits next to the face in real text, so a second
          reading of it would be noise on a screen reader. */}
      <Image
        src={src}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full object-cover object-center grayscale contrast-[1.02]"
      />
      <div className="min-w-0">
        <p className="text-[15px] font-medium leading-[1.3] text-ink">{name}</p>
        <p className="mt-0.5 text-[13px] leading-[1.35] text-ink-mute">
          {role}
        </p>
      </div>
    </div>
  );
}

/**
 * Band 7, `people`. The two people who do the work.
 *
 * Attio's customer-story split: one large photograph bled to the left
 * vertical rule and to both band rules, the copy bottom-aligned beside it.
 *
 * THE BAND HEIGHT IS SET BY THE PHOTO WELL AT 620px, NEVER BY THE COPY.
 * That is the transferable property: a band measured by a fixed visual is
 * stable across widths and across locales, and German cannot make it taller.
 * The copy column stretches to the same 620 and hangs its content off the
 * bottom edge, so a longer translation eats the slack above it instead of
 * growing the page.
 *
 * Deliberate ceiling: one photograph, two 40px circles, two names, two roles
 * and two text links. No paragraph. Three photographs of the same two men was
 * restatement, not density, and a bio here would make this a team page. That
 * material belongs on /about.
 */
export default function People({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).people;

  return (
    <section
      id="people"
      className="scroll-mt-24 border-t border-cream-line bg-cream-dim"
    >
      <div className="pc-shell">
        <div className="pc-rules">
          {/* Both children span the full 24 columns below `lg` and stack into
              two implicit rows. The display of `.pc-grid` is never overridden:
              that class and Tailwind's own utilities share the utilities layer
              and the same specificity, so which one wins would come down to
              emission order. `grid-column` on the child has no such fight. */}
          <div className="pc-grid">
            {/* ---- THE SLAB: columns 1 to 9, flush to the LEFT rule ---- */}
            {/* 522px wide at 1440, bleeding to the band's top and bottom rules
                and to the container's left hairline. Bled off one edge and
                cropped by its container is the whole move; a slab with air
                around it is a picture of a photograph. */}
            <div
              className="photo-frame col-[1/10] h-[620px] border-r border-cream-line bg-photo-ground max-lg:col-[1/-1] max-lg:h-[380px] max-lg:border-r-0 max-lg:border-b"
              /* `.photo-frame` gives the `photo-ground` fill, the clip and the
                 positioning context. Its `--shadow-photo` is switched off
                 inline rather than with `shadow-none`, because the class sits
                 in the same `@layer utilities` as Tailwind's own utilities at
                 the same specificity, so which one won would come down to
                 emission order. Its ring is not lost: it is redrawn below,
                 where it can actually be seen. */
              style={{ boxShadow: "none" }}
            >
              {/*
                THE CROP IS LOAD-BEARING, IN BOTH AXES.

                Horizontally: the 1350x1800 source has dark vertical bands at
                both edges (a C-stand and black flags); clean paper runs from
                x = 11.9% to 93.3%, which is an aspect of 61/100. So the image
                box is authored at `aspect-[61/100]` and `object-[64%_50%]`
                selects that clean window: at this ratio the horizontal
                overflow is 18.667%, and 64% of it opens 11.95% to 93.28%.
                DO NOT change 64% to 50%, and do not delete the aspect box to
                let the image fill the 522x620 well directly. The well is
                wider than the source, so `object-cover` there would crop
                vertically instead and the horizontal position would go inert,
                putting a slice of black flag down the left edge. The 50% is
                inert at this ratio and is written out so nobody "fixes" the
                pair.

                Vertically: the box is 855px tall inside a 620px well, so the
                bottom 235px of it runs under the band rule. The window is
                always 72.5% of the frame, so the only freedom is where it
                starts, and `top-0` is the one position that keeps the
                headroom above both heads: the cut then lands at the shoes and
                the floor, and the slab reads as continuing past the rule
                instead of as a short photograph. Below `lg` the same box is
                1180px tall in a 380px well, so the window closes to the top
                32% and the crop becomes a head and shoulders duo. Both were
                checked against the file, not estimated.
              */}
              <Reveal className="absolute inset-x-0 top-0 aspect-[61/100]">
                <Image
                  src="/assets/team/founders.jpg"
                  alt={t.groupAlt}
                  fill
                  sizes="(min-width: 1024px) 522px, 100vw"
                  className="object-cover object-[64%_50%] grayscale contrast-[1.02]"
                />
              </Reveal>
              {/* The house photo ring, `--shadow-photo`'s inset layer, redrawn
                  above the image. An inset shadow on `.photo-frame` itself
                  paints under its children, so on a full-bleed slab it would
                  never be seen. These are near-white high-key studio frames
                  and without the keyline they read as a cut-out floating on
                  the band. The ring is LIGHT: the dark one it replaced was
                  drawn for a white page and vanished against the dark band.
                  A ring, never a border: a border would take a
                  pixel off the photograph and off the flush rules. The two
                  outer layers of `--shadow-photo` are dropped with the inline
                  reset above, because a drop shadow under a slab that bleeds
                  to three rules would spill onto the next band, and D0 bans
                  shadow on layout containers. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.08)]"
              />
            </div>

            {/* ---- THE COPY: columns 11 to 23, BOTTOM aligned ---- */}
            <Reveal
              delay={0.06}
              className="col-[11/-2] flex flex-col justify-end gap-6 py-14 max-lg:col-[1/-1] max-lg:px-[calc(100%/24)] max-lg:py-12"
            >
              {/* House pill geometry, neutral ground. This band runs zero
                  indigo at rest, which is what stops the page shouting over
                  the faces. */}
              <span className="inline-flex h-6 w-fit items-center rounded-lg bg-cream-surface px-1.5 text-[14px] font-medium leading-5 tracking-[-0.14px] text-ink-soft">
                {t.eyebrow}
              </span>

              {/* One heading, two tones, no paragraph under it. The 26 word
                  body became the grey clause, which is capped at about 16
                  words by being set at 32px. */}
              {/* 15em is the reading measure beside the slab. Below `lg` the
                  copy has the whole sheet to itself, and holding it at 15em
                  there would leave roughly 400px of ground to its right, which
                  is the exact hole the old 400px cap left at 768. */}
              <h2 className="display max-w-[15em] text-balance text-heading-sm max-lg:max-w-[22em]">
                <span className="text-ink">{t.title}. </span>
                <span className="text-ink-soft">{t.greyClause}</span>
              </h2>

              {/* Two flush cells, divided by a 1px gap over the hairline, no
                  radius and no border of their own. Dawid LEFT, Krzysztof
                  RIGHT, repeating their positions in the slab, so the group
                  shot reads without a caption. */}
              <div className="grid grid-cols-2 gap-px border-t border-cream-line bg-cream-line max-sm:grid-cols-1">
                <Person
                  src="/assets/team/dawid-avatar.jpg"
                  name={t.members.dawid.name}
                  role={t.members.dawid.role}
                />
                <Person
                  src="/assets/team/krzysztof-avatar.jpg"
                  name={t.members.krzysztof.name}
                  role={t.members.krzysztof.role}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-6">
                <LocaleLink
                  href="/book-a-call"
                  className={`${LINK_CLASS} text-ink`}
                >
                  {t.bookLink}
                  <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </LocaleLink>
                <LocaleLink
                  href="/about"
                  className={`${LINK_CLASS} text-ink-soft`}
                >
                  {t.aboutLink}
                  <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </LocaleLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
