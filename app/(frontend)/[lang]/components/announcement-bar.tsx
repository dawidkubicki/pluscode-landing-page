"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
 *
 * Visibility is driven by the `data-announcement` attribute on <html>, set
 * pre-paint by a script in the layout on first load and then kept in sync here
 * (locale switches, dismissal, and the fit ladder below), so the header offset
 * and page padding always collapse together with the bar and no empty strip is
 * left above the nav.
 *
 * On the dark page it is a lifted strip, not a dark one: `night` is a step up
 * from the page ground, with a `night-line` hairline under it and the link in
 * the accent text colour. It is 40px tall and the height is load-bearing: the
 * header's `top-10` and the layout's `pt-10` are both keyed to it. The bar
 * therefore cannot grow a second line, and the sentence cannot be set smaller
 * than the 12px floor, so the only variable left is how much of the row it
 * renders.
 *
 * THREE DEFECTS CLOSED, all measured at 390px.
 *
 * 1. THE MESSAGE TRUNCATED MID-WORD. Two nested `truncate` classes cut the
 *    sentence wherever the width ran out, so the bar showed half an idea. The
 *    `truncate` is gone and nothing here ever clips a word.
 *
 * 2. THE DISMISS BUTTON OVERLAPPED "LEARN MORE" BY 20px. It was
 *    `absolute right-3` over a centred, full-width message. It is now a flex
 *    sibling of the message track, so the two cannot occupy the same pixels by
 *    construction.
 *
 * 3. THE WHOLE BAR VANISHED ON A PHONE. The fit test was all or nothing: one
 *    sentence too wide for the track and the entire bar took itself off the
 *    page, which is how a 415px line of stale CMS copy made the banner
 *    invisible below 640 while looking, from the outside, like the copy fix had
 *    simply been skipped. The test is now a ladder, and it degrades one step
 *    at a time:
 *
 *      full     the sentence, the link label and the arrow.
 *      compact  the sentence and the arrow. The label comes off, the whole
 *               40px row stays the link, and the label is folded into the
 *               anchor's accessible name so nothing is lost to a screen
 *               reader. This is what buys a long sentence its place at 390.
 *      off      only when the sentence alone will not fit. Deliberate, and
 *               deliberately last: a bar that clips its own message says less
 *               than no bar at all. Nothing is written to storage in this
 *               state, so a wider window brings the banner straight back.
 *
 *    Everything is derived from one live measurement of the rendered line plus
 *    the latched width of the label, so the ladder cannot oscillate: the two
 *    candidate widths are computed the same way in every mode, and stepping
 *    back up to `full` needs 2px more room than stepping down did.
 *
 * Both interactive children are 44px tall boxes centred in the 40px band. They
 * paint nothing outside it (the link has no ground, and the dismiss button's
 * hover disc is a 36px child), so the band still reads as exactly 40px.
 */

type Mode = "full" | "compact" | "off";

/** `gap-1.5` between the sentence and the link label. */
const LABEL_GAP = 6;
/** Room the step back up to `full` must find over the step down. */
const HYSTERESIS = 2;

