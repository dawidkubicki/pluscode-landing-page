import { Reveal, Stagger, StaggerItem } from "./motion";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Home "Capabilities" band — numbered practice list, linking into each subpage.
 *  Index-aligned with `services.items` in the dictionaries (AI consulting spine). */
const hrefs = [
  "/ai-data/consulting", // 01 AI Strategy & Roadmap
  "/ai-data/machine-learning", // 02 Generative AI & LLM Apps
  "/ai-data/machine-learning", // 03 AI Agents & Automation
  "/ai-data/machine-learning", // 04 Intelligent Document Processing
  "/ai-data/analytics", // 05 ML & Data Foundations
  "/ai-data/consulting", // 06 AI Enablement & Governance
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

          <Stagger className="flex flex-col" gap={0.08}>
            {t.items.map((item, i) => (
              <StaggerItem key={item.num}>
                <LocaleLink
                  href={hrefs[i]}
                  className="grid gap-4 border-t border-cream-line py-8 transition-colors duration-300 hover:bg-cream sm:grid-cols-[72px_1fr] sm:gap-7 sm:py-9"
                >
                  <div className="font-serif text-3xl font-light text-[#c3cede]">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink sm:text-[21px]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-[560px] text-[15.5px] leading-[1.7] text-ink-soft">
                      {item.desc}
                    </p>
                    <div className="mt-3.5 font-mono text-[12.5px] tracking-[0.02em] text-ink-mute">
                      {item.tags}
                    </div>
                  </div>
                </LocaleLink>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
