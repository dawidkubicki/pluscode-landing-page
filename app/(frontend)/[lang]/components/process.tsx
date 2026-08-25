import { Reveal } from "./motion";
import ProcessSteps from "./process-steps";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** "How we work" — the de-risking methodology band. A numbered, hairline-ruled
 *  path from idea to impact that signals a repeatable, transparent engagement. */
export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).process;

  return (
    <section id="process" className="border-t border-cream-line bg-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.875rem]">
        <div className="max-w-[720px]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {t.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {t.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[17px] leading-[1.7] text-ink-soft">{t.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-14">
          <ProcessSteps steps={t.steps} />
        </div>
      </div>
    </section>
  );
}
