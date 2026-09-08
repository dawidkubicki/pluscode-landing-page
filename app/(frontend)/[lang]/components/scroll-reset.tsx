"use client";

/* ------------------------------------------------------------------ *
 *  OPENING A NEW PAGE AT ITS TOP
 *
 *  WHY THIS EXISTS. Lenis keeps its own copy of the scroll position and
 *  writes it into the document on every frame of an animation it has in
 *  flight. Every wheel tick starts one, and at `duration: 1.25` it keeps
 *  running for well over a second after the reader stops pushing. Click
 *  a link inside that second, which is precisely what happens when you
 *  scroll down to a link and then press it, and the animation is still
 *  alive when the new route commits. Next puts the document back to the
 *  top in a layout effect at that moment, and the surviving animation
 *  writes the OLD offset straight back over it on its next frame: the
 *  new page opens part way down. Whether it wins depends on how much of
 *  the 1.25s was left when the route committed, which is why the bug
 *  shows up only sometimes.
 *
 *  Lenis writes NOTHING while it is idle (its Animate.advance returns
 *  early when no animation is running), so ending the in-flight one at
 *  the route change is the whole of the fix. `scrollTo(y, { immediate:
 *  true })` is how: one call stops the animation and sets Lenis's own
 *  value, with no motion of its own, under prefers-reduced-motion or
 *  not. `force: true` because the header stops Lenis while the
 *  fullscreen menu is open and a stopped instance drops scrollTo on the
 *  floor, and every link in that menu is a navigation.
 *
 *  WHY IT IS RENDERED LAST IN THE PROVIDER. smooth-scroll.tsx puts this
 *  after {children} so that its layout effect runs after the page's own,
 *  which is where Next does its scrolling. Running first would be worse
 *  than useless: `immediate` makes Lenis ignore the next native scroll
 *  event, on the assumption that the event is its own write coming back,
 *  so it would swallow the reset Next is about to make and keep the old
 *  offset as its idea of where the page is. The document would sit at
 *  the top and the first wheel tick would teleport the reader back down
 *  to where they had been on the previous page.
 *
 *  WHAT MUST NOT BE PULLED TO THE TOP. Two things: an in-page anchor
 *  (/quanty#in-the-box has to land on that section) and a browser back
 *  or forward (the reader expects the position they left, and Next hands
 *  that to the browser's own scroll restoration rather than scrolling
 *  itself). Neither is visible from `usePathname`, so
 *    - back and forward are read from `popstate`, which the browser
 *      fires before the router starts the transition;
 *    - the hash is read from `window.location` in a microtask, because
 *      the router writes the new URL in a passive effect of its own and
 *      that effect belongs to a component above this one, so it runs
 *      after this one does. A microtask queued here runs after the whole
 *      passive flush, and still before the frame is painted.
 *  When either applies, or when the URL has not caught up and so cannot
 *  be read at all, we take Next's word for the position and only make
 *  Lenis agree with the document. That is the least-bad fallback rather
 *  than a guess: Next is right about all of these cases as long as Lenis
 *  is not fighting it, and stopping that fight is this file's real job.
 *
 *  The four cases, then. A plain link: Next scrolls to 0, we end the
 *  inertia and put both it and the document at 0 again. A link carrying
 *  a hash: Next scrolls the section into view, we end the inertia and
 *  leave the offset where Next put it. Back or forward: the browser
 *  restores, we end the inertia and leave the offset alone. A cold load,
 *  with a hash or without: nothing here runs, because there is no path
 *  navigated from, and the browser places the page itself. With
 *  JavaScript off none of this exists and every navigation is a real
 *  document load, which the browser has always got right.
 * ------------------------------------------------------------------ */

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";

/**
 * Hand Lenis the document's real position and end anything it has in
 * flight. A no-op when it already agrees, so it is safe to call twice.
 */
function syncToDocument(lenis: Lenis | undefined) {
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

export default function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previousPath = useRef<string | null>(null);
  const navigated = useRef(false);
  const traversed = useRef(false);

  /* The flag is cleared by the route change that consumes it and by any
     click, because a click is the opening of a fresh navigation and a
     traversal never involves one. Without that second clear, a back that
     changed only the hash (no route change to consume it) would leave the
     flag standing over the next real navigation. */
  useEffect(() => {
    const onPopState = () => {
      traversed.current = true;
    };
    const onClick = () => {
      traversed.current = false;
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  /* Pass one, in the same commit phase Next scrolls in and after it: end
     the inertia before anything can be painted with it. */
  useLayoutEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;
    // A first render is not a navigation, and neither is the re-render
    // that arrives when the Lenis instance itself does.
    if (previous === null || previous === pathname) return;
    navigated.current = true;
    syncToDocument(lenis);
  }, [pathname, lenis]);

  /* Pass two, one microtask after the passive effects: the first moment
     `window.location` holds the URL we navigated TO, and so the first
     moment the hash can be read. */
  useEffect(() => {
    if (!navigated.current) return;
    navigated.current = false;
    const restoring = traversed.current;
    traversed.current = false;

    queueMicrotask(() => {
      const urlIsCurrent = window.location.pathname === pathname;
      if (restoring || !urlIsCurrent || window.location.hash) {
        syncToDocument(lenis);
        return;
      }
      lenis?.scrollTo(0, { immediate: true, force: true });
      // Lenis skips the call above when it already believes it is at 0,
      // so the document is told separately rather than trusting that it
      // was told. `scroll-behavior` is `auto` in globals.css, and both
      // routes to the top here are jumps, so nothing animates.
      window.scrollTo(0, 0);
    });
  }, [pathname, lenis]);

  return null;
}
