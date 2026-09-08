import type { Metadata } from "next";
import Image from "next/image";

import { PageHero, CtaBand } from "../components/page-hero";
import Footer from "../components/footer";
import LocaleLink from "../components/locale-link";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import QuantyShowcase from "../components/quanty-showcase";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildOpenGraph } from "@/lib/seo";

export const revalidate = 60;

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/**
 * /quanty. The platform page for our own product.
 *
 * THE TEMPLATE IS NETCOMPANY'S PLATFORM PAGE, not its stylesheet. Read
 * netcompany.com/platforms/amplio/ and /platforms/easley-ai/ back to back
 * and the same nine moves appear in the same order on both: the platform's
 * own mark and a one line position, then one long declarative sentence
 * saying what the thing is with a short paragraph and a row of hard
 * figures under it, then proof of who uses it, then the product broken
 * into named parts with a paragraph each ("What is in the box?" is
 * literally their heading), then one large piece of product art, then the
 * ask with a named human beside it. That order is the argument a buyer
 * makes, so it is the order this page is built in, wearing our own tokens.
 *
 * THE BAND ORDER, and what each band is for:
 *
 *   1.  Hero        the wordmark and one sentence            (paper)
 *   2.  Showcase    the product, moving, two real captures   (carbon)
 *   3.  About       what it is, plus four hard facts         (paper)
 *   4.  Work        the six jobs people actually run on it   (paper-dim)
 *   5.  Audience    the six trades it is built for           (deep, ruled)
 *   6.  Box         the seven parts of the product           (paper, ruled)
 *   7.  Pluscode    who built it, and what that has to do    (paper-dim)
 *                   with the consulting work
 *   8.  Cta         the closing ask, to /book-a-call         (ink)
 *   9.  Footer                                               (carbon)
 *
 * Netcompany puts its product art low on the page. Ours goes second, in
 * band 2, because the single most persuasive thing about Quanty is that it
 * exists and can be photographed, and because Dawid asked for the
 * interface to move. Everything after it is evidence for what band 2
 * already showed.
 *
 * THE GRID IS VISIBLE ON TWO BANDS AND ONLY TWO. `.pc-ruled-dark` runs
 * under the six trades in band 5 and `.pc-ruled` under the seven parts in
 * band 6, because those are the two bands whose cells sit ON the columns
 * and the ruling is then a description of the layout rather than a
 * texture. Adding it to a band of running prose would make it wallpaper.
 *
 * THE ONE ACCENT, and why this page is allowed one. The site has no
 * resting accent colour: ember is hover only and the emphasis colour is
 * the ink. A platform page for a product that has its own brand is the one
 * place that breaks down, so this page carries QUANTY's colour, scoped to
 * `.pc-quanty` and to nothing else. It is not invented: the three values
 * below are read straight off quanty.ai, which publishes them on its own
 * shell element as `--accent`, `--accent-lift` and `--accent-deep`. They
 * are three steps of one hue, exactly as `--color-ember` has a second
 * pressed step, and they exist as three because no single step clears
 * 4.5:1 on both a pale and a dark ground.
 *
 * MEASURED, not assumed. Every pair this page actually paints:
 *
 *   #3e3e92 on paper    #e7ecec    7.63:1     eyebrows, figures, indices
 *   #3e3e92 on paper-dim #dfe5e5   7.14:1     eyebrows on the off band
 *   #9d9de6 on deep     #123836    5.11:1     the eyebrow on the green
 *   #9d9de6 on carbon   #0e1111    7.59:1     the showcase state label
 *   #5b5bd6 on paper    #e7ecec    4.50:1     the 2px rule over a figure,
 *                                             a graphic, needs 3:1
 *
 * The raw brand #5b5bd6 is deliberately NEVER used as text. It lands at
 * exactly 4.50:1 on the page ground, which is the threshold and not a
 * margin, and at 3.53:1 on carbon, which fails outright. Text takes
 * `--q-accent-deep` on a pale ground and `--q-accent-lift` on a dark one;
 * `--q-accent` is only ever a rule. If someone adds an accent surface
 * here later, re-measure before shipping it.
 *
 * QUANTY IS OURS AND THE PAGE SAYS SO TWICE, in band 7 in prose and in
 * the disclosure line under it. It is not a partnership, not a
 * certification and not a reseller arrangement. Never soften either one.
 * The product itself lives on another host, so every band that could
 * plausibly end a visit carries a marked external link to quanty.ai.
 */

