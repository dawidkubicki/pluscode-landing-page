"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  THE HOME HERO. The first thing anyone sees, and now a PLAYLIST.
 *
 *  N slides, currently two: the studio clip of the cyclist, and an aerial
 *  hyperlapse over a freight yard at dusk. One is chosen at random on load,
 *  plays once, and hands over to the next; the playlist is the loop, so no
 *  clip loops on its own any more. The headline and the subline belong to
 *  the slide, because a line written for a cyclist in a studio says nothing
 *  over a yard full of trailers.
 *
 *  Full bleed, and deliberately NOT inside `.pc-shell`: the footage runs to
 *  all four edges of the viewport. Only the type is shelled, so the headline
 *  still starts on the same x as every band below it.
 *
 *  THREE STACKS, back to front: one layer per slide (its footage and the
 *  wash measured for that footage), the column ruling, then the content.
 *  There is no fallback gradient behind the video on purpose: when a source
 *  fails the poster stays on screen, and a gradient would double up with it.
 *
 *  The type is pushed to the LOWER LEFT, not centred. The section is a flex
 *  column with `justify-end`, so the grid sits on the bottom padding and the
 *  height of the headline block never pulls it back toward the middle. THAT
 *  IS ALSO WHY THE BUTTON NEVER MOVES between slides: the shell is pinned to
 *  the bottom of the section, content flows down from its top edge, so a
 *  headline that wraps to a different number of lines grows UPWARD and the
 *  subline, the button and the scroll cue keep their exact position. The one
 *  thing that moves is the top edge of the headline, and it moves while the
 *  headline is at opacity 0.
 *
 *  ---------------------------------------------------------------
 *  WHY THE VIDEO SOMETIMES NEVER STARTED. Two causes, both fixed here.
 *
 *  1. THE SOURCE ORDER. This used to list the VP9 WebM first and the H.264
 *     mp4 second, on the reasoning that a browser reading both should take
 *     the smaller file. That reasoning has a hole in it. Safari advertises
 *     VP9 and then fails to decode it in some builds and configurations, and
 *     a decode failure AFTER a source has been selected does not fall
 *     through to the next `<source>`: the resource selection algorithm has
 *     already finished, so the element simply sits there showing its poster
 *     forever. That is the reported symptom exactly. H.264 in mp4 is the one
 *     thing every target decodes, so it now goes FIRST and the webm is the
 *     second source rather than the first. The webm still earns its place:
 *     a browser built with no H.264 decoder reports nothing for video/mp4,
 *     never selects it, and reaches the webm cleanly through the normal
 *     selection path, which is a rejection and not a failure. The cost is
 *     that Chrome and Firefox now fetch the larger file. Correctness on the
 *     first screen is worth a megabyte.
 *
 *  2. `preload="metadata"`. Paired with autoplay it is at best a no-op and
 *     at worst an instruction to fetch the header and stop, which on a slow
 *     link holds the poster for as long as the browser takes to decide it
 *     wants the rest. A clip we intend to play the moment it arrives should
 *     say so: `preload="auto"`.
 *
 *  Neither of those was the whole story on its own, and one more thing had
 *  to be true for the mp4 to help: BOTH clips are encoded with faststart, so
 *  the moov atom sits before the mdat and playback can begin on the first
 *  packets instead of after the last. The new clip as delivered had them the
 *  other way round, which alone would have held the poster for the whole
 *  7.6MB. Checked with a byte level atom dump, not assumed.
 *
 *  AND WHEN IT STILL DOES NOT PLAY, THE POSTER IS THE DESIGN. Autoplay
 *  refused (iOS low power mode, a data saver, a browser waiting for a
 *  gesture) leaves the still on screen under the same wash and the same
 *  type, which is a composed first screen and not a black rectangle. Every
 *  poster is the clip's own first frame, so a visitor who waits sees the
 *  picture they were already looking at start moving, with no cut.
 *
 *  A SLIDE THAT ERRORS IS DROPPED FROM THE ROTATION rather than left to
 *  stall it: a failed element never fires `ended`, so without this the
 *  playlist would stop on the broken slide and never come back.
 *  ---------------------------------------------------------------
 *
 *  RANDOM WITHOUT A HYDRATION MISMATCH. The page is statically prerendered,
 *  so the server has to emit one stable slide: it emits the first, complete
 *  with its sources and its `autoplay`, which is also what makes the hero
 *  play with JavaScript disabled. The random pick happens in an effect after
 *  mount and crosses to whatever it chose. Nothing random is read during
 *  render and nothing random seeds a `useState`, because both would produce
 *  markup the server could not have produced.
 *
 *  ONLY THE PLAYING SLIDE FETCHES BYTES. A slide carries `<source>` children
 *  only while it is armed, and `load()` is what makes the element act on
 *  that: it starts the fetch for a slide that has just been armed and aborts
 *  the one in flight for a slide that has just been disarmed. The next slide
 *  is armed when the current one reports that it is playing, so it is warm
 *  by the time it is needed. The one wrinkle is at mount: the server's slide
 *  is already fetching, so it is kept when it happens to be the slide that
 *  plays next anyway (which with two slides it always is) and aborted when
 *  it is not.
 *
 *  UNDER REDUCED MOTION: one slide, its poster, still. Not paused after the
 *  fact, not downloaded and then stopped. The sources are taken away and the
 *  fetch is aborted, so the clip is never played and, past the first few
 *  packets, never even transferred. Nothing advances, so the words never
 *  change either, and the whole hero is one composed still frame.
 * ------------------------------------------------------------------ */

