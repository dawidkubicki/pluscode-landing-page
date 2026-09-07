import Image from "next/image";
import HeroMesh from "./hero-mesh";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The hero. One promise, one ask, and the lit surface behind them.
 *
 * The band is tall on purpose (78svh of visible height on a desktop, natural
 * on a phone) because the object here is the WebGL surface in `hero-mesh.tsx`
 * and it needs a floor to lie on: the copy sits in the upper part of the band
 * and the folds of light rise around and below it. The copy column carries
 * `data-hero-copy`, which the mesh measures on every layout to keep the
 * ground behind the words at the page's own colour.
 *
 * The first 72px of the section sit under the fixed header, hence the
 * `+72px` in the minimum height and the top padding. From 768px up the
 * bottom padding has a 340px floor as well as an svh share: on a short
 * viewport around 860x806 the copy runs most of the way down the band and
 * the svh share alone left the surface a dim strip under the note.
 *
 * The entrance is `[data-rise]`: a plain time based CSS animation, hand
 * staggered, with no observer, no scroll timeline and no JavaScript. Nothing
 * above the fold, and in particular neither call to action, may depend on a
 * scroll animation or on hydration to become visible.
 */
export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-cream-line bg-cream text-ink"
    >
      <HeroMesh className="pointer-events-none z-0" />

      <div className="pc-shell">
        <div className="pc-rules relative z-10">
          <div className="pc-grid relative min-h-[calc(78svh+72px)] pb-[min(38svh,300px)] pt-[max(128px,calc(72px+8svh))] md:pb-[max(340px,22svh)] lg:min-h-[calc(80svh+72px)] lg:pt-[max(136px,calc(72px+9svh))]">
            <div
              data-hero-copy
              className="relative col-[2/-2] flex flex-col items-center self-start text-center"
            >
              <span className="pc-pill" data-rise="0">
                {dict.eyebrow}
              </span>

              <h1
                className="display mt-9 max-w-[16em] text-balance text-[clamp(44px,calc(14px+5.2svh),76px)] leading-[1.06] tracking-[-0.028em] text-ink lg:leading-[0.95]"
                data-rise="1"
              >
                {dict.headlineStart}{" "}
                <em className="not-italic text-lime-soft">{dict.headlineEm}</em>
                {dict.headlineEnd}
              </h1>

              <p
                className="mt-5 max-w-[27em] text-[18px] font-medium leading-[1.4] tracking-[-0.18px] text-ink-soft"
                data-rise="2"
              >
                {dict.subtext}
              </p>

              <div
                className="mt-8 flex items-center gap-x-2.5 gap-y-2 max-md:w-full max-md:flex-col"
                data-rise="3"
              >
                <LocaleLink href="/book-a-call" className="btn btn-primary max-md:w-full">
                  {dict.ctaPrimary}
                </LocaleLink>
                <a href="#time-saved" className="btn btn-outline max-md:w-full">
                  {dict.ctaSecondary}
                </a>
              </div>

              <p
                className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[14px] leading-[1.5] text-ink-mute"
                data-rise="3"
              >
                <Image
                  src="/assets/team/krzysztof-avatar.jpg"
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-full object-cover object-center ring-1 ring-cream-line-strong"
                />
                {dict.ctaNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