/* The scoped theme. Same technique as `ITEM_CSS` in platform.tsx: an
 * unlayered stylesheet next to the markup that uses it, so it beats the
 * utilities layer without `!important` and so the three custom properties
 * resolve on `.pc-quanty` and nowhere above it. The three helper classes
 * exist because `text-[var(--x)]` is ambiguous to Tailwind (it cannot tell
 * a colour from a font-size), and a class is easier to grep than a dozen
 * inline styles. */
const THEME_CSS = `
.pc-quanty {
  --q-accent: #5b5bd6;
  --q-accent-lift: #9d9de6;
  --q-accent-deep: #3e3e92;
}
.pc-quanty .q-mark {
  color: var(--q-accent-deep);
}
.pc-quanty .q-mark-dark {
  color: var(--q-accent-lift);
}
.pc-quanty .q-rule {
  border-top-color: var(--q-accent);
}
`;

/** quanty.ai is a separate host, so every link to it is a plain anchor and
 *  never a LocaleLink: there is no /pl of it to stay inside. The arrow is
 *  decoration, so it is hidden and the accessible name is just the label.
 *  The colour sits on the anchor and `pc-link` on the span inside it,
 *  because `.pc-link` sets `color: inherit` and is declared after
 *  Tailwind's own utilities in the same layer. */
function ExternalLink({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href="https://quanty.ai"
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <span className="pc-link">{label}</span>
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).quantyPage;
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: `/${locale}/quanty` },
    openGraph: buildOpenGraph(locale, {
      title: t.meta.title,
      description: t.meta.description,
      path: "/quanty",
    }),
  };
}

