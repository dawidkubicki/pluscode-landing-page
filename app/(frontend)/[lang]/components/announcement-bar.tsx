"use client";

import { useLayoutEffect, useState } from "react";
import LocaleLink from "./locale-link";
import { Arrow } from "./ui";
import { announcementStorageKey } from "@/lib/announcement-key";

type Announcement = {
  text: string;
  linkText: string | null;
  linkUrl: string | null;
};

/**
 * Slim, dismissible banner pinned to the very top (z above the header).
 * Visibility is driven by the `data-announcement` attribute on <html> — set
 * pre-paint by a script in the layout on first load, then kept in sync here
 * (locale switches, dismissal) — so the
 * header offset and page padding always collapse together with the bar and no
 * empty strip is left above the nav.
 */
export default function AnnouncementBar({
  announcement,
}: {
  announcement: Announcement;
}) {
  const key = announcementStorageKey(announcement.text);
  const [open, setOpen] = useState(true);

  // Runs before paint, so on soft locale switches (where the pre-hydration
  // script in the layout doesn't re-run) the attribute still flips together
  // with the bar for the new locale's banner, with no flash either way.
  useLayoutEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(key) === "dismissed";
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync dismissed state from localStorage (client-only)
    setOpen(!dismissed);
    if (dismissed) {
      document.documentElement.removeAttribute("data-announcement");
    } else {
      document.documentElement.setAttribute("data-announcement", "");
    }
    return () => document.documentElement.removeAttribute("data-announcement");
  }, [key]);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    document.documentElement.removeAttribute("data-announcement");
    try {
      localStorage.setItem(key, "dismissed");
    } catch {
      /* ignore */
    }
  };

  const { text, linkText, linkUrl } = announcement;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] hidden h-10 items-center bg-night text-bone [[data-announcement]_&]:flex">
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
