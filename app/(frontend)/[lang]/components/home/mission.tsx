import Image from "next/image";
import { useId, type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import { Paragraphs } from "../ui";
import { SignetRing } from "../signet";
import { mediaInfo } from "./media";

/* The ring's stroke weight, in the drawing's own units. */
const WEIGHT = 0.24;

type Vars = CSSProperties & { "--u": string };

/**
 * The mission band: a mountain photograph under one even shade, with the
 * signet laid over it as a thin ring and nothing else. The small disc holds
 * the heading and the big disc holds the paragraphs.
 *
 * The signet is centred on the page. Its own midpoint is the gap between the
 * two discs, so the heading ends just left of the centre line and the
 * paragraphs start just right of it, which is the reference's arrangement.
 *
 * THE RING HAS NO FILL. The discs are outlines over the photograph, not
 * panels: the owner asked for the tint inside them to go. So the contrast
 * the text needs comes from the photograph, which is chosen dark and even,
 * and from the shade over the whole band, never from a patch behind the
 * words. A brighter photograph here needs a deeper shade, not a fill.
 * Everything is sized from `--u`, one unit of the signet's drawing (the mark
 * is 44 units tall), so the text boxes stay inside the discs at every width.
 *
 * Under 1024px there is no room for text inside a disc: the heading and the
 * paragraphs stack on a darker scrim and the ring is a partial outline. It
 * runs behind the words there, so it is drawn faint enough that the text
 * keeps its contrast where the line crosses it.
 */
export default function Mission({
  locale,
  heading,
  body,
}: {
  locale: Locale;
  heading: string;
  body: string;
}) {
  const headingId = useId();
  const photo = mediaInfo("/assets/nature/mission-2.webp", locale);
  const vars: Vars = { "--u": "clamp(15px, 1.18vw, 18.5px)" };

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-night text-white"
      style={vars}
    >
      {photo.exists && (
        <div
          className="absolute inset-0 -z-20"
          style={{ backgroundColor: photo.dominant ?? undefined }}
        >
          <Image
            src="/assets/nature/mission-2.webp"
            alt={photo.alt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL ?? undefined}
          />
        </div>
      )}
      {/* The one even shade over the whole band. The photograph is already
          dark and low in contrast; this only settles its fog so white text
          holds everywhere, and it is deeper on a narrow screen, where the
          words run across the full width. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/55 lg:bg-night/30" />

      {/* On a wide screen the signet is centred in what the fixed header
          leaves of the screen, so the bar never sits on the ring. */}
      <div className="pc-container flex min-h-svh items-center py-24 lg:min-h-[max(100svh,calc(44*var(--u)+var(--header-h)+4.5rem))] lg:justify-center lg:px-0 lg:pt-[calc(var(--header-h)+2.25rem)] lg:pb-9">
        <div className="relative w-full lg:aspect-[57.2108/44] lg:h-[calc(44*var(--u))] lg:w-auto lg:flex-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[-58%] aspect-[57.2108/44] w-[185%] -translate-y-1/2 opacity-25 sm:right-[-30%] sm:w-[120%] lg:inset-0 lg:w-auto lg:translate-y-0 lg:opacity-100"
          >
            <SignetRing tone="light" weight={WEIGHT} className="absolute inset-0 h-full w-full" />
          </div>

          <h2
            id={headingId}
            className="relative max-w-[32rem] text-display text-grey-light lg:absolute lg:top-1/2 lg:right-[58.5%] lg:left-[6.5%] lg:max-w-none lg:-translate-y-1/2 lg:text-right lg:text-[length:min(2.5rem,calc(2.2*var(--u)))] lg:[text-wrap:wrap]"
          >
            {heading}
          </h2>

          <Paragraphs
            text={body}
            className="relative mt-8 max-w-[29rem] space-y-4 text-body lg:absolute lg:top-1/2 lg:right-[5%] lg:left-[57.5%] lg:mt-0 lg:max-w-none lg:-translate-y-1/2"
          />
        </div>
      </div>
    </section>
  );
}
