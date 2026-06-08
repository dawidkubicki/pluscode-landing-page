import { CountUp, Stagger, StaggerItem } from "./motion";
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
}: {
  locale: Locale;
  dark?: boolean;
}) {
  const items = getDictionary(locale).pages.about.stats.items;
  const surface = dark
    ? "bg-night text-bone"
    : "bg-cream text-ink";
  const line = dark ? "border-night-line" : "border-cream-line";
  const labelColor = dark ? "text-bone-soft" : "text-ink-soft";

  return (
    <section className={`px-5 py-20 sm:px-8 sm:py-24 ${surface}`}>
      <div className="mx-auto max-w-[1500px]">
        <Stagger
          className={`grid grid-cols-2 gap-x-8 gap-y-12 border-t pt-12 lg:grid-cols-4 ${line}`}
          gap={0.1}
        >
          {order.map((key) => {
            const { to, suffix } = parse(items[key].value);
            return (
              <StaggerItem key={key}>
                <div className="flex flex-col">
                  <div className={`display text-5xl sm:text-6xl ${dark ? "text-lime" : "text-ink"}`}>
                    <CountUp to={to} suffix={suffix} />
                  </div>
                  <p className={`mt-4 max-w-[14rem] text-sm leading-relaxed ${labelColor}`}>
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
