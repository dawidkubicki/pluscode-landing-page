import { Reveal } from "./motion";
import LeadForm from "./lead-form";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const details = [
  { prefix: "@", value: "contact@pluscode.io", href: "mailto:contact@pluscode.io" },
  { prefix: "tel", value: "+48 667 688 927", href: "tel:+48667688927" },
  {
    prefix: "loc",
    value: "Kosowska 12/3, 60-464 Poznań, Poland",
    href: null,
  },
];

/* ------------------------------------------------------------------ *
 *  CONTACT. The details on the left half of the grid, the form on the
 *  right, both on the page ground.
 *
 *  THE BAND MOVED OFF INK, and that is a real decision rather than a
 *  restyle. The form is a white plate with hairline fields, and the
 *  global focus ring inside an `on-dark` band is white: a white ring on
 *  a white input is not a ring, and there is no way to scope the ring
 *  back to ink for one subtree from here. Paper keeps every focus state
 *  on this page visible. The closing ask on ink is still carried by
 *  `Banner` and `CtaBand`, so the page keeps its dark plate.
 * ------------------------------------------------------------------ */
export default function Contact({
  locale,
  showIntro = true,
}: {
  locale: Locale;
  showIntro?: boolean;
}) {
  const dict = getDictionary(locale);
  const t = dict.contact;

  return (
    <section id="contact" className="bg-paper py-20 md:py-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          <div className="col-span-4 md:col-span-5">
            {showIntro && (
              <>
                <Reveal>
                  <h2 className="text-heading-lg text-ink">{t.title}</h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                    {t.subtitle}
                  </p>
                </Reveal>
              </>
            )}

            <Reveal delay={0.1}>
              <div
                className={`${showIntro ? "mt-10" : ""} flex flex-col gap-4 text-[1.125rem] leading-[1.375] text-ink`}
              >
                {details.map(({ prefix, value, href }) => {
                  const row = (
                    <>
                      <span className="text-[0.875rem] text-moss">{prefix}</span>
                      <span>{value}</span>
                    </>
                  );
                  return href ? (
                    <a
                      key={prefix}
                      href={href}
                      className="flex items-baseline gap-3 transition-colors hover:text-moss"
                    >
                      {row}
                    </a>
                  ) : (
                    <div key={prefix} className="flex items-baseline gap-3">
                      {row}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="col-span-4 md:col-span-6 md:col-start-7">
            <LeadForm
              t={dict.form}
              offering="general"
              submitLabel={t.submit}
              source="/contact"
              title={t.formTitle}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
