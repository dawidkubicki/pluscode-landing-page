import { Reveal } from "./motion";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type BannerDict = Dictionary["banners"]["documents"];

/** Full-bleed dark CTA band with an emerald gradient glow — big serif question
 *  left, copy + button right. */
export default function Banner({
  dict,
  href = "/contact",
  className = "",
}: {
  dict: BannerDict;
  href?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-night text-bone ${className}`}
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(16,185,129,0)_40%,rgba(16,185,129,0.18)_100%)]" />
      <div className="absolute -right-44 -top-44 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,rgba(16,185,129,0)_65%)]" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="display text-balance text-4xl leading-[1.1] sm:text-5xl lg:text-[3.625rem]">
            {dict.titleStart}
            <em className="italic text-lime-soft">{dict.titleEm}</em>
            {dict.titleEnd}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="text-[16.5px] leading-[1.7] text-bone-soft">{dict.text}</p>
            <LocaleLink
              href={href}
              className="mt-7 inline-block rounded-[2px] bg-lime px-[30px] py-[15px] text-[15px] font-semibold text-night transition-colors duration-300 hover:bg-lime-bright"
            >
              {dict.cta}
            </LocaleLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
