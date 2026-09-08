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
 * It is a dark band on the pale page: the ink ground, the sentence in white,
 * and the arrow in sage, with a rule-dark hairline under it. There is no
 * accent colour, no radius and no shadow, and the whole strip is one weight,
 * like everything else on this site. It is 40px tall for one line and it
 * GROWS when it needs to, which it did not used to be able to do.
 *
 * THE HEIGHT IS PUBLISHED, NOT ASSUMED. The header sits under this bar and
 * the page is padded by it, and both used to hardcode 40px (`top-10`,
 * `pt-10`), which is what made a second line impossible. The bar now measures
 * itself and writes `--pc-announcement-h` onto <html>; those two read the
 * variable and fall back to 2.5rem, so the bar is free to be whatever height
 * its sentence needs and nothing below it has to be told.
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
 * 3. THE WHOLE BAR VANISHED ON A PHONE, AND STILL DID. The fit test used to
 *    be all or nothing; it became a ladder whose last rung, `off`, took the
 *    bar off the page when the sentence alone would not fit on one line.
 *    That rung was still wrong, and it fired in production: the Polish
 *    banner, "Nowosc: oferujemy teraz darmowe konsultacje AI dla startupow",
 *    needs more than one 14px line at a phone's width, so it was invisible at
 *    360, 390 and 414 and only appeared from 640 up. Measured on the live
 *    site at every one of those widths, not inferred.
 *
 *    A banner nobody can see is not a degraded banner, it is a missing one,
 *    and the reason the rung existed at all was that the bar could not get
 *    any taller. It can now, so the ladder ends in a rung that still shows
 *    the message:
 *
 *      full     the sentence, the link label and the arrow, on one line.
 *      compact  the sentence and the arrow on one line. The label comes off,
 *               the whole row stays the link, and the label is folded into
 *               the anchor's accessible name so nothing is lost to a screen
 *               reader.
 *      wrap     the sentence over as many lines as it needs, and the bar
 *               grows to hold them. Every word is on screen, which is the
 *               entire point of a banner, and the header and the page move
 *               down with it because they read the published height.
 *
 *    There is no rung that hides the bar. Dismissing it is the visitor's
 *    decision and stays theirs; running out of width is not a reason to make
 *    that decision for them.
 *
 *    Everything is derived from one live measurement of the rendered line plus
 *    the latched width of the label, so the ladder cannot oscillate: the two
 *    candidate widths are computed the same way in every mode, and stepping
 *    back up to `full` needs 2px more room than stepping down did.
 *
 * Both interactive children are 44px tall boxes centred in the 40px band, which
 * is the touch target the band itself is too short to give. Neither paints a
 * ground of its own, so the band still reads as exactly 40px.
 */

