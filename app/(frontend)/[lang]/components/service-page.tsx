import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { type VisualKind } from "./visual";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type ServiceKey =
  | "machineLearning"
  | "analytics"
  | "consulting"
  | "webDevelopment"
  | "mobile"
  | "cloud"
  | "teamExtension";

type Entry = { title: string; description: string };
type Faq = { q: string; a: string };
type ServiceData = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  features: Record<string, Entry>;
  process: Record<string, Entry>;
  cta: { title: string; subtitle: string; button: string };
  faqTitle?: string;
  faq?: Faq[];
};

const numbers = ["01", "02", "03", "04", "05", "06"];

export default function ServicePage({
  locale,
  service,
  visual = "grid",
}: {
  locale: Locale;
  service: ServiceKey;
  visual?: VisualKind;
}) {
  const d = getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
  const features = Object.values(d.features);
  const steps = Object.values(d.process);

  return (
    <main>
      <PageHero
        eyebrow={d.label}
        title={d.title}
        intro={d.subtitle}
        visual={visual}
        cta={{ label: d.cta.button, href: "/contact" }}
      />

      {/* Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Stagger
            className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
            gap={0.06}
          >
            {features.map((f, i) => (
              <StaggerItem key={f.title} className="h-full">
                <article className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream sm:p-8">
                  <span className="font-serif text-3xl font-light text-[#c3cede]">
                    {numbers[i]}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{f.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                    {f.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <div className="text-center">
            <Reveal>
              <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
                {d.label}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {d.title}
              </h2>
            </Reveal>
          </div>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-4"
            gap={0.08}
          >
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="h-full">
                <div className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 sm:p-8">
                  <span className="font-serif text-5xl font-light text-lime">
                    {numbers[i]}
                  </span>
                  <h3 className="mt-7 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
                    {s.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {d.faq && d.faq.length > 0 && (
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {d.faqTitle ?? "FAQ"}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {d.faq.map((item) => (
                <StaggerItem key={item.q}>
                  <details className="group rounded border border-cream-line bg-white p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-ink-soft">{item.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.subtitle}
        cta={{ label: d.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}

/** Shared metadata helper for service pages. */
export function serviceMetadata(locale: Locale, service: ServiceKey) {
  const d = getDictionary(locale).pages.services[
    service
  ] as unknown as ServiceData;
  return { title: d.title, description: d.subtitle };
}