export default function AnnouncementBar({
  announcement,
}: {
  announcement: Announcement;
}) {
  const key = announcementStorageKey(announcement.text);
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("full");
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // The label's cost in pixels, latched while it is on screen. Its width does
  // not depend on the track, so a value measured in `full` stays true in
  // `compact`, where the element itself is gone and cannot be measured. It is
  // stamped with the string it was measured from, so a locale switch made
  // while the bar is compact cannot price the new label at the old one's
  // width: an unstamped cost falls back to 0, which asks for `full`, which
  // mounts the label, which measures it.
  const labelCost = useRef<{ of: string | null; px: number }>({
    of: null,
    px: 0,
  });

  // Runs before paint, so on soft locale switches (where the pre-hydration
  // script in the layout doesn't re-run) the state still flips together with
  // the bar for the new locale's banner, with no flash either way.
  useLayoutEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(key) === "dismissed";
    } catch {
      /* ignore */
    }
    /* eslint-disable react-hooks/set-state-in-effect -- client-only sync */
    setDismissed(stored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [key]);

  // Which rung of the ladder fits the space beside the dismiss button? The
  // line is `whitespace-nowrap` and shrink-proof, so its measured width is its
  // true width even while it is overflowing a clipped track. Nothing here
  // changes a width, only which children render, so this cannot fight itself.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let cancelled = false;

    const measure = () => {
      const line = lineRef.current;
      if (cancelled || !line) return;
      const room = track.clientWidth;
      // A collapsed track means the bar is display:none (dismissed, or
      // pre-hydration with no attribute). Nothing to decide yet.
      if (room === 0) return;

      const label = labelRef.current;
      if (label) {
        labelCost.current = {
          of: announcement.linkText,
          px: label.getBoundingClientRect().width + LABEL_GAP,
        };
      }
      const cost =
        labelCost.current.of === announcement.linkText
          ? labelCost.current.px
          : 0;
      const shown = line.getBoundingClientRect().width;
      const full = Math.ceil(label ? shown : shown + cost);
      const compact = Math.ceil(label ? shown - cost : shown);

      setMode(
        full + HYSTERESIS <= room ? "full" : compact <= room ? "compact" : "off",
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    // The first measurement can land on the fallback face. Re-run once the
    // real one is in, because Inter and the system fallback do not set this
    // sentence to the same width.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
      ro.disconnect();
    };
    // `mode` is a dependency so every rung re-measures itself once. That is
    // what makes the ladder self-correcting rather than a one-way trip: a
    // step down is re-checked from the DOM it produced, and because both
    // candidate widths are derived the same way in every mode, the second
    // pass agrees with the first and React drops the identical state. The 2px
    // hysteresis is what keeps a borderline width from flapping.
  }, [announcement.text, announcement.linkText, hydrated, mode]);

  // The attribute is the contract with the header and the page padding.
  const shown = !dismissed && mode !== "off";
  useEffect(() => {
    const root = document.documentElement;
    if (shown) root.setAttribute("data-announcement", "");
    else root.removeAttribute("data-announcement");
    return () => root.removeAttribute("data-announcement");
  }, [shown]);

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    document.documentElement.removeAttribute("data-announcement");
    try {
      localStorage.setItem(key, "dismissed");
    } catch {
      /* ignore */
    }
  };

  const { text, linkText, linkUrl } = announcement;
  const compact = mode === "compact";

  // One measured span. It never wraps and it never shrinks, so its bounding
  // width is the width the sentence actually needs, even while the track is
  // clipping it.
  const line = (
    <span
      ref={lineRef}
      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
    >
      <span>{text}</span>
      {linkText && !compact && (
        <span
          ref={labelRef}
          className="font-medium text-lime-soft underline decoration-lime-soft/40 underline-offset-[3px] transition-colors duration-300 ease-io-attio group-hover:text-lime-ink group-hover:decoration-lime-ink group-hover:duration-50"
        >
          {linkText}
        </span>
      )}
      {linkUrl && (
        <Arrow className="size-3 shrink-0 text-lime-soft transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </span>
  );

  return (
    <div
      className={[
        "fixed inset-x-0 top-0 z-[60] h-10 items-center border-b border-night-line bg-night px-1 text-bone-soft sm:px-2",
        // Before hydration the attribute drives display, so a returning
        // visitor who dismissed this banner never sees it flash. After
        // hydration React owns it, because a `display:none` bar cannot be
        // measured and the fit ladder has to keep working.
        hydrated ? "flex" : "hidden [[data-announcement]_&]:flex",
        // Laid out but not painted, not clickable and not reachable, so the
        // measurement stays live and a wider window brings it back.
        mode === "off" ? "invisible pointer-events-none" : "",
      ].join(" ")}
    >
      {/* Balances the dismiss button so the sentence sits on the true centre.
          It is dropped below 640, where 44px of the line's room is worth more
          than 22px of centring. */}
      <span aria-hidden className="hidden w-11 shrink-0 sm:block" />
      <div
        ref={trackRef}
        className="flex min-w-0 flex-1 justify-center overflow-hidden"
      >
        {linkUrl ? (
          <LocaleLink
            href={linkUrl}
            // 44px of target in a 40px band: the box overhangs 2px top and
            // bottom and paints nothing there, and the focus ring is drawn
            // 2px inboard so it lands exactly on the band.
            aria-label={compact && linkText ? `${text} ${linkText}` : undefined}
            className="group flex h-11 shrink-0 items-center text-[12px] leading-none text-bone-soft transition-colors duration-300 ease-io-attio hover:text-bone hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone-dim sm:text-[13px]"
          >
            {line}
          </LocaleLink>
        ) : (
          <span className="flex h-10 shrink-0 items-center text-[12px] leading-none sm:text-[13px]">
            {line}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="group flex size-11 shrink-0 items-center justify-center rounded-full text-bone-dim transition-colors duration-300 ease-io-attio hover:text-bone hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone-dim"
      >
        {/* The hover disc is a 36px child, so the 44px target never paints
            outside the 40px band. */}
        <span className="flex size-9 items-center justify-center rounded-full transition-colors duration-300 ease-io-attio group-hover:bg-white/10 group-hover:duration-50">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
