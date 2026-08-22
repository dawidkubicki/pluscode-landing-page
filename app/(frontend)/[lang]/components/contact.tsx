import { Reveal } from "./motion";
import ContactForm from "./contact-form";
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

export default function Contact({
  locale,
  showIntro = true,
}: {
  locale: Locale;
  showIntro?: boolean;
}) {
  const t = getDictionary(locale).contact;

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-night text-bone">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-20 sm:px-10 sm:py-[6.875rem] lg:grid-cols-2 lg:gap-[5.625rem]">
        <div>
          {showIntro && (
            <>
              <Reveal>
                <h2 className="text-balance font-serif text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[3.25rem]">
                  {t.title}
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-[460px] text-[17px] leading-[1.7] text-bone-soft">
                  {t.subtitle}
                </p>
              </Reveal>
            </>
          )}

          <Reveal delay={0.1}>
            <div className={`${showIntro ? "mt-9" : ""} flex flex-col gap-3.5 text-[15px] text-bone-dim`}>
              {details.map(({ prefix, value, href }) => {
                const row = (
                  <>
                    <span className="font-mono text-lime-soft">{prefix}</span>
                    <span>{value}</span>
                  </>
                );
                return href ? (
                  <a
                    key={prefix}
                    href={href}
                    className="flex items-baseline gap-3 transition-colors hover:text-bone"
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

        <Reveal delay={0.1}>
          <ContactForm t={t} />
        </Reveal>
      </div>
    </section>
  );
}
