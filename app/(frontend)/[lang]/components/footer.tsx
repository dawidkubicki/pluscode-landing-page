import Image from "next/image";
import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "./icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { socialLinks, type SocialKey } from "@/lib/social";

/* Three shared strings, so a column can never drift from its neighbour.
   `pc-link` carries the hover underline; the colour step is a plain hover
   utility rather than a transition class, because `pc-link` already owns the
   `transition` shorthand and a second one would cancel the underline. */
const headingCls = "text-[1.125rem] leading-[1.375] text-white";
const linkCls = "pc-link text-[1rem] leading-[1.375] hover:text-white";
const legalCls = "pc-link text-[0.875rem] hover:text-white";

const socialIcons: Record<SocialKey, typeof LinkedInIcon> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

/**
 * Site footer, on the September 2026 system. Seventeen pages import it, so it
 * is the one band that has to read as the page's terminal edge everywhere.
 *
 * LAYOUT. One `pc-grid`, no nested grids and no second shell. The wordmark
 * takes columns 1 to 4 and the four link groups take 5 to 12, two columns
 * each, so the field reaches the right edge instead of stopping a column
 * short. Below 768px the grid is four wide and each group takes two of them:
 * a 2x2 block, which halves the scroll depth of four stacked lists without
 * squeezing the longest label ("Forward Deployed Engineers") past two lines.
 *
 * The row gap between the brand block and the link field is a bottom margin,
 * not a grid `gap-y`: `.pc-grid` sets the `gap` shorthand, and a `gap-y-*`
 * utility landing in the same layer is not reliably the winner.
 *
 * Ground, hairline, type. No panel, no rounded card, no circles around the
 * social marks: the only structure below the links is one `rule-dark`
 * hairline, and the only hierarchy is size and colour.
 *
 * WHAT MOVED. `footer.sitemap` used to sit in the Company list and now sits
 * with Privacy and Terms in the legal row, where a sitemap link belongs.
 * Everything else, including the Quanty entry, stays in the group it was in.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = dict.navigation;
  const f = dict.footer;

  /* THE SOLUTIONS GROUP. It used to be three links called "AI Services"
     pointing at /ai-data/machine-learning, /ai-data/analytics and
     /ai-data/consulting, so a reader who clicked "Assistants and
     automation" landed on a page headed "Machine Learning Solutions". There
     are six real pages behind those promises now, under /solutions, and the
     labels here are those pages' own titles rather than a second set of
     names for the same things.

     Four of the six plus the index, which is the five-link ceiling every
     group in this footer keeps. Process mapping and data governance are
     the two the index has to carry: they are the pages a reader arrives at
     after deciding, not the ones that make them decide.

     WHY THE READ IS OPTIONAL. `solutions` is written into the three
     dictionaries by scripts/content/solutions.ts. This component is on
     every page of the site, so it may not be the thing that breaks if that
     script has not run yet: without the key it falls back to the old nav
     labels, still pointed at the new routes. The old /ai-data pages are
     untouched and keep working; nothing here deletes them. */
  const solutions = (
    dict as unknown as {
      solutions?: {
        index: {
          label: string;
          allLabel: string;
          items: { slug: string; name: string }[];
        };
      };
    }
  ).solutions;

  const solutionsGroup = solutions
    ? {
        title: solutions.index.label,
        links: [
          ...solutions.index.items.slice(0, 4).map((item) => ({
            label: item.name,
            href: `/solutions/${item.slug}`,
          })),
          { label: solutions.index.allLabel, href: "/solutions" },
        ],
      }
    : {
        title: nav.aiData,
        links: [
          {
            label: nav.aiDataItems.machineLearning.title,
            href: "/solutions/assistants-and-automation",
          },
          {
            label: nav.aiDataItems.dataAnalytics.title,
            href: "/solutions/forecasting-and-reporting",
          },
          {
            label: nav.aiDataItems.aiConsulting.title,
            href: "/solutions/process-mapping",
          },
        ],
      };

  // Five links a group at most. The footer used to carry every route the
  // site has, which is what /site-map is for; a wall of eight makes the one
  // link a visitor wants harder to find, not easier.
  const groups: {
    title: string;
    links: { label: string; href: string; external?: boolean }[];
  }[] = [
    solutionsGroup,
    {
      title: nav.services,
      links: [
        {
          label: nav.servicesItems.forwardDeployedEngineers.title,
          href: "/services/forward-deployed-engineers",
        },
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
        /* Our own platform page, not quanty.ai. The product still has
           its own host and /quanty links out to it twice, but a footer
           link that leaves the site is a link a reader does not come
           back from. */
        { label: f.ourProduct, href: "/quanty" },
      ],
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-carbon pt-20 pb-12 text-sage md:pt-[104px]">
      <div className="pc-shell">
        <div className="pc-grid">
          {/* The brand block. The wordmark is type now, not an SVG: at 35px
              in white it is the largest thing in the band, which is the whole
              of the hierarchy the footer needs. */}
          <div className="col-span-4 mb-12 md:mb-0">
            <LocaleLink
              href="/"
              aria-label="Pluscode"
              className="block"
            >
              {/* The white cut of the mark on the carbon ground. `unoptimized`
                  for the same reason as the header: svg through /_next/image
                  needs a sitewide flag that is not worth its cost. */}
              <Image
                src="/assets/logo/pluscode-logo.svg"
                alt="Pluscode"
                width={203}
                height={44}
                unoptimized
                className="h-8 w-auto"
              />
            </LocaleLink>
            <p className="mt-5 max-w-[24em] text-[1.125rem] leading-[1.375] text-sage">
              {f.tagline}
            </p>
            <LocaleLink
              href="/book-a-call"
              className="pc-link mt-6 inline-block text-[1.125rem] text-white"
            >
              {nav.getInTouch}
            </LocaleLink>
          </div>

          {groups.map((g, i) => (
            <div
              key={g.title}
              className={`col-span-2 mb-10  md:mb-0 ${
                i === 0 ? "md:col-start-5" : ""
              }`}
            >
              <h2 className={headingCls}>{g.title}</h2>
              <div className="mt-5 flex flex-col items-start gap-3">
                {g.links.map((l) =>
                  l.external ? (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={linkCls}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <LocaleLink key={l.href} href={l.href} className={linkCls}>
                      {l.label}
                    </LocaleLink>
                  ),
                )}
              </div>
            </div>
          ))}

          {/* Connect closes the field. Same column shape as a link group, so
              the four headings sit on one line. */}
          <div className="col-span-2 mb-10 md:mb-0">
            <h2 className={headingCls}>{f.columns.connect}</h2>
            <div className="mt-5 flex flex-col items-start gap-3">
              <a href="mailto:contact@pluscode.io" className={linkCls}>
                contact@pluscode.io
              </a>
              <a href="tel:+48667688927" className={linkCls}>
                +48 667 688 927
              </a>
              <address className="text-[1rem] leading-[1.375] not-italic text-sage">
                {f.address}
              </address>
            </div>
          </div>

          {/* The terminal edge: one hairline, then the small print. Two
              blocks on a wrapping flex row, so below 768px they stack in
              reading order (marks, company, registry, then legal) rather
              than needing a second breakpoint. */}
          <div className="col-span-4 mt-20 border-t border-rule-dark pt-8 md:col-span-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-x-6">
                  {socialLinks.map(({ key, label, href }) => {
                    const Icon = socialIcons[key];
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        /* Square and unframed: the 44px height is the tap
                           target, not a shape. */
                        className="inline-flex min-h-11 items-center text-sage hover:text-white"
                      >
                        <Icon className="size-5" />
                      </a>
                    );
                  })}
                </div>
                <p className="text-[0.875rem] leading-[1.375] text-sage">
                  © {year} Pluscode Sp. z o.o. {f.allRightsReserved}
                </p>
                <p className="text-[0.875rem] leading-[1.375] text-sage tabular-nums">
                  {f.krs} 0000811470 · {f.nip} 7812002984 · {f.regon} 384741150
                </p>
              </div>

              <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sage md:justify-end">
                <LocaleLink href="/privacy-policy" className={legalCls}>
                  {f.privacyPolicy}
                </LocaleLink>
                <LocaleLink href="/terms-of-use" className={legalCls}>
                  {f.termsOfUse}
                </LocaleLink>
                <LocaleLink href="/site-map" className={legalCls}>
                  {f.sitemap}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
