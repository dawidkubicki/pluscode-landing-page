import { Stagger, StaggerItem } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Proof band — the headline figures that used to sit in the hero, moved down
 * the page so the fold stays focused on the message and primary CTA.
 */
export default function Metrics({ locale }: { locale: Locale }) {
  const stats = getDictionary(locale).hero.stats;

  return (
    <section id="metrics" className="border-t border-cream-line bg-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
        <Stagger
          className="grid grid-cols-2 gap-x-10 gap-y-10 lg:grid-cols-4"
          gap={0.1}
        >
          {stats.map((s) => (
            <StaggerItem key={s.value}>
              <div className="flex flex-col gap-2">
                <span className="display text-4xl text-ink sm:text-5xl">
                  {s.value}
                </span>
                <span className="max-w-[15rem] text-[14px] leading-[1.5] text-ink-soft">
                  {s.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
