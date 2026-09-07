"use client";

import { useEffect, useRef } from "react";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  THE HOME HERO. The first thing anyone sees.
 *
 *  Full bleed, and deliberately NOT inside `.pc-shell`: the contour field
 *  runs to all four edges of the viewport. Only the type is shelled, so the
 *  headline still starts on the same x as every band below it.
 *
 *  FOUR LAYERS, back to front: the video, a deep green wash, the column
 *  ruling, then the content. The wash is what makes this work. At 65% the
 *  field reads as texture under the words instead of a picture competing
 *  with them, and the headline sits at full white contrast rather than
 *  swimming over moving mid tones. There is no fallback gradient behind it
 *  on purpose: when the sources fail the poster stays on screen, and a
 *  gradient would double up with it.
 *
 *  The type is pushed to the LOWER LEFT, not centred. The section is a flex
 *  column with `justify-end`, so the grid sits on the bottom padding and the
 *  height of the headline block never pulls it back toward the middle.
 *
 *  WHY THIS IS A CLIENT COMPONENT. Reduced motion. `autoplay` is an HTML
 *  attribute, so no media query can suppress it: the only place to honour
 *  `prefers-reduced-motion` is at runtime, by pausing the element. That is
 *  the whole reason for the boundary, and it costs one ref and one effect.
 *  Everything visible here renders from the server and needs no JavaScript.
 * ------------------------------------------------------------------ */
export default function Hero({ dict }: { dict: Dictionary["home"]["hero"] }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (query.matches) {
        // Clearing the property as well as pausing matters: the browser
        // re-reads `autoplay` on every load, so a source swap, a bfcache
        // restore or a return to the tab would otherwise start it again.
        video.autoplay = false;
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          // Seeking before metadata arrives throws in some browsers. Nothing
          // has played yet in that case, so there is nothing to rewind.
        }
      } else if (video.paused) {
        video.autoplay = true;
        void video.play().catch(() => {
          // Autoplay refused (low power mode, for one). The poster stands in.
        });
      }
    };

    apply();
    // Listen, so toggling the OS setting takes effect without a reload.
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <section className="relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden">
      {/* 1. The field. Decoration, not content: it carries no meaning the
             copy does not already carry, so it is hidden from assistive
             technology and taken out of the tab order. WebM first so a
             browser that reads both takes the smaller file. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster="/hero/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/hero/hero.webm" type="video/webm" />
        <source src="/hero/hero.mp4" type="video/mp4" />
      </video>

      {/* 2. The wash. */}
      {/* NO COLOUR OVER THE FOOTAGE. The green wash is gone at Dawid's
          request; what is left is a neutral fade at the two horizontal
          edges and nothing across the middle, so the cyclist and the wall
          read as shot. The fades exist for one reason: the clip alternates
          between a pale concrete wall (bottom-left luma about 150 of 255)
          and a near-black jersey close-up (about 50), and neither ink nor
          white type survives both bare. The bottom fade gives the white
          headline a ground on the pale shots; the top fade does the same
          for the transparent header. On the dark shots both are moot.
          Measured with ffmpeg signalstats before choosing. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(20 30 30 / 0.62) 0%, transparent 24%, transparent 46%, rgb(20 30 30 / 0.74) 100%)",
        }}
      />

      {/* 3. The column ruling, carried across the hero so the grid that
             aligns the page is visible from the first screen. */}
      <div aria-hidden="true" className="pc-ruled-dark absolute inset-0" />

      {/* 4. The content. `relative` lifts it clear of the three layers. */}
      <div className="pc-shell relative pb-24 md:pb-[104px]">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-8">
            <h1 data-rise="0" className="text-heading-xl text-white">
              {dict.headline}
            </h1>
            <p data-rise="1" className="mt-5 text-[1.125rem] text-mist">
              {dict.subline}
            </p>
            <LocaleLink
              href="/services"
              data-rise="2"
              className="btn btn-invert mt-8"
            >
              {dict.cta}
            </LocaleLink>
          </div>

          {/* The scroll cue sits on the last four columns, on the button's
              own line. Below md there are only four columns and no room for
              it beside the type, and a phone needs no invitation to scroll. */}
          <div
            aria-hidden="true"
            className="hidden md:col-span-4 md:flex md:items-end md:justify-end"
          >
            <span className="text-[0.875rem] text-sage">{dict.scroll}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
