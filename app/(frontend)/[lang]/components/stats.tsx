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

/* ------------------------------------------------------------------ *
 *  STATS. Four figures, one per grid third, on the full bleed grid.
 *
 *  Each figure is a cell with a hairline over it rather than a card: the
 *  rule is what separates them, so the row lines up with the columns of
 *  every other band on the page.
 *
 *  `dark` keeps the meaning it always had, it just moves the whole cell
 *  onto the ink ground. `on-dark` travels with it because that class is
 *  what switches the global focus ring from ink to white.
 * ------------------------------------------------------------------ */
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
  const surface = dark ? "on-dark bg-ink" : "bg-paper";
  const rule = dark ? "border-rule-dark" : "border-rule";
  const figure = dark ? "text-white" : "text-ink";
  const label = dark ? "text-sage" : "text-moss";

  return (
    <section id="stats" className={`py-20 md:py-[104px] ${surface}`}>
      <div className="pc-shell">
        {lead && (
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-8">
              <p className={`text-heading-md ${figure}`}>{lead}</p>
            </Reveal>
          </div>
        )}

        {/* Four cells of three columns each fill the row exactly, so the
            figures land on the same rules as the bands above and below. */}
        <Stagger
          className={`pc-grid ${lead ? "mt-16 md:mt-24" : ""}`}
          gap={0.1}
        >
          {order.map((key) => {
            const { to, suffix } = parse(items[key].value);
            return (
              <StaggerItem
                key={key}
                className={`col-span-4 border-t pt-8 md:col-span-3 ${rule}`}
              >
                <div className={`text-heading-lg ${figure}`}>
                  <CountUp to={to} suffix={suffix} />
                </div>
                <p className={`mt-4 text-[1.125rem] leading-[1.375] ${label}`}>
                  {items[key].label}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
