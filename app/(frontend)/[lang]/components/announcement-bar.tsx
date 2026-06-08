"use client";

import { useEffect, useState } from "react";
import LocaleLink from "./locale-link";
import { Arrow } from "./ui";

type Announcement = {
  text: string;
  linkText: string | null;
  linkUrl: string | null;
};

/** A unique-ish key so dismissing one announcement doesn't hide a future one. */
function storageKey(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return `pc-announcement-${hash}`;
}

/**
 * Slim, dismissible banner pinned to the very top (z above the header). The
 * header reserves space for it via its `offset` prop; once dismissed it simply
 * hides, leaving a harmless transparent gap over the dark hero.
 */
export default function AnnouncementBar({
  announcement,
}: {
  announcement: Announcement;
}) {
  const key = storageKey(announcement.text);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync dismissed state from localStorage (client-only)
      if (localStorage.getItem(key) === "dismissed") setOpen(false);
    } catch {
      /* ignore */
    }
  }, [key]);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(key, "dismissed");
    } catch {
      /* ignore */
    }
  };

  const { text, linkText, linkUrl } = announcement;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center bg-night text-bone">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-center gap-3 px-5 sm:px-8">
        <span className="flex items-center gap-2 truncate text-[13px]">
          <span className="hidden size-1.5 shrink-0 rounded-full bg-lime sm:inline-block" />
          <span className="truncate text-bone/90">{text}</span>
          {linkText && linkUrl && (
            <LocaleLink
              href={linkUrl}
              className="group ml-1 inline-flex shrink-0 items-center gap-1 font-medium text-lime transition-colors hover:text-bone"
            >
              {linkText}
              <Arrow className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </LocaleLink>
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 flex size-7 items-center justify-center rounded-full text-bone-soft transition-colors hover:bg-white/10 hover:text-bone"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
