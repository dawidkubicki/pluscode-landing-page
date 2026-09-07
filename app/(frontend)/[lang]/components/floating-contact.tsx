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
        className="size-full object-cover object-center [filter:grayscale(1)_contrast(1.02)]"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <span className="flex size-full items-center justify-center bg-cream-surface text-sm font-semibold text-ink-soft">
      {initials}
    </span>
  );
}

/**
 * Availability dot. The green is a status signal, not leftover brand colour:
 * green means "available" everywhere on the web, so rendering it in the page
 * accent would read as decoration and lose the meaning. It is 10px, it appears
 * once, and it is the only non-accent colour on the page.
 */
function OnlineDot({
  size = "size-2.5",
  ring = "",
}: {
  size?: string;
  /** Separating halo, used where the dot sits on top of a photograph. */
  ring?: string;
}) {
  return (
    <span className={`relative flex ${size}`}>
      <span
        className="absolute inline-flex size-full animate-ping rounded-full bg-status-online/30"
        style={PULSE}
      />
      <span
        className={`relative inline-flex ${size} rounded-full bg-status-online ${ring}`}
      />
    </span>
  );
}

/**
 * Floating chat-style contact widget. Slides in once the visitor scrolls past
 * the hero, showing the contact person's face with an online indicator; tap to
 * expand a card offering WhatsApp or a phone call. Shown on every page.
 *
 * The bubble is a surface-coloured circle with a hairline ring, never a coloured border:
 * the accent never encircles a face, and a 2px ring around one reads as a badge.
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

  // `talkToName` holds the whole phrase already inflected, because the
  // "{talkTo} {firstName}" concatenation puts the Polish name in the wrong
  // case ("Napisz do Krzysztof" instead of "Napisz do Krzysztofa"). The
  // concatenation stays as the fallback only.
  const talkToLabel = dict.talkToName || `${dict.talkTo} ${firstName}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8"
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="w-72 origin-bottom-right rounded-2xl bg-cream-surface/95 p-4 shadow-[0_2px_6px_rgba(0,0,0,0.35),0_28px_56px_-20px_rgba(0,0,0,0.7)] ring-1 ring-cream-line-strong backdrop-blur-xl"
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 overflow-hidden rounded-full bg-photo-ground ring-1 ring-white/10">
                    <Avatar photo={photo} initials={initials} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold text-ink">
                      {name}
                    </p>
                    {role && (
                      <p className="truncate text-[12.5px] text-ink-mute">
                        {role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <OnlineDot size="size-2" />
                  <span className="text-[12px] text-ink-mute">
                    {dict.online}
                  </span>
                </div>
                {dict.replyTime && (
                  <p className="mt-1 text-[12px] text-ink-mute">
                    {dict.replyTime}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1"
                  >
                    <WhatsAppIcon className="size-4" />
                    {talkToLabel}
                  </a>
                  <a
                    href={telUrl}
                    aria-label={`${dict.call} ${name}`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft ring-1 ring-cream-line transition-colors duration-300 ease-io-attio hover:bg-cream-surface hover:text-ink hover:duration-50 max-lg:size-[46px] max-lg:rounded-xl"
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
            aria-label={talkToLabel}
            aria-expanded={open}
            className="relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-cream-surface shadow-[0_1px_2px_rgba(0,0,0,0.4),0_14px_32px_-14px_rgba(0,0,0,0.8)] ring-1 ring-cream-line-strong transition-[transform,box-shadow] duration-200 ease-out-expo hover:scale-[1.04] hover:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_18px_40px_-14px_rgba(0,0,0,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            {/* avatar is clipped to the circle, the dot is not */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <Avatar photo={photo} initials={initials} />
            </span>
            <span className="absolute bottom-0.5 right-0.5 z-10">
              <OnlineDot ring="ring-2 ring-cream-surface" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
