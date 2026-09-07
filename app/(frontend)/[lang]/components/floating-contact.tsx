"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The site's one easing curve, `--ease-io-attio`, in framer's array form. */
const EASE = [0.2, 0, 0, 1] as const;

/** A few pixels of travel under a fade. Nothing springs and nothing scales. */
const RISE = 6;

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
  // No colour of its own: the initials take the text colour of whichever
  // ground they land on, so the same fallback serves the ink launcher and the
  // white card.
  return (
    <span className="flex size-full items-center justify-center text-[1rem]">
      {initials}
    </span>
  );
}

/**
 * Availability mark. The green is a status signal, not leftover brand colour:
 * green means "available" everywhere on the web, and the palette has no accent
 * to confuse it with. It is an 8px dot, it appears twice, and it is the only
 * colour on the widget.
 *
 * There is no pulse and no halo. The pulse was a ping animation, and the halo
 * was a decorative ring; on the launcher the mark sits on a photograph that is
 * rendered greyscale, so a saturated green separates from it on its own.
 */
function OnlineDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block size-2.5 rounded-full border-2 border-paper bg-status-online ${className}`}
      // The radius is inline, not left to the class. globals.css carries an
      // UNLAYERED `.rounded-full { border-radius: 0 }` that squares the whole
      // site off, and an unlayered author rule beats every utility; only an
      // inline style outranks it. The class stays for intent, this is what
      // actually rounds the dot. Same on the avatar and the launcher below.
      style={{ borderRadius: "9999px" }}
    />
  );
}

/**
 * Floating chat-style contact widget. Fades in once the visitor scrolls past
 * the hero, showing the contact person's face with an availability mark; tap to
 * expand a card offering WhatsApp or a phone call. Shown on every page.
 *
 * The reference design has no floating widget at all, so this one is built to
 * be ignorable: a square white card on a single hairline, no shadow, no blur
 * and no scaling. Every separation here is either a rule or a change of ground.
 *
 * The ONE exception to the site's square geometry is the face: the launcher,
 * the avatar inside the card and the status mark are round, because a portrait
 * badge is read as a person rather than as a tile. Nothing else here rounds.
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
          initial={{ opacity: 0, y: RISE }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: RISE }}
          transition={{ duration: 0.24, ease: EASE }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="w-72 border border-rule bg-white p-4"
                initial={{ opacity: 0, y: RISE }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: RISE }}
                transition={{ duration: 0.16, ease: EASE }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-11 shrink-0 overflow-hidden rounded-full bg-paper-dim text-ink"
                    // Inline radius for the reason given on OnlineDot: the
                    // class alone is flattened by an unlayered rule in
                    // globals.css. `overflow-hidden` clips the photo to it.
                    style={{ borderRadius: "9999px" }}
                  >
                    <Avatar photo={photo} initials={initials} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[1.125rem] text-ink">{name}</p>
                    {role && (
                      <p className="truncate text-[1rem] text-moss">{role}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <OnlineDot />
                  <span className="text-[1rem] text-moss">{dict.online}</span>
                </div>
                {dict.replyTime && (
                  <p className="mt-1 text-[1rem] text-moss">{dict.replyTime}</p>
                )}

                {/* Both actions are the same quiet outline button and both are
                    44px tall, so the row has no primary and no odd height. */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 border border-rule px-3 text-[1rem] text-moss transition-colors duration-300 ease-io-attio hover:bg-paper-dim hover:text-ink hover:duration-50"
                  >
                    <WhatsAppIcon className="size-4 shrink-0" />
                    <span className="truncate">{talkToLabel}</span>
                  </a>
                  <a
                    href={telUrl}
                    aria-label={`${dict.call} ${name}`}
                    className="flex size-11 shrink-0 items-center justify-center border border-rule text-moss transition-colors duration-300 ease-io-attio hover:bg-paper-dim hover:text-ink hover:duration-50"
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
            // 56px circle. The ink ground is what the visitor sees while the
            // photograph loads and what stands in for it when there is none,
            // which is also the only state where the hover step to deep green
            // is visible: a full-bleed portrait covers it.
            className="relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 ease-io-attio hover:bg-deep hover:duration-50"
            // Inline radius for the reason given on OnlineDot.
            style={{ borderRadius: "9999px" }}
          >
            <span
              className="absolute inset-0 overflow-hidden rounded-full"
              // The clipping layer needs the radius too, or the square photo
              // corners cover the round button underneath. Inline for the same
              // reason as the button.
              style={{ borderRadius: "9999px" }}
            >
              <Avatar photo={photo} initials={initials} />
            </span>
            {/* ON the rim, deliberately, like every chat app's presence badge.
                The launcher is a 56px circle; the rim at 45 degrees is 19.8px
                from the centre on each axis, so a 10px badge centred there
                spans 42.8 to 52.8px and a 3px inset puts it half on the photo
                and half outside it. The 2px ring in the page ground is what
                separates it from the photo so it reads as a badge, not as a
                mark on the picture. An earlier version sat it fully inside,
                which Dawid read as a dot painted on the image. */}
            <OnlineDot className="absolute bottom-[3px] right-[3px] z-10" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
