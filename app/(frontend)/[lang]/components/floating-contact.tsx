"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Slower, rarer pulse than Tailwind's 1s default. */
const PULSE = { animationDuration: "2.6s" } as const;

type Photo = { url: string; alt: string } | null;

function Avatar({ photo, initials }: { photo: Photo; initials: string }) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.url}
        alt={photo.alt}
        className="size-full object-cover object-top"
      />
    );
  }
  return (
    <span className="flex size-full items-center justify-center bg-gradient-to-br from-lime/40 to-night-soft text-sm font-semibold text-bone">
      {initials}
    </span>
  );
}

/** Pulsing "online" indicator dot. */
function OnlineDot({ size = "size-2.5" }: { size?: string }) {
  return (
    <span className={`relative flex ${size}`}>
      <span
        className={`absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70`}
        style={PULSE}
      />
      <span className={`relative inline-flex ${size} rounded-full bg-lime`} />
    </span>
  );
}

/**
 * Floating chat-style contact widget. Slides in once the visitor scrolls past
 * the hero, showing the featured person's avatar with an online indicator; tap
 * to expand a card offering WhatsApp or a phone call. Shown on every page.
 */
export default function FloatingContact({
  dict,
  name,
  role,
  photo,
  whatsappUrl,
  telUrl,
}: {
  dict: Dictionary["hero"];
  name: string;
  role: string | null;
  photo: Photo;
  whatsappUrl: string;
  telUrl: string;
}) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Reveal after the hero has scrolled away.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the popup when clicking anywhere outside it, or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstName = name.split(" ")[0];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3"
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="w-64 origin-bottom-right rounded-2xl border border-night-line bg-night/95 p-4 text-bone shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md"
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 overflow-hidden rounded-full border border-lime/40">
                    <Avatar photo={photo} initials={initials} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bone">
                      {name}
                    </p>
                    {role && (
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-bone-soft">
                        {role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <OnlineDot size="size-2" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lime">
                    {dict.online}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-lime px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-lime-deep"
                  >
                    <WhatsAppIcon className="size-4" />
                    {dict.talkTo} {firstName}
                  </a>
                  <a
                    href={telUrl}
                    aria-label={`${dict.call} ${name}`}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:bg-white/10"
                  >
                    <PhoneIcon className="size-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`${dict.talkTo} ${firstName}`}
            aria-expanded={open}
            className="group relative flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-lime/60 bg-night shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:scale-105"
          >
            {/* avatar is clipped to the circle, the dot is not */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <Avatar photo={photo} initials={initials} />
            </span>
            <span className="absolute bottom-0 right-0 z-10 flex size-3.5 items-center justify-center rounded-full bg-night ring-1 ring-night">
              <OnlineDot size="size-2.5" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
