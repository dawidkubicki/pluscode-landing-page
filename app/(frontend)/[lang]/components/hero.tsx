"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Parallax } from "./motion";
import { Plus, Pill } from "./ui";
import { Visual } from "./visual";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const EASE = [0.16, 1, 0.3, 1] as const;

type Featured = {
  name: string;
  role: string | null;
  photo: { url: string; alt: string } | null;
} | null;

/** Cycles through the hero's rotating words. */
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % words.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span className="relative inline-block align-top text-lime">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ opacity: 0, y: "0.4em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-0.4em" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ContactCard({
  featured,
  dict,
  whatsappUrl,
  telUrl,
}: {
  featured: Featured;
  dict: Dictionary["hero"];
  whatsappUrl: string;
  telUrl: string;
}) {
  const name = featured?.name ?? dict.fallbackName;
  const role = featured?.role ?? dict.fallbackRole;
  const firstName = name.split(" ")[0];

  return (
    <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-3xl">
      {featured?.photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.photo.url}
            alt={featured.photo.alt}
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        </>
      ) : (
        <Visual kind="portrait" className="absolute inset-0 -z-10" />
      )}
      <div className="absolute inset-x-4 bottom-4">
        <div className="rounded-2xl border border-white/10 bg-night/70 p-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bone">{name}</p>
              {role && (
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-bone-soft">
                  {role}
                </p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1.5">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-lime" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lime">
                {dict.online}
              </span>
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-lime px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-lime-deep"
            >
              <WhatsAppIcon className="size-4" />
              {dict.talkTo} {firstName}
            </a>
            <a
              href={telUrl}
              aria-label={`${dict.call} ${name}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:bg-white/10"
            >
              <PhoneIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({
  dict,
  featured,
  whatsappUrl,
  telUrl,
}: {
  dict: Dictionary["hero"];
  featured: Featured;
  whatsappUrl: string;
  telUrl: string;
}) {
  return (
    <section id="top" className="px-2 pb-2 pt-[5.5rem] sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night text-bone">
        {/* ambient tech glow */}
        <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[34rem] rounded-full bg-lime/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex min-h-[92vh] flex-col p-6 sm:p-10 lg:p-14">
          {/* top row */}
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            >
              <Plus className="size-7" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="space-y-1 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-bone-soft"
            >
              {dict.tags.map((tag) => (
                <div key={tag}>{tag}</div>
              ))}
            </motion.div>
          </div>

          {/* parallax contact card — absolute on large screens */}
          <div className="pointer-events-none absolute right-6 top-1/2 hidden w-[28%] max-w-[360px] -translate-y-[40%] lg:right-14 lg:block">
            <Parallax amount={50} className="pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.5 }}
              >
                <ContactCard
                  featured={featured}
                  dict={dict}
                  whatsappUrl={whatsappUrl}
                  telUrl={telUrl}
                />
              </motion.div>
            </Parallax>
          </div>

          {/* bottom content */}
          <div className="mt-auto max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
              className="max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight text-bone sm:text-4xl"
            >
              {dict.headlineStart.split(dict.headlineHighlight).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-lime">{dict.headlineHighlight}</span>
                  )}
                </span>
              ))}{" "}
              <RotatingWord words={dict.rotatingWords} />
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.55 }}
              className="display mt-6 flex items-start text-bone"
              style={{ fontSize: "clamp(3rem, 13vw, 12rem)" }}
            >
              Pluscode
              <span className="mt-[0.18em] text-[0.32em] font-bold text-lime">
                +
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Pill variant="lime" href="/contact">
                {dict.ctaPrimary}
              </Pill>
              <Pill variant="outline" href="#services" withArrow={false}>
                {dict.ctaSecondary}
              </Pill>
            </motion.div>
          </div>

          {/* contact card in flow on small screens */}
          <div className="mt-12 w-full max-w-[20rem] lg:hidden">
            <ContactCard
              featured={featured}
              dict={dict}
              whatsappUrl={whatsappUrl}
              telUrl={telUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
