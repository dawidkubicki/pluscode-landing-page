import { Reveal } from "./motion";
import IndustriesGrid from "./industries-grid";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Industries({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).industries;

  return (
    <section id="industries" className="border-t border-cream-line bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-10 sm:py-[7.5rem]">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-10">
          <Reveal>
            <h2 className="max-w-[560px] font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {t.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[420px] text-[17px] leading-[1.7] text-ink-soft">
              {t.subtitle}
            </p>
          </Reveal>
        </div>

        <IndustriesGrid items={t.items} />
      </div>
    </section>
  );
}
