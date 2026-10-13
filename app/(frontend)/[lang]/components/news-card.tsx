import Image from "next/image";
import LocaleLink from "./locale-link";
import { SignetRing } from "./signet";
import { localeDateTag, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { NewsCard as NewsItem } from "@/lib/news";

type Categories = Dictionary["newsCategories"];

/**
 * "3 September 2026" / "3 września 2026". Formatted in Warsaw time: that is
 * the clock the editor picked the date on, so an article dated late in the
 * evening does not show the next day on a server running in UTC.
 */
export function formatNewsDate(value: string | null, locale: Locale): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(localeDateTag[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

/** The word for a stored category value, or nothing for one the dictionary does not know. */
export function newsCategoryLabel(category: string, categories: Categories): string | null {
  return (categories as Record<string, string | undefined>)[category] ?? null;
}

/**
 * The 16:9 picture of a news item. An item without a cover gets a grey panel
 * holding the signet, so a text-only item sits in the grid as a decision and
 * not as a card with a hole in it.
 */
export function NewsThumb({
  image,
  sizes,
  preload = false,
  className,
}: {
  image: NewsItem["image"];
  sizes: string;
  /** Only for the one picture above the fold. */
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative aspect-video overflow-hidden bg-grey-light",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          // Media on another origin is served as stored: the optimizer only
          // fetches hosts listed in next.config, and none are.
          unoptimized={!image.url.startsWith("/")}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-linear-to-b from-grey-light to-white">
          <SignetRing tone="dark" weight={0.7} className="h-[26%] w-auto" />
        </div>
      )}
    </div>
  );
}

/** Category and date, in fine print. Either part may be missing. */
export function NewsMeta({
  item,
  locale,
  categories,
  className,
}: {
  item: NewsItem;
  locale: Locale;
  categories: Categories;
  className?: string;
}) {
  const category = newsCategoryLabel(item.category, categories);
  const date = formatNewsDate(item.publishedAt, locale);
  if (!category && !date) return null;
  return (
    <p className={["text-fine text-grey", className].filter(Boolean).join(" ")}>
      {category}
      {category && date && <span aria-hidden="true"> · </span>}
      {date && item.publishedAt && <time dateTime={item.publishedAt}>{date}</time>}
    </p>
  );
}

/**
 * One news item in a grid. The whole card is the link, so the focus ring and
 * the blue hover run around the card and not around the title alone.
 */
export default function NewsCard({
  item,
  locale,
  categories,
  as: Heading = "h3",
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
}: {
  item: NewsItem;
  locale: Locale;
  categories: Categories;
  /** `h2` where the cards sit directly under the page title. */
  as?: "h2" | "h3";
  sizes?: string;
}) {
  return (
    <LocaleLink
      href={`/news/${item.slug}`}
      className="pc-tile flex h-full flex-col overflow-hidden"
    >
      <NewsThumb image={item.image} sizes={sizes} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <NewsMeta item={item} locale={locale} categories={categories} />
        <Heading className="text-lead">{item.title}</Heading>
      </div>
    </LocaleLink>
  );
}
