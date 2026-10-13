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

/** The site's easing curve, `--ease-out`, in framer's array form. */
const EASE = [0.165, 0.84, 0.44, 1] as const;

/** A few pixels of travel under a fade. */
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
 * choice, and the footer's "Manage Cookie Consent" control brings it back.
 *
 * A small square white card on one hairline, no shadow: bottom left from
 * 640px up, the full width of the screen on a phone. It sits under the header
 * (z-50), and the menu and the biography dialogs open in the top layer, so
 * they cover it.
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
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-grey-mid bg-white p-5 outline-none sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[23rem] sm:border"
          initial={{ opacity: 0, y: RISE }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: RISE }}
          transition={{ duration: 0.24, ease: EASE }}
        >
          <h2 id="pc-cookies-title" className="text-body font-medium text-ink">
            {dict.title}
          </h2>
          <p id="pc-cookies-text" className="mt-1.5 text-small text-grey">
            {dict.text}
          </p>
          <p className="mt-2.5 text-small text-ink">
            <LocaleLink href="/privacy-policy#cookies" className="pc-link">
              {privacyLabel}
            </LocaleLink>
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="pc-btn min-h-11 flex-1 cursor-pointer justify-center px-4 text-small"
            >
              {dict.reject}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="pc-btn pc-btn--solid min-h-11 flex-1 cursor-pointer justify-center px-4 text-small"
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
