import { Reveal } from "./motion";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Quiet social-proof strip directly under the hero — a text logo cloud of
 *  selected clients. Front-loads credibility before the pitch. */
export default function Trust({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).trust;

  return (
    <section className="border-b border-cream-line bg-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-11 sm:px-10 sm:py-12">
        <Reveal>
          <p className="text-center font-mono text-[12px] uppercase tracking-[0.18em] text-ink-mute">
            {t.label}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {t.clients.map((client) => (
              <li
                key={client}
                className="font-serif text-xl font-medium text-ink/45 transition-colors hover:text-ink/70 sm:text-[1.6rem]"
              >
                {client}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
