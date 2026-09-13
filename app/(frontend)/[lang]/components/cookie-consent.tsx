"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  CONSENT_KEY,
  CONSENT_OPEN_EVENT,
  type ConsentChoice,
} from "@/lib/consent";

/** The site's one easing curve, `--ease-io-attio`, in framer's array form. */
const EASE = [0.2, 0, 0, 1] as const;

/** A few pixels of travel under a fade, the same as the floating contact. */
const RISE = 6;

declare global {
  interface Window {
    /** Defined by the inline snippet in google-analytics.tsx. */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Expire every GA cookie a previous "Accept" left behind. Denying storage
 * stops GA writing new ones but does not remove the old. GA writes to the
 * widest domain it can (".pluscode.io"), and a cookie is only removed by a
 * write that names the same domain, so every suffix of the host is tried,
 * host-only included.
 */
function clearAnalyticsCookies() {
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  }
  for (const pair of document.cookie.split("; ")) {
    const name = pair.split("=")[0];
    if (!name.startsWith("_ga") && name !== "_gid") continue;
    for (const d of domains) {
      document.cookie = `${name}=; max-age=0; path=/${d}`;
    }
  }
}

/**
 * Cookie consent banner. It appears once, for a visitor who has made no
 * choice, and the footer's "Cookie settings" link brings it back.
 *
 * It is the floating contact's sibling in every respect but position: a
 * square white card on one hairline, no shadow, no blur, no scaling. It sits
 * bottom LEFT above 640px so it never covers the contact launcher in the
 * bottom right corner; on a phone it is full width and sits over the
 * launcher (z-45 against its z-40) until the visitor chooses, which is one
 * tap. It stays under the header (z-50), so the fullscreen Offerings menu
 * still covers it.
 *
 * Reject and Accept are the same size on the same row. The only difference is
 * the fill, because refusing must not be harder than agreeing.
 *
 * Nothing renders on the server. The stored choice lives in localStorage, so
 * the banner can only decide to show after mount, and a returning visitor
 * never sees it at all.
 */
export default function CookieConsent({
  dict,
  privacyLabel,
}: {
  dict: Dictionary["cookies"];
  privacyLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Set only when the footer reopens the banner: a keyboard user who asked
  // for it should land in it, a first-time visitor should not have focus
  // pulled away from the page.
  const focusOnOpen = useRef(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      /* ignore */
    }
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- client-only sync */
    if (stored !== "granted" && stored !== "denied") setOpen(true);

    const reopen = () => {
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      ref.current?.focus();
    }
  }, [open]);

  const choose = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* ignore */
    }
    // If gtag is not defined yet, the snippet has not run, and it reads the
    // choice just stored when it does.
    window.gtag?.("consent", "update", { analytics_storage: choice });
    if (choice === "denied") clearAnalyticsCookies();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="false"
          aria-labelledby="pc-cookies-title"
          aria-describedby="pc-cookies-text"
          tabIndex={-1}
          className="fixed inset-x-4 bottom-4 z-[45] border border-rule bg-white p-6 outline-none sm:inset-x-auto sm:bottom-8 sm:left-8 sm:w-[26rem]"
          initial={{ opacity: 0, y: RISE }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: RISE }}
          transition={{ duration: 0.24, ease: EASE }}
        >
          <h2
            id="pc-cookies-title"
            className="text-[1.125rem] leading-[1.375] text-ink"
          >
            {dict.title}
          </h2>
          <p
            id="pc-cookies-text"
            className="mt-2 text-[1rem] leading-[1.375] text-moss"
          >
            {dict.text}
          </p>
          {/* Its own line and in ink: `pc-link` only underlines on hover, so
              inside the moss sentence it would not read as a link at rest. */}
          <p className="mt-3 text-[1rem] leading-[1.375] text-ink">
            <LocaleLink href="/privacy-policy#cookies" className="pc-link">
              {privacyLabel}
            </LocaleLink>
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="btn btn-outline flex-1"
            >
              {dict.reject}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="btn btn-primary flex-1"
            >
              {dict.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The footer's way back into the banner, after a choice has hidden it. */
export function CookieSettingsLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {children}
    </button>
  );
}
