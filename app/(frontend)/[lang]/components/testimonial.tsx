import { Reveal } from "./motion";
import { Plus } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Testimonial({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).testimonial;

  return (
    <section className="px-2 py-6 sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-24 text-bone sm:px-10 sm:py-32">
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[28rem] rounded-full bg-lime/10 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal className="flex justify-center">
            <Plus className="size-8" />
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote className="mt-8 text-balance text-2xl font-medium leading-[1.3] tracking-tight text-bone sm:text-3xl lg:text-4xl">
              “{t.quote}”
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="size-12 overflow-hidden rounded-full border border-lime/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/testimonial/ceo-avatar.jpg"
                  alt={t.name}
                  className="size-full object-cover"
                />
              </span>
              <span className="text-left">
                <span className="block font-medium text-bone">{t.name}</span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-soft">
                  {t.title}
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
