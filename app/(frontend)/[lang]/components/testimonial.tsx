import { Reveal } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Testimonial({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).testimonial;

  return (
    <section className="border-t border-cream-line bg-white">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 py-20 sm:px-10 sm:py-[6.25rem] md:grid-cols-[300px_1fr] md:gap-[4.375rem]">
        <Reveal>
          <div className="h-[340px] w-full max-w-[300px] overflow-hidden rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/testimonial/ceo-avatar.jpg"
              alt={t.name}
              className="size-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <div className="mb-6 font-serif text-6xl leading-[0.5] text-lime">“</div>
            <blockquote className="text-balance font-serif text-2xl font-light leading-[1.4] tracking-[-0.005em] text-ink sm:text-3xl">
              {t.quote}
            </blockquote>
            <div className="mt-8 text-[15px] font-semibold text-ink">{t.name}</div>
            <div className="mt-1 text-sm text-ink-mute">{t.title}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
