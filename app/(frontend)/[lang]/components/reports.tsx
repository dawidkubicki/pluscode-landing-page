import { Reveal } from "./motion";
import { Visual, type VisualKind } from "./visual";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getReports, type ReportCard } from "@/lib/reports";

const ctaCls =
  "inline-block rounded-[2px] border border-white/60 px-7 py-3.5 text-[15px] font-semibold text-bone transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-white";

const fallbackVisuals: VisualKind[] = ["aurora", "mesh", "nodes", "grid"];

function ReportCta({ report }: { report: ReportCard }) {
  if (!report.href.startsWith("/")) {
    return (
      <a href={report.href} target="_blank" rel="noopener noreferrer" className={ctaCls}>
        {report.ctaLabel}
      </a>
    );
  }
  return (
    <LocaleLink href={report.href} className={ctaCls}>
      {report.ctaLabel}
    </LocaleLink>
  );
}

/** Stacked report promos, near full width with alternating copy/image sides.
 *  Content is managed in Payload ("Reports" collection), with static fallbacks. */
export default async function Reports({ locale }: { locale: Locale }) {
  const reports = await getReports(locale);
  if (reports.length === 0) return null;

  return (
    <section id="reports" className="bg-night-deep text-bone">
      <div className="mx-auto max-w-[1500px] space-y-24 px-5 py-20 sm:px-10 sm:py-[7rem] lg:space-y-36">
        {reports.map((report, i) => {
          const flipped = i % 2 === 1;
          return (
            <div
              key={`${report.title}-${i}`}
              className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16"
            >
              <Reveal className={flipped ? "lg:order-2" : undefined}>
                <div className={flipped ? "lg:pl-4" : "lg:pr-4"}>
                  <div className="mb-6 text-[17px] font-medium text-lime-soft">
                    {report.eyebrow}
                  </div>
                  <h2 className="max-w-[640px] font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">
                    {report.title}
                  </h2>
                  <p className="mt-7 max-w-[600px] text-[16.5px] leading-[1.7] text-bone-soft">
                    {report.description}
                  </p>
                  <div className="mt-10">
                    <ReportCta report={report} />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1} className={flipped ? "lg:order-1" : undefined}>
                <div className="h-[320px] overflow-hidden rounded sm:h-[440px] lg:h-[560px]">
                  {report.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={report.image.url}
                      alt={report.image.alt}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Visual kind={fallbackVisuals[i % fallbackVisuals.length]} />
                  )}
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
