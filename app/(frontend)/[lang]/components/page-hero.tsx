import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { SignetRing } from "./signet";
import type { Locale } from "@/lib/i18n/config";

export type HeroImage = "about" | "news" | "contact";

type Photo = {
  src: string;
  alt: string;
  dominant: string;
  blurDataURL: string | undefined;
};

const NATURE_DIR = path.join(process.cwd(), "public", "assets", "nature");

/**
 * The photograph for a band, or null when the file has not shipped. Read with
 * `fs` because a fresh checkout may build before the imagery exists, and an
 * `<img>` pointing at a missing file would print its alt text across the band.
 */
function readPhoto(name: HeroImage, locale: Locale): Photo | null {
  if (!fs.existsSync(path.join(NATURE_DIR, `${name}.webp`))) return null;

  const photo: Photo = {
    src: `/assets/nature/${name}.webp`,
    alt: "",
    dominant: "#0a0a0a",
    blurDataURL: undefined,
  };
  try {
    const manifest: unknown = JSON.parse(
      fs.readFileSync(path.join(NATURE_DIR, "manifest.json"), "utf8"),
    );
    const entry = (manifest as Record<string, Record<string, unknown> | undefined>)[name];
    if (entry) {
      const alt = entry.alt;
      if (typeof alt === "string") photo.alt = alt;
      else if (alt && typeof alt === "object") {
        const perLocale = alt as Record<string, unknown>;
        const text = perLocale[locale] ?? perLocale.en;
        if (typeof text === "string") photo.alt = text;
      }
      if (typeof entry.dominant === "string") photo.dominant = entry.dominant;
      if (typeof entry.blurDataURL === "string") photo.blurDataURL = entry.blurDataURL;
    }
  } catch {
    // No manifest, or one that does not parse: the photograph still shows,
    // over the night ground and without a blur placeholder.
  }
  return photo;
}

const RING_MASK_IMAGE =
  "linear-gradient(to bottom, transparent calc(var(--header-h) - 1.5rem), #000 calc(var(--header-h) + 6rem)), " +
  "linear-gradient(to top right, transparent var(--ring-clear), #000 var(--ring-full))";

/** Both gradients must agree before the ring shows. Prefixed for older WebKit. */
const RING_MASK: CSSProperties = {
  maskImage: RING_MASK_IMAGE,
  WebkitMaskImage: RING_MASK_IMAGE,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/**
 * The dark band every inner page opens with. The header is transparent with
 * white content until the page scrolls, so this is also what it stands on:
 * the scrim below is what keeps the navigation legible, not only the title.
 *
 * `tall` carries a nature photograph and is for About, News and Contact.
 * `short` is the ring alone, for articles, legal pages and the 404.
 */
export default function PageHero({
  title,
  intro,
  size = "tall",
  image,
  locale = "en",
  titleSize = "hero",
  children,
}: {
  title: ReactNode;
  /** One quiet line under the title. */
  intro?: ReactNode;
  size?: "tall" | "short";
  /** Tall bands only. Without it, or before the file exists, the ring carries the band. */
  image?: HeroImage;
  /** Picks the photograph's alt text. */
  locale?: Locale;
  /** `display` for long titles, such as a news headline. */
  titleSize?: "hero" | "display";
  /** Sits above the title: the article's way back to the list. */
  children?: ReactNode;
}) {
  const tall = size === "tall";
  const photo = tall && image ? readPhoto(image, locale) : null;

  return (
    <section
      className={[
        "relative isolate flex flex-col justify-end overflow-hidden bg-night text-white",
        "pt-[calc(var(--header-h)+2.5rem)]",
        tall
          ? "min-h-[max(27.5rem,65dvh)] pb-[clamp(2.5rem,6vw,4.5rem)]"
          : "min-h-[max(18.75rem,38dvh)] pb-[clamp(2.25rem,5vw,3.5rem)]",
      ].join(" ")}
      style={photo ? { backgroundColor: photo.dominant } : undefined}
    >
      {photo && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          blurDataURL={photo.blurDataURL}
          className="-z-20 object-cover"
        />
      )}

      {/* The scrim. The flat layer alone is night at 58%, which holds white
          text at 4.5:1 over a pure white pixel, so no photograph an editor
          could swap in can break the title or the navigation above it. The
          gradient then deepens the foot of the band, where the words are. */}
      {photo && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(10_10_10/0.82)_0%,rgb(10_10_10/0.3)_45%,rgb(10_10_10/0)_75%),linear-gradient(rgb(10_10_10/0.58),rgb(10_10_10/0.58))]"
        />
      )}

      {/* The signet, larger than the band and pushed off its right edge, so
          what shows is arcs crossing and not a logo. Two masks keep the line
          away from words: one fades it out under the header, where the
          navigation sits in white, and one fades it toward the bottom left
          corner, where the title is. On a phone the title takes most of the
          band, so the second fade starts sooner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [--ring-clear:30%] [--ring-full:54%] max-md:[--ring-clear:46%] max-md:[--ring-full:72%]"
        style={RING_MASK}
      >
        <SignetRing
          tone="light"
          weight={0.13}
          className={[
            "absolute top-1/2 right-0 w-auto max-w-none -translate-y-1/2",
            tall
              ? "h-[min(186%,84vw)] translate-x-[45%] opacity-90 max-md:h-[112%] max-md:translate-x-[50%]"
              : "h-[min(260%,62vw)] translate-x-[46%] opacity-70 max-md:h-[170%] max-md:translate-x-[52%]",
          ].join(" ")}
        />
      </div>

      <div className="pc-container relative">
        {children && <div className="mb-5">{children}</div>}
        <h1
          className={
            titleSize === "display"
              ? "max-w-[56rem] text-display"
              : "max-w-[40rem] text-hero"
          }
        >
          {title}
        </h1>
        {intro && (
          <p
            className={
              tall
                ? "mt-4 max-w-[34rem] text-lead text-grey-light"
                : "mt-4 max-w-[34rem] text-small text-grey-light"
            }
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