/** One slide, exactly as the dictionary and lib/hero-slides.ts hand it over. */
export type HeroSlide = Dictionary["heroSlides"]["slides"][number];

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/* `prefers-reduced-motion` as a value the RENDER can read, which the effects
   in this file do not need but the progress line does: the line is markup,
   so the decision not to draw it has to be made while rendering rather than
   afterwards. Read through useSyncExternalStore, the same way the Insights
   band reads it, because a media query is an external store with exactly a
   subscribe and a snapshot. The server snapshot is `false`, so the server
   emits the line and a client that asked for less motion drops it on
   hydration. Losing one hairline is the whole of that difference. */
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const readReducedOnServer = () => false;

/* The slide change, in milliseconds. The picture leads and the words follow,
 * the same sequence and the same easings as the Insights band, because it is
 * the same gesture at a different size. The words leave quickly and arrive
 * slowly: a fast exit reads as making room, a slow entrance reads as
 * arriving, and the two together are what stops this feeling like a swap. */
const SHOT_MS = 700;
const COPY_OUT_MS = 260;
const COPY_IN_MS = 480;
const COPY_STEP_MS = 90;

/* THE HERO'S PRIVATE STYLESHEET, for the same reason the Insights band has
 * one: these durations have to be the single source for both the CSS and the
 * timer that swaps the words, and a Tailwind arbitrary value cannot be that
 * because those are scanned as literal strings at build time.
 *
 * THE CLIP CHANGE IS A COVER, NOT A CROSS-DISSOLVE. Every layer sits at
 * opacity 0 and `z-index: 0`; the open one is raised and opaque. The closed
 * rule's transition is the one that matters: a 1ms change delayed past the
 * whole fade means the layer that has just closed holds its opacity until
 * the incoming layer has finished covering it, and only then blinks out
 * underneath. Two half transparent videos over each other would read as a
 * double exposure, and at full screen that is very hard to miss.
 *
 * THE WORDS FADE THROUGH NOTHING, which is what keeps exactly one `<h1>` on
 * the page. Two stacked headlines crossfading would mean two of them in the
 * document for the length of every change; instead the single block fades
 * out, the text is swapped while it is invisible, and it fades back in. The
 * transition is declared on the children rather than on the block so that
 * the block itself is free to carry the `[data-rise]` entrance, whose `both`
 * fill would otherwise pin the children's opacity at 1 forever and swallow
 * the change entirely. Everything moves on `opacity` and `transform` only,
 * so no line of the hero is ever re-laid out. */