type Mode = "full" | "compact" | "wrap";

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
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  // No latched label cost any more: the ruler carries the label in every
  // mode, so it can always be measured directly and can never be priced from
  // a stale string after a locale switch.

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

      // THE RULER IS NOT THE VISIBLE LINE. It used to be, and that is a loop
      // waiting to happen: in `wrap` the visible line breaks, so it measures
      // exactly the track's width, which reads as "it fits", which steps back
      // to `compact`, which sets it nowrap, which does not fit, which steps
      // back to `wrap`, for ever. The ruler below is a hidden twin that is
      // always nowrap and always carries the label, so both candidate widths
      // are the same numbers in every mode and the ladder cannot argue with
      // itself.
      const label = labelRef.current;
      const cost = label
        ? label.getBoundingClientRect().width + LABEL_GAP
        : 0;
      const full = Math.ceil(line.getBoundingClientRect().width);
      const compact = Math.ceil(full - cost);

      setMode(
        full + HYSTERESIS <= room
          ? "full"
          : compact <= room
            ? "compact"
            : "wrap",
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

  // The attribute is the contract with the header and the page padding. The
  // bar is shown whenever it exists and the visitor has not dismissed it:
  // there is no longer a width at which it hides itself.
  const shown = !dismissed;
  useEffect(() => {
    const root = document.documentElement;
    if (shown) root.setAttribute("data-announcement", "");
    else root.removeAttribute("data-announcement");
    return () => root.removeAttribute("data-announcement");
  }, [shown]);

  /* THE PUBLISHED HEIGHT. The header is fixed under this bar and the page is
     padded by it, and both used to assume 40px, which is exactly what stopped
     the sentence ever taking a second line. Measuring in a layout effect means
     the variable is right before the first paint rather than one frame after
     it, so a wrapped bar never shows as a 40px bar that then jumps. The
     ResizeObserver keeps it right through a rotation, a font swap and a
     locale change. */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!bar || dismissed) return;
    const publish = () => {
      const h = Math.round(bar.getBoundingClientRect().height);
      if (h > 0) root.style.setProperty("--pc-announcement-h", `${h}px`);
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--pc-announcement-h");
    };
  }, [dismissed, mode, announcement.text]);

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
  const compact = mode !== "full";
  const wrapped = mode === "wrap";

  // One measured span. It never wraps and it never shrinks, so its bounding
  // width is the width the sentence actually needs, even while the track is
  // clipping it.
  const line = (
    <span
      className={[
        // `shrink-0` IS WHAT STOPS IT WRAPPING, so it only holds in the two
        // rungs that mean to stay on one line. A flex item that cannot shrink
        // keeps its max-content width whatever `whitespace` says, so with
        // both set the sentence sat on one line at its full width and simply
        // hung out of the clipping track on both sides: 486px of text in a
        // 308px box, cut at each end, which is the exact defect this ladder
        // exists to prevent. In `wrap` the line takes the track's width and
        // breaks inside it, and `block` rather than `flex` is what lets the
        // arrow flow with the last word instead of being a rigid third
        // column.
        wrapped
          ? "block w-full min-w-0 whitespace-normal text-center"
          : "flex shrink-0 items-center gap-1.5 whitespace-nowrap",
      ].join(" ")}
    >
      {/* White, not mist. This is the one line of copy on the site whose job
          is to be noticed, and the system's way of adding weight is contrast
          and size, never a heavier face: only Inter 400 is loaded, so a
          `font-bold` here would be synthetic bold, which smears the outlines
          and looks worse than either real weight. White on ink is 14.6:1
          against mist's 9.7:1. */}
      <span className="text-white">{text}</span>
      {linkText && !compact && (
        // No colour class here on purpose: `.pc-link` sets `color: inherit`
        // and, being defined after the generated utilities in the same layer,
        // would win over a `text-white` on the same element. The white comes
        // from the anchor instead. `group-hover` draws the underline from
        // anywhere on the row, which is what the whole 40px band is for.
        <span className="pc-link group-hover:[background-size:100%_1px]">
          {linkText}
        </span>
      )}
      {linkUrl && <Arrow className="size-3 shrink-0 text-sage" />}
    </span>
  );

  return (
    <div
      ref={barRef}
      className={[
        // `on-dark` is what turns the global focus ring white for everything
        // inside the band.
        "on-dark fixed inset-x-0 top-0 z-[60] items-center border-b border-rule-dark bg-ink px-1 text-mist sm:px-2",
        // 40px for one line, and taller only when the sentence needs it. The
        // height used to be fixed because the header and the page padding
        // hardcoded it; they read `--pc-announcement-h` now, so this is free
        // to grow. The vertical padding is what keeps a wrapped bar off its
        // own hairline.
        wrapped ? "min-h-10 py-2" : "h-10",
        // 16px everywhere. It used to drop to the 14px micro size below 640,
        // bought against the fit ladder's habit of hiding the bar outright;
        // that rung is gone, so the smaller type bought nothing and cost the
        // one line on the page that has to be read. Leading goes from `none`
        // to `snug` when wrapping, because two lines set at leading 1 touch.
        "text-[1rem]",
        wrapped ? "leading-snug" : "leading-none",
        // Before hydration the attribute drives display, so a returning
        // visitor who dismissed this banner never sees it flash. After
        // hydration React owns it, because a `display:none` bar cannot be
        // measured and the fit ladder has to keep working.
        hydrated ? "flex" : "hidden [[data-announcement]_&]:flex",
      ].join(" ")}
    >
      {/* Balances the dismiss button so the sentence sits on the true centre.
          It is dropped below 640, where 44px of the line's room is worth more
          than 22px of centring. */}
      <span aria-hidden className="hidden w-11 shrink-0 sm:block" />
      <div
        ref={trackRef}
        className="relative flex min-w-0 flex-1 justify-center overflow-hidden"
      >
        {/* THE RULER. A hidden twin of the line, always on one line and
            always carrying the label, whatever rung the ladder is on. It is
            what the fit test measures, so the test asks one question ("how
            wide would this be unbroken?") and gets the same answer in every
            mode. Measuring the visible line instead is what let `wrap` and
            `compact` chase each other for ever.

            It sits inside the track so it inherits the same face, size and
            tracking as the real line, and it is taken out of flow so it
            cannot affect the track's own width, which is the room it is
            being measured against. `invisible` rather than `hidden`: a
            display:none element has no width at all. */}
        <span
          ref={lineRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{text}</span>
          {linkText && <span ref={labelRef}>{linkText}</span>}
          {linkUrl && <Arrow className="size-3 shrink-0" />}
        </span>
        {linkUrl ? (
          <LocaleLink
            href={linkUrl}
            // 44px of target in a 40px band: the box overhangs 2px top and
            // bottom and paints nothing there. The white here is the link
            // colour, and the sentence inside steps back down to mist.
            aria-label={compact && linkText ? `${text} ${linkText}` : undefined}
            className={`group flex items-center text-white ${
              wrapped ? "w-full min-w-0 py-1" : "h-11 shrink-0"
            }`}
          >
            {line}
          </LocaleLink>
        ) : (
          <span
            className={`flex items-center ${
              wrapped ? "w-full min-w-0" : "h-10 shrink-0"
            }`}
          >
            {line}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        // A square 44px hit area with no ground of its own: the glyph moving
        // from sage to white is the whole hover state, so the button paints
        // nothing outside the 40px band even while it overhangs it.
        className="flex size-11 shrink-0 items-center justify-center text-sage transition-colors duration-300 ease-io-attio hover:text-white hover:duration-50"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
