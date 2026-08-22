import type { ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Visual, type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getUseCases, type UseCaseCard } from "@/lib/use-cases";

/** Placeholder art shown until real imagery is uploaded in Payload. */
const fallbackVisuals: VisualKind[] = ["mesh", "nodes", "aurora", "grid", "portrait"];

function Card({
  useCase,
  visual,
  featured = false,
}: {
  useCase: UseCaseCard;
  visual: VisualKind;
  featured?: boolean;
}) {
  const inner = (
    <div
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded ${
        featured ? "min-h-[420px] lg:min-h-full" : "min-h-[300px]"
      }`}
    >
      {useCase.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={useCase.image.url}
          alt={useCase.image.alt}
          className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <Visual kind={visual} className="absolute inset-0 -z-20" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
      <div className={`p-6 ${featured ? "sm:p-8" : ""}`}>
        {useCase.category && (
          <div className="mb-2 text-[13px] text-white/85">{useCase.category}</div>
        )}
        <h3
          className={`font-semibold leading-[1.3] text-white ${
            featured ? "text-2xl sm:text-[1.75rem]" : "text-lg"
          }`}
        >
          {useCase.title} <span className="text-lime-soft">›</span>
        </h3>
      </div>
    </div>
  );

  if (useCase.href) {
    const external = !useCase.href.startsWith("/");
    if (external) {
      return (
        <a href={useCase.href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {inner}
        </a>
      );
    }
    return (
      <LocaleLink href={useCase.href} className="block h-full">
        {inner}
      </LocaleLink>
    );
  }
  return inner;
}

export default async function UseCases({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).useCases;
  const cases = await getUseCases(locale, 5);
  if (cases.length === 0) return null;

  const [featured, ...rest] = cases;

  return (
    <section id="use-cases" className="bg-night text-bone">
      <div className="mx-auto max-w-[1300px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
        <div className="mb-14 text-center">
          <Reveal>
            <div className="mb-5 font-mono text-[13px] uppercase tracking-[0.18em] text-bone-dim">
              {t.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-[2.75rem] font-medium tracking-[-0.01em] sm:text-5xl lg:text-[3.375rem]">
              {t.title}
            </h2>
          </Reveal>
        </div>

        <Stagger
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
          gap={0.08}
        >
          {rest.map((uc, i): ReactNode => (
            <StaggerItem key={uc.id} className="h-full">
              <Card useCase={uc} visual={fallbackVisuals[(i + 1) % fallbackVisuals.length]} />
            </StaggerItem>
          ))}
          <StaggerItem className="h-full sm:col-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:col-span-1">
            <Card useCase={featured} visual={fallbackVisuals[0]} featured />
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
