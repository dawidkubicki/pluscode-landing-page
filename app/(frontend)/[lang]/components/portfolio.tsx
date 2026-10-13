import Image from "next/image";
import type { Product } from "@/lib/products";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "./motion";
import { ArrowLink, Container, ExternalIcon, Label, Statement } from "./ui";
import { SignetRing } from "./signet";
import { mediaInfo, passthrough } from "./home/media";

/**
 * The portfolio section, shared by the home page and About. It is a complete
 * `<section>` with its own vertical rhythm and page column: drop it straight
 * into `<main>`, do not wrap it in another section or container.
 *
 * The reference lays its portfolio out as a grid of square logo cards. With
 * one product that grid would read as three cards missing, so each product is
 * an entry of its own on the same four columns: the square logo card and the
 * words in the first, the product itself across the other three. A second
 * product is a second entry below the first.
 */
export default function Portfolio({
  label,
  statement,
  products,
  ui,
}: {
  label: string;
  statement: string;
  products: Product[];
  ui: Dictionary["ui"];
}) {
  return (
    <section className="pc-section" aria-label={label}>
      <Container>
        <Label as="h2">{label}</Label>
        <Statement text={statement} className="mt-4 max-w-[44rem]" />

        {products.length > 0 && (
          <ul className="mt-14 grid gap-y-20 lg:mt-20 lg:gap-y-28">
            {products.map((product) => (
              <Reveal as="li" key={product.slug}>
                <ProductEntry product={product} ui={ui} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProductEntry({
  product,
  ui,
}: {
  product: Product;
  ui: Dictionary["ui"];
}) {
  const logo = mediaInfo(product.logo.url);
  const capture = product.image ? mediaInfo(product.image.url) : null;
  const showCapture = Boolean(product.image && capture?.exists);
  // A capture's own proportions when the manifest knows them, so the hairline
  // sits on the image's edge. Otherwise a 16:10 frame, and the image is fitted
  // inside it whole.
  const ratio =
    capture?.width && capture.height ? `${capture.width} / ${capture.height}` : "16 / 10";

  return (
    <article
      className={
        showCapture
          ? "grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3 xl:grid-cols-4 xl:grid-rows-[auto_1fr]"
          : "grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3 xl:grid-cols-4"
      }
    >
      <a
        href={product.url}
        target="_blank"
        rel="noopener"
        className="pc-card aspect-[3/2] flex-col overflow-hidden sm:aspect-square"
      >
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 border border-grey-soft px-2.5 py-0.5 text-fine text-grey">
            {product.badge}
          </div>
        )}
        <div className="relative flex flex-1 items-center justify-center">
          <SignetRing
            tone="dark"
            weight={0.18}
            className="absolute top-1/2 left-1/2 h-[88%] max-w-[82%] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
          />
          {logo.exists ? (
            <div className="relative h-[30%] w-[55%]">
              <Image
                src={product.logo.url}
                alt=""
                fill
                sizes="(min-width: 640px) 12rem, 55vw"
                className="object-contain"
                unoptimized={passthrough(product.logo.url)}
              />
            </div>
          ) : (
            <div aria-hidden="true" className="relative text-title">
              {product.name}
            </div>
          )}
        </div>
        <div className="flex h-12 items-center justify-between px-4">
          <h3 className="text-small">{product.name}</h3>
          <ExternalIcon />
          <span className="sr-only">, {ui.opensInNewTab}</span>
        </div>
      </a>

      <div
        className={
          showCapture
            ? "sm:col-span-2 xl:col-span-1 xl:row-start-2"
            : "sm:col-span-2 xl:max-w-[32rem]"
        }
      >
        <p className="text-title">{product.tagline}</p>
        <p className="mt-4 max-w-[32rem] text-grey">{product.description}</p>
        <ArrowLink href={product.url} newTabLabel={ui.opensInNewTab} className="mt-6 min-h-11">
          {ui.visit} {hostname(product.url)}
        </ArrowLink>
      </div>

      {showCapture && product.image && (
        <div className="pc-card items-center justify-center p-4 sm:col-span-3 sm:p-8 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:p-10">
          <div
            className="relative w-full border border-grey-mid bg-white"
            style={{ aspectRatio: ratio }}
          >
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1440px) 55rem, (min-width: 1280px) 60vw, 90vw"
              className="object-contain"
              placeholder={capture?.blurDataURL ? "blur" : "empty"}
              blurDataURL={capture?.blurDataURL ?? undefined}
              unoptimized={passthrough(product.image.url)}
            />
          </div>
        </div>
      )}
    </article>
  );
}
