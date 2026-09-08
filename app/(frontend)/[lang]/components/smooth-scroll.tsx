"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import ScrollReset from "./scroll-reset";

/**
 * Root smooth-scroll provider.
 *
 * Lenis drives the real window scroll position (it sets scrollTop), so
 * framer-motion's `useScroll` keeps working for parallax/scroll-linked
 * animations without extra wiring.
 *
 * Owning the window scroll is also what makes ScrollReset necessary, and
 * why it is rendered AFTER the page rather than before it: Lenis carries
 * an animation across a route change and writes the old offset back over
 * the position Next just set, and the correction has to land after the
 * page's own scroll handling in the same commit. The whole account is in
 * scroll-reset.tsx; the order of these two children is load-bearing.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.25,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        anchors: { offset: -96 },
      }}
    >
      {children}
      <ScrollReset />
    </ReactLenis>
  );
}
