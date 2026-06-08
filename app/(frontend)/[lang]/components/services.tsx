import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type IconProps = { className?: string };

function AiIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="7" y="7" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
function WebIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 8h18" stroke="currentColor" strokeWidth="1.7" />
      <path d="m10 12-2 2 2 2M14 12l2 2-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MobileIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function CloudIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9.2 3.5 3.5 0 0 1 17 18H7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const items = [
  { key: "ai", href: "/ai-data/machine-learning", Icon: AiIcon },
  { key: "web", href: "/services/web-development", Icon: WebIcon },
  { key: "mobile", href: "/services/mobile", Icon: MobileIcon },
  { key: "cloud", href: "/services/cloud", Icon: CloudIcon },
] as const;

export default function Services({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).services;

  return (
    <section id="services" className="px-2 py-6 sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-24 text-bone sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <TagPill className="text-bone-soft">{t.title}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="max-w-2xl text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
                {t.subtitle}
              </h2>
            </Reveal>
          </div>

          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {items.map(({ key, href, Icon }) => {
              const item = t.items[key];
              return (
                <StaggerItem key={key}>
                  <LocaleLink
                    href={href}
                    className="group flex h-full flex-col rounded-3xl border border-night-line bg-night-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40"
                  >
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-ink">
                      <Icon className="size-6" />
                    </span>
                    <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-lime">
                      {item.tagline}
                    </span>
                    <h3 className="mt-2 text-xl font-medium text-bone">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-bone-soft">
                      {item.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
                      <Arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </LocaleLink>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
