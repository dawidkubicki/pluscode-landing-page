import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill } from "./ui";
import { Visual, type VisualKind } from "./visual";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const featureVisuals: VisualKind[] = ["nodes", "grid", "mesh"];

/**
 * "+150 projects" highlight band — mirrors the FH Trade template: a headline
 * figure with supporting copy, plus three cards that frame what we do.
 */
export default function Highlight({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.highlight;
  return (
    <section className="px-2 py-6 sm:px-3">
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-20 text-bone sm:px-10 sm:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
            <Reveal>
              <div>
                <TagPill className="text-bone-soft">{t.tag}</TagPill>
                <p className="display mt-6 text-6xl text-lime sm:text-7xl lg:text-8xl">
                  {t.amount}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-4 lg:pb-2">
                <p className="text-xl font-medium leading-snug text-bone sm:text-2xl">
                  {t.text}
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-bone-soft">
                  {t.text2}
                </p>
              </div>
            </Reveal>
          </div>

          <Stagger
            className="mt-14 grid gap-5 border-t border-night-line pt-12 sm:grid-cols-3"
            gap={0.1}
          >
            {t.features.map((f, i) => (
              <StaggerItem key={f.title}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-night-line bg-night-soft/40">
                  <div className="h-28 overflow-hidden">
                    <Visual kind={featureVisuals[i % featureVisuals.length]} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-medium text-bone">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-bone-soft">
                      {f.text}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
