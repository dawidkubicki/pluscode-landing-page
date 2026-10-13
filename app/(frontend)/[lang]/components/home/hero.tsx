import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "../locale-link";
import { SignetRing, Wordmark } from "../signet";
import LanguageSwitch from "../chrome/language-switch";
import { NAV_ITEMS } from "../chrome/nav-items";
import { mediaInfo } from "./media";

const night = (percent: number) =>
  `color-mix(in srgb, var(--color-night) ${percent}%, transparent)`;

/**
 * The first screen: the aerial photograph fading to night, the signet drawn
 * large as a thin ring with the wordmark inside its big disc, and the tagline
 * beside it.
 *
 * The ring is placed by the big disc, which takes the part of the
 * reference's circle: on a wide screen it is half the viewport across and
 * ends just left of the centre line, and the small disc hangs off the left
 * edge. Under 1024px the ring grows past both edges, the tagline sits under
 * the wordmark inside the big disc and the navigation is the header's menu.
 * The tagline is kept off the foot of a phone screen on purpose: that is
 * where the cookie banner opens on a first visit, and it would cover the one
 * sentence the screen exists to say.
 */
export default function Hero({
  locale,
  tagline,
  nav,
}: {
  locale: Locale;
  tagline: string;
  nav: Dictionary["nav"];
}) {
  const photo = mediaInfo("/assets/nature/hero.webp", locale);

  return (
    <section className="relative isolate h-svh min-h-[38.75rem] overflow-hidden bg-night text-white">
      {photo.exists && (
        <div
          className="absolute inset-x-0 top-0 -z-20 h-[74%] lg:h-full"
          style={{ backgroundColor: photo.dominant ?? undefined }}
        >
          <Image
            src="/assets/nature/hero.webp"
            alt={photo.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_0%]"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL ?? undefined}
          />
        </div>
      )}

      {/* The photograph runs into the ground colour. On a phone it only
          covers the upper three quarters, so the fade finishes earlier, and
          the top is held down for the header that sits on it there. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background: `linear-gradient(to bottom, ${night(64)} 0%, ${night(44)} 10%, ${night(16)} 24%, ${night(52)} 44%, ${night(92)} 62%, var(--color-night) 73%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background: `linear-gradient(to bottom, ${night(36)} 0%, ${night(14)} 24%, ${night(40)} 44%, ${night(84)} 66%, var(--color-night) 92%)`,
        }}
      />

      <div className="pointer-events-none absolute top-[44%] right-[-9vw] aspect-[57.2108/44] h-[min(108vw,72svh)] -translate-y-1/2 lg:top-1/2 lg:right-[51%] lg:h-[min(calc(50vw-2rem),calc(100svh-7rem))]">
        <SignetRing tone="light" draw className="h-full w-full" />
        <Wordmark className="absolute top-1/2 right-[calc(9vw+max(1.25rem,5vw))] w-[min(25.6%,9.25rem)] -translate-y-1/2 lg:right-[5.4%] lg:w-[clamp(7.25rem,16.6%,9.5rem)]" />
      </div>

      <div className="absolute inset-x-0 top-[44%] lg:top-1/2">
        <div className="pc-container">
          <div className="mt-9 flex flex-col items-end lg:-mt-[1.15rem] lg:ml-[50%] lg:block">
            <h1 className="max-w-[11.75rem] text-right text-[1.125rem] leading-[1.4] sm:max-w-[16rem] sm:text-title lg:max-w-[22rem] lg:text-left">
              {tagline}
            </h1>

            <nav
              aria-label={nav.primary}
              className="mt-5 hidden items-center justify-between border-t border-white/15 pt-1 lg:flex"
            >
              <ul className="-ml-4 flex items-center">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <LocaleLink
                      href={item.href}
                      aria-current={item.key === "home" ? "page" : undefined}
                      className={`pc-nav-link inline-flex min-h-11 items-center px-4 ${
                        item.key === "home"
                          ? "text-white"
                          : "text-grey-soft hover:text-white"
                      }`}
                    >
                      {nav[item.key]}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
              <LanguageSwitch label={nav.language} tone="dark" className="-mr-2" />
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
