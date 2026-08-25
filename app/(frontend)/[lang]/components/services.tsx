import { Reveal } from "./motion";
import ServicesList from "./services-list";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Home "Capabilities" band — numbered practice list, linking into each subpage.
 *  Index-aligned with `services.items` in the dictionaries (AI consulting spine). */
const hrefs = [
  "/ai-data/consulting", // 01 Process mapping & AI roadmap
  "/ai-data/machine-learning", // 02 Assistants that answer from your own documents
  "/ai-data/machine-learning", // 03 Automation with a person in the loop
  "/ai-data/machine-learning", // 04 Document & paperwork automation
  "/ai-data/analytics", // 05 Data foundations & forecasting
  "/ai-data/consulting/ai-governance", // 06 Data governance, risk & privacy
  "/industries/hr", // 07 Technical hiring & competency checks
];

export default function Services({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).services;

  return (
    <section id="services" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
        <div className="grid items-start gap-14 lg:grid-cols-[380px_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-[110px]">
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
              <p className="mt-5 leading-[1.7] text-ink-soft">{t.subtitle}</p>
            </Reveal>
          </div>

          <ServicesList items={t.items} hrefs={hrefs} />
        </div>
      </div>
    </section>
  );
}
