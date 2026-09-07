import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "./icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialLinks, QUANTY_URL, type SocialKey } from "@/lib/social";

/* Every footer link is a 44px tap target. The row pitch is the target, not a
   gap: `min-h-11` on an `inline-flex` row tiles the column at 44px and the
   list needs no `gap` of its own. */
const linkCls =
  "inline-flex min-h-11 items-center text-[15px] text-bone-dim transition-colors duration-300 ease-io-attio hover:text-bone hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone-dim";

const colTitleCls =
  "block pb-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-bone";

/* The 12px legal row sits on `night`, where `bone-dim` measures 4.6:1: a
   pass, but a thin one at that size. It is set in `bone-soft` (9:1) instead. */
const legalCls =
  "inline-flex min-h-11 items-center text-[12px] text-bone-soft transition-colors duration-300 ease-io-attio hover:text-bone hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone-dim";

const socialIcons: Record<SocialKey, typeof LinkedInIcon> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

/**
 * Site footer.
 *
 * Three structural changes this round, no new content.
 *
 * 1. ONTO `.pc-shell`. It carried its own `max-w-[1240px] px-5 sm:px-10`, the
 *    third grid on a site that should have one, so the footer's left edge sat
 *    58px inboard of every band above it. It now uses the same shell, the same
 *    24 column field and `col-[2/-2]`, with `.pc-rules-dark` continuing the two
 *    vertical hairlines down onto the dark ground.
 *
 * 2. THREE HAND-BUILT COLUMNS BECOME CSS MULTI-COLUMN. `columns-*` with
 *    `break-inside-avoid` on each group, stepping 1 to 2 to 3 to 4. Groups of
 *    unequal length balance themselves, so a dictionary that adds a link no
 *    longer leaves one column 44px taller than its neighbours.
 *
 * 3. A BOTTOM BAR on `night`, one step up from the footer's `night-deep`, with
 *    the social marks left and the legal and registry lines right at 12px. It
 *    gives the page a real terminal edge instead of trailing off into a
 *    copyright line floating on the same ground as the links.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = dict.navigation;
  const f = dict.footer;

  /** `footer.ourProduct` may not have landed in every dictionary yet. */
  const ourProduct = (f as typeof f & { ourProduct?: string }).ourProduct;

  /** Same guard for the Forward Deployed Engineers entry. */
  const fde = (
    nav.servicesItems as typeof nav.servicesItems & {
      forwardDeployedEngineers?: { title: string };
    }
  ).forwardDeployedEngineers;

  // Five links a group at most. The footer used to carry every route the
  // site has, which is what /site-map is for; a wall of eight makes the one
  // link a visitor wants harder to find, not easier.
  const groups: {
    title: string;
    links: { label: string; href: string; external?: boolean }[];
  }[] = [
    {
      title: nav.aiData,
      links: [
        {
          label: nav.aiDataItems.machineLearning.title,
          href: "/ai-data/machine-learning",
        },
        {
          label: nav.aiDataItems.dataAnalytics.title,
          href: "/ai-data/analytics",
        },
        { label: nav.aiDataItems.aiConsulting.title, href: "/ai-data/consulting" },
      ],
    },
    {
      title: nav.services,
      links: [
        ...(fde
          ? [{ label: fde.title, href: "/services/forward-deployed-engineers" }]
          : []),
        {
          label: nav.servicesItems.softwareDevelopment.title,
          href: "/services/software-development",
        },
        {
          label: nav.servicesItems.mvpDevelopment.title,
          href: "/services/mvp-development",
        },
        {
          label: nav.servicesItems.webDevelopment.title,
          href: "/services/web-development",
        },
        { label: nav.allServices, href: "/services" },
      ],
    },
    {
      title: f.columns.company,
      links: [
        { label: nav.about, href: "/about" },
        { label: nav.caseStudies, href: "/case-studies" },
        { label: nav.insights, href: "/insights" },
        { label: f.sitemap, href: "/site-map" },
        ...(ourProduct
          ? [{ label: ourProduct, href: QUANTY_URL, external: true }]
          : []),
      ],
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-night-line bg-night-deep text-bone-dim">
      <div className="pc-shell">
        <div className="pc-rules-dark">
          {/* Brand beside the field, not stacked above it. Stacking cost the
              band 170px of height for a logo and one sentence, and the height
              of this footer is set by its tallest link group either way. */}
          <div className="pc-grid pb-11 pt-12 lg:pt-14">
            <div className="col-[2/-2] flex flex-col gap-10 lg:flex-row lg:gap-14">
              <div className="lg:w-[22%] lg:shrink-0">
                <LocaleLink
                  href="/"
                  aria-label="Pluscode home"
                  className="inline-flex min-h-11 items-center"
                >
                  {/* The white mark, the only one that reads on `night-deep`. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/logo/pluscode-logo.svg"
                    alt="Pluscode"
                    className="h-8 w-auto"
                  />
                </LocaleLink>
                <p className="mt-2 max-w-[26em] text-[15px] leading-[1.5] text-bone-soft">
                  {f.tagline}
                </p>
                <LocaleLink
                  href="/book-a-call"
                  className="btn btn-primary mt-5"
                >
                  {nav.getInTouch}
                </LocaleLink>
              </div>

              {/* The link field. One multi-column flow, not three hand-built
                  columns: the groups are unequal and the browser balances
                  them, so a dictionary that adds a link cannot leave one
                  column standing 44px taller than its neighbours. */}
              <div className="min-w-0 flex-1 columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
                {groups.map((g) => (
                  <div key={g.title} className="mb-8 break-inside-avoid">
                    <span className={colTitleCls}>{g.title}</span>
                    <div className="flex flex-col items-start">
                      {g.links.map((l) =>
                        l.external ? (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkCls}
                          >
                            {l.label}
                          </a>
                        ) : (
                          <LocaleLink
                            key={l.href}
                            href={l.href}
                            className={linkCls}
                          >
                            {l.label}
                          </LocaleLink>
                        ),
                      )}
                    </div>
                  </div>
                ))}

                <div className="mb-8 break-inside-avoid">
                  <span className={colTitleCls}>{f.columns.connect}</span>
                  <div className="flex flex-col items-start">
                    <a href="mailto:contact@pluscode.io" className={linkCls}>
                      contact@pluscode.io
                    </a>
                    <a href="tel:+48667688927" className={linkCls}>
                      +48 667 688 927
                    </a>
                    <address className="py-2 text-[15px] not-italic leading-[1.5] text-bone-dim">
                      Kosowska 12/3
                      <br />
                      60-464 Poznań, Poland
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The terminal edge. One step up from the footer ground, so the page
          closes on a visible edge rather than fading out. */}
      <div className="border-t border-night-line bg-night">
        <div className="pc-shell">
          <div className="pc-rules-dark">
            <div className="pc-grid">
              <div className="col-[2/-2] flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  {socialLinks.map(({ key, label, href }) => {
                    const Icon = socialIcons[key];
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex size-11 items-center justify-center rounded-full border border-night-line text-bone-dim transition-colors duration-300 ease-io-attio hover:border-bone-dim hover:text-bone hover:duration-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone-dim"
                      >
                        <Icon className="size-[18px]" />
                      </a>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] leading-[1.5] text-bone-soft lg:justify-end">
                  <LocaleLink href="/privacy-policy" className={legalCls}>
                    {f.privacyPolicy}
                  </LocaleLink>
                  <LocaleLink href="/terms-of-use" className={legalCls}>
                    {f.termsOfUse}
                  </LocaleLink>
                  <span>
                    © {year} Pluscode Sp. z o.o. {f.allRightsReserved}
                  </span>
                  <span className="tabular-nums">
                    {f.krs} 0000811470 · {f.nip} 7812002984 · {f.regon}{" "}
                    384741150
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
