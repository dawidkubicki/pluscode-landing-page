"use client";

import { motion } from "framer-motion";
import { Arrow } from "./ui";
import GradientCanvas from "./gradient-canvas";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { TrustLogo } from "@/lib/trust";

const EASE = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/** Optional hero background media. */
export type HeroMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

/**
 * To give the hero a background image or video, set this to a file in `/public`
 * (e.g. `{ type: "image", src: "/hero/bg.jpg" }` or
 * `{ type: "video", src: "/hero/bg.mp4", poster: "/hero/bg.jpg" }`). The navy
 * gradient + blueprint overlay stay on top so the headline remains readable.
 * Leave as `null` for the animated gradient look.
 */
const HERO_MEDIA: HeroMedia | null = null;

export default function Hero({
  dict,
  trust,
  logos = [],
  media = HERO_MEDIA,
}: {
  dict: Dictionary["hero"];
  trust: Dictionary["trust"];
  /** CMS logos for the trust strip; falls back to `trust.clients` text. */
  logos?: TrustLogo[];
  media?: HeroMedia | null;
}) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-night text-bone"
    >
      {media && (
        <div className="absolute inset-0 -z-30">
          {media.type === "video" ? (
            <video
              className="size-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={media.poster}
              src={media.src}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="size-full object-cover"
              src={media.src}
              alt={media.alt ?? ""}
            />
          )}
          {/* Gradient overlay keeps the headline readable over any media */}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,25,41,0.94)_0%,rgba(10,25,41,0.78)_46%,rgba(10,25,41,0.6)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        </div>
      )}
      {media ? (
        <div className="absolute -right-44 -top-44 -z-10 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,rgba(16,185,129,0)_65%)]" />
      ) : (
        // Animated WebGL gradient (opaque navy base), so it only renders when
        // no background media is set — it would fully cover the media layer.
        <GradientCanvas className="absolute inset-0 -z-20 size-full" />
      )}

      {/* main content fills the viewport; stats bar sits on the fold */}
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-5 pb-10 pt-32 sm:px-10">
        <motion.div {...rise(0.1)} className="mb-8 flex items-center gap-2.5 sm:mb-9">
          <span className="inline-block size-2 rounded-full bg-lime animate-pulse-dot" />
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone-dim sm:text-[13px]">
            {dict.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.2)}
          className="display max-w-[980px] text-balance text-5xl sm:text-6xl lg:text-[5rem]"
        >
          {dict.headlineStart}{" "}
          <em className="not-italic text-lime-soft">{dict.headlineEm}</em>
          {dict.headlineEnd}
        </motion.h1>

        <motion.p
          {...rise(0.3)}
          className="mt-7 max-w-[580px] text-lg leading-[1.65] text-bone sm:text-[19px]"
        >
          {dict.subtext}
        </motion.p>

        <motion.div {...rise(0.4)} className="mt-11 flex flex-wrap items-center gap-5">
          <LocaleLink
            href="/book-a-call"
            className="group inline-flex items-center gap-3 rounded-[2px] bg-lime px-[30px] py-4 text-[15.5px] font-semibold text-night transition-colors hover:bg-lime-bright"
          >
            {dict.ctaPrimary}
            <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
          </LocaleLink>
        </motion.div>

        {/* Minimal social-proof strip, folded into the hero */}
        <motion.div {...rise(0.55)} className="mt-14 sm:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone">
            {trust.label}
          </p>
          {logos.length > 0 ? (
            <ul className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-5 sm:gap-x-12">
              {logos.map((l) => (
                <li key={l.id}>
                  {/* brightness-0 + invert renders any logo color as white */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.logo.url}
                    alt={l.logo.alt || l.name}
                    loading="lazy"
                    className="h-6 w-auto opacity-60 brightness-0 invert transition-opacity hover:opacity-90 sm:h-7"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2.5 sm:gap-x-10">
              {trust.clients.map((client) => (
                <li
                  key={client}
                  className="text-[15px] font-medium text-bone/50 transition-colors hover:text-bone/80 sm:text-base"
                >
                  {client}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
