import { CountUp, Reveal, Stagger, StaggerItem } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const order = ["years", "projects", "clients", "team"] as const;

/** Split a value like "150+" into its number and trailing suffix. */
function parse(value: string): { to: number; suffix: string } {
  const m = value.match(/^(\d+)(.*)$/);
  if (!m) return { to: 0, suffix: value };
  return { to: Number(m[1]), suffix: m[2] };
}

export default function Stats({
  locale,
  dark = false,
  lead,
}: {
  locale: Locale;
  dark?: boolean;
  /** Optional intro line shown above the figures (homepage band). */
  lead?: string;
}) {
  const items = getDictionary(locale).pages.about.stats.items;
  const surface = dark ? "bg-night text-bone" : "bg-cream text-ink";
  const line = dark ? "border-night-line" : "border-cream-line";
  const labelColor = dark ? "text-bone-soft" : "text-ink-soft";

  return (
    <section id="stats" className={`px-5 py-24 sm:px-8 sm:py-32 ${surface}`}>
      <div className="mx-auto max-w-[1500px]">
        {lead && (
          <Reveal>
            <p className="max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              {lead}
            </p>
          </Reveal>
        )}

        <Stagger
          className={`grid grid-cols-1 gap-x-8 gap-y-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4 ${line} ${lead ? "mt-16" : ""}`}
          gap={0.1}
        >
          {order.map((key) => {
            const { to, suffix } = parse(items[key].value);
            return (
              <StaggerItem key={key}>
                <div className="flex flex-col">
                  <div className={`display text-6xl sm:text-7xl ${dark ? "text-lime" : "text-ink"}`}>
                    <CountUp to={to} suffix={suffix} />
                  </div>
                  <p className={`mt-4 max-w-[16rem] text-sm leading-relaxed ${labelColor}`}>
                    {items[key].label}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
