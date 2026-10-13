import Image from "next/image";
import { useId, type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import { Paragraphs } from "../ui";
import { SIGNET, SignetRing } from "../signet";
import { mediaInfo } from "./media";

/* The ring's stroke weight, and so the padding of its viewBox: the tint
   below is drawn in the same box so the two register exactly. */
const WEIGHT = 0.24;
const VIEWBOX = `${-WEIGHT} ${-WEIGHT} ${SIGNET.width + WEIGHT * 2} ${SIGNET.height + WEIGHT * 2}`;

type Vars = CSSProperties & { "--u": string };

/**
 * The mission band: the ice photograph under a cool wash, with the signet
 * laid over it as two darker lenses. The small disc holds the heading and
 * the big disc holds the paragraphs.
 *
 * The signet is centred on the page. Its own midpoint is the gap between the
 * two discs, so the heading ends just left of the centre line and the
 * paragraphs start just right of it, which is the reference's arrangement.
 *
 * Inside the discs the photograph is tinted until white text clears 4.5:1 on
 * the brightest ice; outside them it stays lighter and reads as a picture.
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
  const photo = mediaInfo("/assets/nature/mission.webp", locale);
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
            src="/assets/nature/mission.webp"
            alt={photo.alt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL ?? undefined}
          />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/75 lg:bg-night/45" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/25" />

      {/* On a wide screen the signet is centred in what the fixed header
          leaves of the screen, so the bar never sits on the ring. */}
      <div className="pc-container flex min-h-svh items-center py-24 lg:min-h-[max(100svh,calc(44*var(--u)+var(--header-h)+4.5rem))] lg:justify-center lg:px-0 lg:pt-[calc(var(--header-h)+2.25rem)] lg:pb-9">
        <div className="relative w-full lg:aspect-[57.2108/44] lg:h-[calc(44*var(--u))] lg:w-auto lg:flex-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[-58%] aspect-[57.2108/44] w-[185%] -translate-y-1/2 opacity-25 sm:right-[-30%] sm:w-[120%] lg:inset-0 lg:w-auto lg:translate-y-0 lg:opacity-100"
          >
            <svg
              viewBox={VIEWBOX}
              className="absolute inset-0 hidden h-full w-full lg:block"
              focusable="false"
            >
              <g fill="var(--color-night)" fillOpacity="0.58">
                <circle cx={SIGNET.small.cx} cy={SIGNET.small.cy} r={SIGNET.small.r} />
                <path d={SIGNET.bigPath} />
              </g>
            </svg>
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
