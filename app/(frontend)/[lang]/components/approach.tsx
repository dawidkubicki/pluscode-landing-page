import type { Dictionary } from "@/lib/i18n/dictionaries";

/* ------------------------------------------------------------------ *
 *  APPROACH. How we work: hosting, the AI Act, and the rules of the
 *  trade we are building for.
 *
 *  NO BUTTON IN THE HEADER. Every other band on the page pairs its title
 *  with an intro and a call to action, and this one has no destination
 *  to send anyone to: there is no page that says more about where the
 *  data sits than these three lines do. Rather than invent a link, the
 *  header is the title on the left and the intro on the right, and the
 *  intro is indented to column 8 so the right hand side still starts on
 *  the same line as the intro of Services and Offerings above it. That
 *  is also why the intro is not bottom aligned here: with no button
 *  under it there is nothing to hang off the baseline.
 *
 *  Three cells, four columns each, so the row fills the grid exactly and
 *  the hairlines land on the same column lines as the Clients row. Below
 *  768px they stack, and the per cell top margin carries the rhythm.
 *
 *  Server component: no state, no effects.
 * ------------------------------------------------------------------ */

export default function Approach({
  dict,
}: {
  dict: Dictionary["home"]["approach"];
}) {
  return (
    <section className="bg-paper-dim py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-6">
            <h2 className="text-heading-xl">{dict.title}</h2>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="text-[1.125rem] leading-[1.375] text-moss">
              {dict.intro}
            </p>
          </div>

          {dict.items.map((item) => (
            <div
              key={item.key}
              className="col-span-4 mt-16 border-t border-rule pt-8 md:col-span-4 md:mt-24"
            >
              <h3 className="text-heading-sm text-ink">{item.title}</h3>
              <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
