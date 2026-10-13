import { useId } from "react";
import type { NewsCard } from "@/lib/news";
import { localeDateTag, type Locale } from "@/lib/i18n/config";
import LocaleLink from "../locale-link";
import { ArrowLink, ArrowRightIcon, Container } from "../ui";

/**
 * The latest news as ruled rows. Renders nothing when there is none: an empty
 * heading would be a promise the page does not keep.
 */
export default function NewsTeaser({
  locale,
  heading,
  allLabel,
  items,
}: {
  locale: Locale;
  heading: string;
  allLabel: string;
  items: NewsCard[];
}) {
  const headingId = useId();
  if (items.length === 0) return null;

  const formatDate = new Intl.DateTimeFormat(localeDateTag[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="pc-section pt-0!" aria-labelledby={headingId}>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <h2 id={headingId} className="text-title">
            {heading}
          </h2>
          <ArrowLink href="/news" className="min-h-11">
            {allLabel}
          </ArrowLink>
        </div>

        <ul className="mt-10 border-t border-grey-mid">
          {items.map((item) => (
            <li key={item.slug} className="border-b border-grey-mid">
              <LocaleLink
                href={`/news/${item.slug}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 transition-colors duration-300 hover:text-blue md:grid-cols-[11rem_minmax(0,1fr)_auto] md:py-7"
              >
                {item.publishedAt ? (
                  <time
                    dateTime={item.publishedAt}
                    className="col-span-2 text-fine text-grey md:col-span-1"
                  >
                    {formatDate.format(new Date(item.publishedAt))}
                  </time>
                ) : (
                  <span className="hidden md:block" />
                )}
                <h3 className="text-lead">{item.title}</h3>
                <ArrowRightIcon className="h-2.5 w-4 flex-none transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </LocaleLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
