"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Root smooth-scroll provider.
 *
 * Lenis drives the real window scroll position (it sets scrollTop), so
 * framer-motion's `useScroll` keeps working for parallax/scroll-linked
 * animations without extra wiring.
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
    </ReactLenis>
  );
}
