import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Plus } from "./ui";
import { type VisualKind } from "./visual";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type ServiceKey =
  | "machineLearning"
  | "analytics"
  | "consulting"
  | "webDevelopment"
  | "mobile"
  | "cloud";

type Entry = { title: string; description: string };
type ServiceData = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  features: Record<string, Entry>;
  process: Record<string, Entry>;
  cta: { title: string; subtitle: string; button: string };
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
      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <article className="flex h-full flex-col rounded-3xl border border-cream-line bg-cream-dim/40 p-7 transition-colors duration-300 hover:border-lime/40">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-lime/15 text-lime-deep">
                    <Plus className="size-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-medium text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {f.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream-dim px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center">
            <Reveal className="flex justify-center">
              <TagPill className="text-ink-soft">{d.label}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {d.title}
              </h2>
            </Reveal>
          </div>
          <Stagger
            className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line sm:grid-cols-2 lg:grid-cols-4"
            gap={0.1}
          >
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="h-full">
                <div className="flex h-full flex-col bg-cream p-8">
                  <span className="display text-5xl text-lime-deep">
                    {numbers[i]}
                  </span>
                  <h3 className="mt-8 text-xl font-medium text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {s.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

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