const HERO_CSS = `
.pc-hero-shot {
  opacity: 0;
  z-index: 0;
  transition: opacity 1ms linear ${SHOT_MS + 80}ms;
}
.pc-hero-shot[data-open="true"] {
  opacity: 1;
  z-index: 1;
  transition: opacity ${SHOT_MS}ms var(--ease-out-cubic);
}
.pc-hero-copy > * {
  opacity: 1;
  transform: none;
  transition:
    opacity ${COPY_IN_MS}ms var(--ease-out-cubic),
    transform ${COPY_IN_MS}ms var(--ease-out-cubic);
}
.pc-hero-copy > * + * {
  transition-delay: ${COPY_STEP_MS}ms;
}
.pc-hero-copy[data-visible="false"] > * {
  opacity: 0;
  transform: translateY(10px);
  transition-duration: ${COPY_OUT_MS}ms;
  transition-delay: 0ms;
}
`;

/** The two edge fades, built from the opacities measured for this clip.
 *
 *  There is NO COLOUR OVER THE FOOTAGE, at Dawid's request: what is left is
 *  a neutral fade at the two horizontal edges and nothing across the middle,
 *  so the picture reads as shot. The fades exist for one reason. The studio
 *  clip alternates between a pale concrete wall (top strip luma 152 of 255,
 *  bottom left 123) and a near black jersey, and neither ink nor white type
 *  survives both bare; the bottom fade gives the white headline a ground on
 *  the pale shots and the top fade does the same for the transparent header.
 *  The freight yard is shot at dusk and measures 99.5 and 100.5 in the same
 *  two places, so it carries about two thirds of the wash: the studio value
 *  over it would crush the sunset and the lit docks to nothing for a
 *  legibility problem it does not have. Both numbers were read with ffmpeg
 *  signalstats over the shipped encodes, which is why they live with the
 *  slide rather than in this file. */
function wash(slide: HeroSlide): string {
  return [
    "linear-gradient(to bottom,",
    `rgb(20 30 30 / ${slide.overlayTop}) 0%,`,
    "transparent 24%,",
    "transparent 46%,",
    `rgb(20 30 30 / ${slide.overlayBottom}) 100%)`,
  ].join(" ");
}

