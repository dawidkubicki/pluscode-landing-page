import { Reveal } from "./motion";
import { TagPill } from "./ui";
import { PhoneIcon, MailIcon } from "./icons";
import ContactForm from "./contact-form";
import ReCaptchaProvider from "./recaptcha-provider";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Contact({
  locale,
  showIntro = true,
}: {
  locale: Locale;
  showIntro?: boolean;
}) {
  const t = getDictionary(locale).contact;
  const details = [
    {
      Icon: MailIcon,
      label: t.info.email,
      value: "contact@pluscode.io",
      href: "mailto:contact@pluscode.io",
    },
    {
      Icon: PhoneIcon,
      label: t.info.location,
      value: "+48 667 688 927",
      href: "tel:+48667688927",
    },
  ];

  return (
    <section id="contact" className="px-2 py-6 sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-20 text-bone sm:px-10 sm:py-28">
        <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 size-[26rem] rounded-full bg-lime/10 blur-3xl" />
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            {showIntro && (
              <>
                <Reveal>
                  <TagPill className="text-bone-soft">{t.label}</TagPill>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-tight text-bone sm:text-6xl">
                    {t.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-soft">
                    {t.subtitle}
                  </p>
                </Reveal>
              </>
            )}

            <Reveal delay={0.15}>
              <div className={`${showIntro ? "mt-10" : ""} space-y-4`}>
                {details.map(({ Icon, label, value, href }) => (
                  <a key={label} href={href} className="group flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full border border-night-line text-lime transition-colors group-hover:bg-lime group-hover:text-ink">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-bone-soft">
                        {label}
                      </span>
                      <span className="block text-lg text-bone">{value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 border-t border-night-line pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone-soft">
                  Pluscode Sp. z o.o.
                </p>
                <p className="mt-2 text-bone">
                  Kosowska 12/3
                  <br />
                  60-464 Poznań, Poland
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ReCaptchaProvider>
              <ContactForm t={t} />
            </ReCaptchaProvider>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