export default async function QuantyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).quantyPage;

  return (
    <main className="pc-quanty">
      {/* A <style> element renders nothing and takes no grid cell. The
          child is a static module constant, never dictionary or CMS
          content, so nothing user supplied can reach a stylesheet. */}
      <style>{THEME_CSS}</style>

      {/* 1. HERO. The product's own wordmark stands where the h1's words
             would, exactly as it does in the home page's Platform band and
             for the same reason: Quanty has a mark and this page is about
             Quanty. The dark cut here, because the page ground is pale.
             The heading text lives in the alt, so a screen reader reads
             "Quanty" as the page's h1.

             `unoptimized` is required, not a preference: /_next/image
             refuses svg unless `images.dangerouslyAllowSVG` is set, and
             turning that on site-wide for one 3KB vector would be a real
             XSS surface. See the same note in platform.tsx. */}
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={
          <Image
            src="/assets/quanty/quanty-dark.svg"
            alt={t.hero.logoAlt}
            width={758}
            height={174}
            unoptimized
            className="h-12 w-auto md:h-16"
          />
        }
        intro={t.hero.intro}
        cta={{ label: t.hero.cta, href: "/book-a-call" }}
      />

      {/* 2. SHOWCASE. Carbon, not ink: the captures' own ground is
             #101418 inside a near black window frame, and carbon #0e1111
             is the one band colour it sits on without a visible seam. */}
      <section
        id="showcase"
        className="on-dark scroll-mt-24 bg-carbon py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-5">
              <p className="q-mark-dark text-[0.875rem]">{t.showcase.eyebrow}</p>
              <h2 className="mt-4 text-heading-lg text-white">
                {t.showcase.title}
              </h2>
            </Reveal>

            <Reveal
              delay={0.06}
              className="col-span-4 mt-8 md:col-span-6 md:col-start-7 md:mt-0 md:self-end"
            >
              <p className="max-w-[52ch] text-[1.125rem] leading-[1.375] text-mist">
                {t.showcase.intro}
              </p>
              <ExternalLink
                label={t.showcase.tryIt}
                className="mt-6 inline-block text-[1rem] text-sage"
              />
            </Reveal>

            <QuantyShowcase frames={t.showcase.frames} />
          </div>
        </div>
      </section>

      {/* 3. ABOUT. Netcompany's second band: one long declarative
             sentence, a short paragraph either side of the grid's middle,
             and a row of hard figures. The figures are the only numbers on
             this page and every one of them is checkable. */}
      <section
        id="what-it-is"
        className="scroll-mt-24 bg-paper py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-9">
              <p className="q-mark text-[0.875rem]">{t.about.eyebrow}</p>
              <h2 className="mt-4 text-heading-lg text-ink">{t.about.title}</h2>
            </Reveal>

            {/* Ten columns holding two cells of five. A nested grid with
                the same 24px gutter lands its cells exactly on the outer
                columns, so this reads as columns 1 to 5 and 7 to 11. */}
            <Reveal
              delay={0.06}
              className="col-span-4 mt-10 grid gap-x-4 gap-y-6 md:col-span-10 md:mt-14 md:grid-cols-2 md:gap-x-6"
            >
              {t.about.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[1.125rem] leading-[1.375] text-moss"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {/* The four figures. A 2px rule in the raw Quanty accent is the
                page's one filled use of that colour; it is a graphic and
                measures 4.50:1 on the page ground, well over the 3:1 a
                graphic needs. The figure itself is text, so it takes the
                deep step at 7.63:1 instead.

                A nested grid rather than four grid children, so the two
                rows on a phone are separated by one gap instead of by four
                identical top margins. Four cells over twelve columns at
                the shell's own 24px gutter measure 3 columns plus 2
                gutters each, which is exactly a `col-span-3`, so the cells
                still land on the outer grid. */}
            <Stagger
              className="col-span-4 mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:col-span-12 md:mt-20 md:grid-cols-4 md:gap-x-6"
              gap={0.05}
            >
              {t.about.facts.map((fact) => (
                <StaggerItem key={fact.key} className="q-rule border-t-2 pt-5">
                  <p className="q-mark text-heading-md">{fact.figure}</p>
                  <p className="mt-3 text-[1rem] leading-[1.375] text-moss">
                    {fact.label}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* 4. WORK. Netcompany's "featured cases" slot. We have no published
             Quanty case studies, so it holds the six jobs the product
             names on its own site instead, which is the same answer to the
             same question: what do people actually put in it. */}
      <section
        id="everyday-work"
        className="scroll-mt-24 bg-paper-dim py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-6">
              <p className="q-mark text-[0.875rem]">{t.work.eyebrow}</p>
              <h2 className="mt-4 text-heading-lg text-ink">{t.work.title}</h2>
            </Reveal>
            <Reveal
              delay={0.06}
              className="col-span-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0 md:self-end"
            >
              <p className="text-[1.125rem] leading-[1.375] text-moss">
                {t.work.intro}
              </p>
            </Reveal>

            {/* Three across on the page, one on a phone. Three cells over
                twelve columns measure 4 columns plus 3 gutters each, which
                is exactly a `col-span-4`, so the nested grid sits on the
                outer one and the six hairlines line up with the columns of
                every other band. */}
            <Stagger
              className="col-span-4 mt-12 grid gap-x-4 gap-y-10 md:col-span-12 md:mt-20 md:grid-cols-3 md:gap-x-6 md:gap-y-14"
              gap={0.05}
            >
              {t.work.items.map((item) => (
                <StaggerItem key={item.key} className="border-t border-rule pt-5">
                  <h3 className="text-heading-sm text-ink">{item.name}</h3>
                  <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
                    {item.body}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* 5. AUDIENCE. The green band, and the first of the two places the
             column ruling is visible: six cells of two columns each land
             on the grid exactly, so the pinstripe behind them is a
             description of the layout. `on-dark` next to `bg-deep` is not
             cosmetic, it is what turns the focus ring white. */}
      <section
        id="built-for"
        className="on-dark pc-ruled-dark scroll-mt-24 bg-deep py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-6">
              <p className="q-mark-dark text-[0.875rem]">
                {t.audience.eyebrow}
              </p>
              <h2 className="mt-4 text-heading-lg text-white">
                {t.audience.title}
              </h2>
            </Reveal>
            <Reveal
              delay={0.06}
              className="col-span-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0 md:self-end"
            >
              <p className="text-[1.125rem] leading-[1.375] text-mist">
                {t.audience.intro}
              </p>
            </Reveal>

            {/* Two across on a phone, six across on the page. Six cells
                over twelve columns measure 2 columns plus 1 gutter each,
                which is exactly a `col-span-2`, so the hairlines land on
                the ruling drawn behind them. A list of facts, so the cells
                are not links and have no hover, the same rule the home
                page's trade row follows. */}
            <div className="col-span-4 mt-12 grid grid-cols-2 gap-x-4 gap-y-9 md:col-span-12 md:mt-20 md:grid-cols-6 md:gap-x-6">
              {t.audience.items.map((item) => (
                <div key={item.key} className="border-t border-rule-deep pt-5">
                  <p className="text-[1.125rem] leading-[1.375] text-white">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[1rem] leading-[1.375] text-sage">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOX. Netcompany's "What is in the box?", rebuilt as seven
             ruled rows rather than seven cards, because the parts are not
             peers competing for a click: they are one product described in
             order. Each row nests a 12 column grid inside a 12 column
             cell, which is the full content width, so the index, the name
             and the paragraph land on the outer columns and the ruling
             behind them lines up with all three. */}
      <section
        id="in-the-box"
        className="pc-ruled scroll-mt-24 bg-paper py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-6">
              <p className="q-mark text-[0.875rem]">{t.box.eyebrow}</p>
              <h2 className="mt-4 text-heading-lg text-ink">{t.box.title}</h2>
            </Reveal>
            <Reveal
              delay={0.06}
              className="col-span-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0 md:self-end"
            >
              <p className="text-[1.125rem] leading-[1.375] text-moss">
                {t.box.intro}
              </p>
            </Reveal>

            <div className="col-span-4 mt-12 md:col-span-12 md:mt-20">
              {t.box.items.map((item, i) => (
                <Reveal key={item.key} delay={0.03 * i}>
                  <div className="border-t border-rule pt-6 pb-8 md:pt-8 md:pb-10">
                    <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
                      {/* The index is generated, not translated: digits
                          read the same in all three languages. */}
                      <p
                        aria-hidden="true"
                        className="q-mark col-span-4 text-[0.875rem] md:col-span-1"
                      >
                        {`.${String(i + 1).padStart(2, "0")}`}
                      </p>
                      <div className="col-span-4 mt-2 md:col-span-4 md:col-start-2 md:mt-0">
                        <h3 className="text-heading-sm text-ink">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-[1.125rem] leading-[1.375] text-ink">
                          {item.line}
                        </p>
                      </div>
                      <p className="col-span-4 mt-4 text-[1.125rem] leading-[1.375] text-moss md:col-span-6 md:col-start-7 md:mt-0">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PLUSCODE. The disclosure band. Netcompany closes with a named
             human beside the ask; ours closes with the plain statement of
             who owns the thing, which is the same move: a page about a
             product should end by telling you who is behind it. */}
      <section
        id="pluscode"
        className="scroll-mt-24 bg-paper-dim py-20 md:py-[104px]"
      >
        <div className="pc-shell">
          <div className="pc-grid">
            <Reveal className="col-span-4 md:col-span-6">
              <p className="q-mark text-[0.875rem]">{t.pluscode.eyebrow}</p>
              <h2 className="mt-4 text-heading-lg text-ink">
                {t.pluscode.title}
              </h2>
            </Reveal>

            <Reveal
              delay={0.06}
              className="col-span-4 mt-8 md:col-span-5 md:col-start-8 md:mt-0"
            >
              {t.pluscode.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-5 text-[1.125rem] leading-[1.375] text-moss first:mt-0"
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <LocaleLink href="/services" className="btn btn-primary">
                  {t.pluscode.servicesCta}
                </LocaleLink>
                <ExternalLink
                  label={t.pluscode.externalCta}
                  className="text-[1rem] text-moss"
                />
              </div>
            </Reveal>

            {/* The disclosure. Full label contrast, in the flow of the
                band, never tucked into a corner and never softened into
                partner language. moss on paper-dim is 5.39:1. */}
            <p className="col-span-4 mt-14 border-t border-rule pt-5 text-[0.875rem] text-moss md:col-span-12 md:mt-20">
              {t.pluscode.ownership}
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={t.cta.title}
        text={t.cta.text}
        cta={{ label: t.cta.button, href: "/book-a-call" }}
      />
      <Footer locale={locale} />
    </main>
  );
}