export default function Hero({
  dict,
  items: cmsSlides,
}: {
  dict: Dictionary["heroSlides"];
  /** The published slides, when the hero is driven by the CMS. The page
   *  fetches them; an empty or missing list falls back to the dictionary,
   *  so the first screen is never blank while the collection is being
   *  filled, and CI builds with no database at all. */
  items?: HeroSlide[] | null;
}) {
  const slides = cmsSlides && cmsSlides.length > 0 ? cmsSlides : dict.slides;
  const count = slides.length;

  /** The slide that is playing. 0 on the server, and 0 on the first client
   *  render, so the markup matches; the random pick lands after mount. */
  const [index, setIndex] = useState(0);
  /** The slide whose words are on screen. It follows `index` one fade
   *  later, which is what makes the change a crossfade and not a swap. */
  const [shown, setShown] = useState(0);
  /** The slides allowed to fetch bytes. The server's slide starts armed. */
  const [armed, setArmed] = useState<number[]>([0]);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    readReduced,
    readReducedOnServer,
  );

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  /** Mirrors of state for the media event handlers, which fire outside a
   *  render and must not close over a stale value. */
  const indexRef = useRef(0);
  const armedRef = useRef<number[]>([0]);
  /** Slides whose media failed. Nothing renders from this, so it is a ref:
   *  it exists only to keep a dead slide out of the rotation. */
  const brokenRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  /** The next slide that still works, wrapping around. Returns `from` when
   *  every other slide is broken, which stops the playlist rather than
   *  spinning through elements that cannot play. */
  const nextIndex = useCallback(
    (from: number) => {
      for (let step = 1; step <= count; step++) {
        const candidate = (from + step) % count;
        if (!brokenRef.current.has(candidate)) return candidate;
      }
      return from;
    },
    [count],
  );

  /* HOW FAST A SLIDE RUNS.
     `defaultPlaybackRate` is set as well as `playbackRate`, and that is the
     load bearing half: `load()` resets the current rate back to the default
     one, and this hero calls `load()` every time a slide is armed or
     disarmed, so a rate written only to `playbackRate` would be thrown away
     the moment the clip it belongs to was armed. Setting the default too
     means the value survives a reload, a bfcache restore and a source swap.
     Applied at every point the element can have been reset rather than once
     at mount, because there is no single moment that covers all three. */
  /* The fill of the progress line. It is written to imperatively rather
     than held in state: this moves every frame, and a state update per
     frame would re-render the whole hero sixty times a second to change one
     transform. */
  const progressRef = useRef<HTMLDivElement>(null);

  const applyRate = useCallback(
    (video: HTMLVideoElement | null, i: number) => {
      const value = slides[i]?.rate;
      if (!video || typeof value !== "number" || !Number.isFinite(value)) return;
      const clamped = Math.min(2, Math.max(0.25, value));
      video.defaultPlaybackRate = clamped;
      video.playbackRate = clamped;
    },
    [slides],
  );

  /* THE RANDOM START, once, after mount.
     Reading the media query here rather than from state is deliberate: a
     state value set by a sibling effect would still be false in this pass,
     and a visitor who asked for less motion would get one clip playing
     before the next commit took it away. */
  /* THE ONE PLACE THIS COMPONENT COMMITS STATE STRAIGHT OUT OF AN EFFECT,
     and the cascading render is the point rather than an oversight, so the
     rule is turned off for this effect and only this one.

     The page is statically prerendered. The server therefore has to emit one
     stable slide, which means the random pick cannot happen during render and
     cannot seed a `useState` initialiser either: both would produce markup
     the server could not have produced, and React would either warn or throw
     the client tree away. An effect is the first moment a random choice is
     allowed to exist at all. It costs exactly one extra commit, once, on
     mount, and it buys a hero that is correct in the HTML and still different
     on every visit. The reduced-motion branch is the same argument: the media
     query cannot be read on the server either. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.matchMedia(REDUCED_QUERY).matches) {
      // Not "pause it": take the sources away so the transfer is aborted.
      setArmed([]);
      return;
    }

    // An element that failed before React attached its handlers is already
    // broken, and there is no error event left to tell us.
    if (videoRefs.current[0]?.error) brokenRef.current.add(0);

    const choices = slides
      .map((_, i) => i)
      .filter((i) => !brokenRef.current.has(i));
    if (choices.length === 0) return;
    const pick = choices[Math.floor(Math.random() * choices.length)];

    setIndex(pick);
    // The server's slide is already fetching. Keep it when it is the slide
    // that plays next anyway, and abort it when it is not.
    setArmed(pick !== 0 && nextIndex(pick) === 0 ? [pick, 0] : [pick]);
    // `slides` is stable for the life of the page: it comes from props that
    // are fixed at render. It is listed so the rule stays satisfied, not
    // because this is expected to run twice.
  }, [slides, nextIndex]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* The OS setting can change while the page is open, so honour it live.
     Turning it on takes the sources away; turning it off gives the current
     slide its sources back and the play effect below starts it. */
  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY);
    const apply = () => {
      if (query.matches) setArmed([]);
      else setArmed((a) => (a.length > 0 ? a : [indexRef.current]));
    };
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  /* ARMING. React has just added or removed this element's `<source>`
     children; `load()` is what makes the element act on it. Only elements
     whose armed state actually changed are touched, so the slide that was
     already loading is never restarted. */
  useEffect(() => {
    const was = armedRef.current;
    armedRef.current = armed;
    for (let i = 0; i < count; i++) {
      const video = videoRefs.current[i];
      if (!video) continue;
      const now = armed.includes(i);
      if (now === was.includes(i)) continue;
      if (!now) {
        // Clearing the property as well matters: the browser re-reads
        // `autoplay` on every load, so a bfcache restore or a return to the
        // tab would otherwise start a slide we deliberately disarmed.
        video.autoplay = false;
      }
      video.load();
      // `load()` has just reset the rate to the element's default, so the
      // slide's own speed is written back on the other side of it.
      applyRate(video, i);
    }
  }, [armed, count, applyRate]);

  /* PLAY THE ACTIVE SLIDE, and put the others back to their first frame.
     The reset waits for the cover to finish: the outgoing clip is still on
     screen underneath for the length of the fade, and rewinding it while it
     is visible would be a jump cut in the middle of the change. */
  useEffect(() => {
    const active = videoRefs.current[index];
    const reduce = window.matchMedia(REDUCED_QUERY).matches;
    if (active && armed.includes(index) && !reduce) {
      applyRate(active, index);
      active.autoplay = true;
      void active.play().catch(() => {
        // Refused. The poster is already on screen and stays there.
      });
    }

    const id = window.setTimeout(() => {
      for (let i = 0; i < count; i++) {
        if (i === index) continue;
        const video = videoRefs.current[i];
        if (!video || video.readyState === 0) continue;
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          // Seeking before the browser has any data throws in some
          // browsers. Nothing has played in that case, so there is nothing
          // to rewind.
        }
      }
      // Comfortably past the moment the closed layer blinks out at
      // SHOT_MS + 80, so a dropped frame cannot let the rewind show.
    }, SHOT_MS + 240);
    return () => window.clearTimeout(id);
  }, [index, armed, count, applyRate]);

  /* THE WORDS. Out, swap, in.
     `copyVisible` is DERIVED and not stored: the words are visible exactly
     when the slide being shown is the slide that is playing, so a second
     piece of state would only be a copy of that comparison that could drift
     from it. It also means this effect never sets state synchronously; all
     it does is schedule `shown` to catch up once the outgoing words have
     gone. `shown` is in the dependency list because the effect settles by
     making the two equal, and the run that finds them equal is the one that
     stops it. */
  const copyVisible = index === shown;

  useEffect(() => {
    if (index === shown) return;
    const id = window.setTimeout(() => setShown(index), COPY_OUT_MS);
    return () => window.clearTimeout(id);
  }, [index, shown]);

  /* THE PROGRESS LINE, driven off the clip itself rather than off a timer.
     `currentTime / duration` is the one number that cannot drift from what
     the viewer is watching: it already accounts for the playback rate, for
     buffering, for a stall on a slow line and for a tab that was in the
     background. A CSS animation of a fixed length would have to guess at all
     four and would be wrong about each of them.

     `scaleX` from a left origin, so the browser can keep this on the
     compositor and no frame of it costs a layout. rAF stops itself when the
     tab is hidden, which is exactly when the video stops too. */
  useEffect(() => {
    const fill = progressRef.current;
    if (!fill) return;
    if (count < 2 || reduced) return;

    let raf = 0;
    const tick = () => {
      const video = videoRefs.current[indexRef.current];
      const duration = video?.duration ?? 0;
      const progress =
        video && Number.isFinite(duration) && duration > 0
          ? Math.min(1, Math.max(0, video.currentTime / duration))
          : 0;
      fill.style.transform = `scaleX(${progress})`;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [count, reduced]);

  /** The clip finished. Hand over to the next one that works.
   *
   *  When there is nothing to hand over to, because this is the only slide
   *  or because every other one has failed, the clip starts again: the
   *  playlist is then this single clip, and a single clip is a loop. That is
   *  the only place `loop` behaviour survives, and it is deliberately here
   *  in JavaScript rather than on the element, so it cannot fire while the
   *  playlist has somewhere else to go. */
  const onEnded = (i: number) => () => {
    if (i !== indexRef.current) return;
    const next = nextIndex(i);
    if (next !== i) {
      setIndex(next);
      return;
    }
    const video = videoRefs.current[i];
    if (!video) return;
    try {
      video.currentTime = 0;
    } catch {
      // No data to seek in. Nothing has played, so nothing to rewind.
    }
    void video.play().catch(() => {});
  };

  /** The clip is running, so the next one can start filling its buffer. */
  const onPlaying = (i: number) => () => {
    applyRate(videoRefs.current[i], i);
    if (i !== indexRef.current) return;
    const next = nextIndex(i);
    if (next === i) return;
    setArmed((a) => (a.includes(next) ? a : [...a, next]));
  };

  /** The media failed: an unsupported container, a decode that gave up, a
   *  file that is not there. Take the slide out of the rotation, and move
   *  on if it was the one on screen, because a failed element never fires
   *  `ended` and would hold the playlist for good. */
  const onError = (i: number) => () => {
    // A slide we have just disarmed reports that it has no source. That is
    // what we asked for, not a failure.
    if (!armedRef.current.includes(i)) return;
    brokenRef.current.add(i);
    if (i !== indexRef.current) return;
    const next = nextIndex(i);
    if (next !== i) setIndex(next);
  };

  /* The CMS list and the dictionary list can be different lengths, and the
     index survives a swap between them, so the words are clamped on read.
     `index` itself only ever moves through `nextIndex`, which is modulo the
     current count, so the picture cannot point past the end. */
  const words = slides[shown] ?? slides[0];

  return (
    <section className="relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden">
      {/* A <style> element renders nothing and takes no grid cell. Its child
          is a static module constant, never content from the dictionary or
          the CMS. */}
      <style>{HERO_CSS}</style>

      {/* 1. The footage, one layer per slide, each carrying the wash
             measured for it so the picture and its ground cross together.
             Decoration, not content: it carries no meaning the copy does
             not already carry, so the whole stack is hidden from assistive
             technology and taken out of the tab order. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            data-open={i === index}
            className="pc-hero-shot absolute inset-0"
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              /* EVERY SLIDE ALWAYS CARRIES ITS POSTER, armed or not. It is
                 tempting to fetch a still only for the slide that is
                 playing, but a layer with neither sources nor a poster
                 paints as a black rectangle, and there are two moments when
                 a layer has no sources and is still on screen: the outgoing
                 clip during the 700ms of a change, and the whole hero under
                 reduced motion. A poster is a few tens of kilobytes against
                 a clip's megabyte and a half, and it is exactly the picture
                 a visitor on a slow line sits looking at, so every slide
                 keeps one. The rule about not preloading is about the
                 clips. */
              poster={slide.poster}
              autoPlay={i === index && armed.includes(i)}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              tabIndex={-1}
              onEnded={onEnded(i)}
              onPlaying={onPlaying(i)}
              onError={onError(i)}
            >
              {armed.includes(i) ? (
                <>
                  {/* mp4 FIRST. See the note at the top of the file. */}
                  <source src={slide.mp4} type="video/mp4" />
                  {slide.webm ? (
                    <source src={slide.webm} type="video/webm" />
                  ) : null}
                </>
              ) : null}
            </video>
            <div
              className="absolute inset-0"
              style={{ background: wash(slide) }}
            />
          </div>
        ))}
      </div>

      {/* 2. The column ruling, carried across the hero so the grid that
             aligns the page is visible from the first screen. */}
      <div aria-hidden="true" className="pc-ruled-dark absolute inset-0 z-10" />

      {/* THE LINE ALONG THE FOOT, showing how much of this clip is left and
          so how long until the next one. One hairline, not a bar: it sits on
          the bottom edge of the footage where the heavy end of the wash
          already is, so white reads against it without needing weight.

          Two layers, because a fill with no track behind it reads as a
          scratch on the picture rather than as a measure of anything: the
          track is white at 0.18, the fill at 0.75, and neither is ember,
          because ember is a hover colour and nothing here is hoverable.

          It is drawn only when there is somewhere to go. With one slide the
          playlist is a single clip on repeat and a progress line would be
          counting down to itself, and under reduced motion nothing advances
          at all, so in both cases the line is simply not rendered. Hidden
          from assistive technology: it is a picture of the timer, and the
          timer is decoration. */}
      {count > 1 && !reduced && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-30 h-px bg-white/[0.18]"
        >
          {/* THE STARTING STATE IS AN INLINE `transform`, AND `scale-x-0`
              WOULD BREAK IT. Tailwind 4 compiles its scale utilities to the
              standalone `scale` property, not to `transform`, and the two
              COMPOSE: the class would leave `scale: 0 1` on the element for
              good, so every `transform: scaleX(p)` the loop wrote would be
              multiplied by zero and the line would never appear at all. It
              looks right in the markup and renders nothing, which is the
              worst kind of wrong. One property, written from one place. */}
          <div
            ref={progressRef}
            style={{ transform: "scaleX(0)" }}
            className="h-full w-full origin-left bg-white/75"
          />
        </div>
      )}

      {/* 3. The content. `relative` lifts it clear of the two stacks. */}
      <div className="pc-shell relative z-20 pb-24 md:pb-[104px]">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-8">
            {/* The entrance sits on the block and the crossfade on its two
                children, which is the only order that works: `[data-rise]`
                fills `both`, so an entrance on the headline itself would
                hold its opacity at 1 for the life of the page. */}
            <div
              data-rise="0"
              className="pc-hero-copy"
              data-visible={copyVisible}
            >
              <h1 className="text-heading-xl text-white">{words.headline}</h1>
              <p className="mt-5 text-[1.125rem] text-mist">{words.subline}</p>
            </div>
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
