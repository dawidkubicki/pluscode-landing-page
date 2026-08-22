import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon } from "./icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const linkCls = "text-[15px] text-bone-dim transition-colors hover:text-bone";

const socials = [
  { label: "LinkedIn", Icon: LinkedInIcon, href: "https://www.linkedin.com/company/pluscode" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://www.instagram.com/pluscode" },
];

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = dict.navigation;
  const f = dict.footer;

  const columns = [
    {
      title: nav.aiData,
      links: [
        { label: nav.aiDataItems.machineLearning.title, href: "/ai-data/machine-learning" },
        { label: nav.aiDataItems.dataAnalytics.title, href: "/ai-data/analytics" },
        { label: nav.aiDataItems.aiConsulting.title, href: "/ai-data/consulting" },
      ],
    },
    {
      title: nav.services,
      links: [
        { label: nav.servicesItems.webDevelopment.title, href: "/services/web-development" },
        { label: nav.servicesItems.mobileApps.title, href: "/services/mobile" },
        { label: nav.servicesItems.cloudSolutions.title, href: "/services/cloud" },
        { label: nav.servicesItems.teamExtension.title, href: "/services/team-extension" },
      ],
    },
    {
      title: f.columns.company,
      links: [
        { label: nav.about, href: "/about" },
        { label: nav.workshops, href: "/#workshops" },
        { label: nav.caseStudies, href: "/case-studies" },
        { label: nav.insights, href: "/insights" },
        { label: f.sitemap, href: "/site-map" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-night-deep text-bone-dim">
      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-20 sm:px-10 sm:pt-24">
        {/* Brand row */}
        <LocaleLink href="/" aria-label="Pluscode home" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo/pluscode-logo.svg"
            alt="Pluscode"
            className="h-9 w-auto"
          />
        </LocaleLink>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-bone-soft">
          {f.tagline}
        </p>

        {/* Link columns + contact block */}
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.3fr] lg:gap-10">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-bone">
                {col.title}
              </span>
              {col.links.map((l) => (
                <LocaleLink key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </LocaleLink>
              ))}
            </div>
          ))}

          <div className="flex flex-col items-start gap-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-bone">
              {f.columns.connect}
            </span>
            <a href="mailto:contact@pluscode.io" className={linkCls}>
              contact@pluscode.io
            </a>
            <a href="tel:+48667688927" className={linkCls}>
              +48 667 688 927
            </a>
            <span className="text-[15px] text-bone-dim">
              Kosowska 12/3, 60-464 Poznań, Poland
            </span>
            <LocaleLink
              href="/contact"
              className="mt-2 rounded-[2px] bg-lime px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-lime-bright"
            >
              {nav.getInTouch}
            </LocaleLink>
          </div>
        </div>

        {/* Social + legal links */}
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {socials.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-bone-dim transition-colors hover:border-bone hover:text-bone"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm">
            <LocaleLink href="/privacy-policy" className={linkCls}>
              {f.privacyPolicy}
            </LocaleLink>
            <LocaleLink href="/terms-of-use" className={linkCls}>
              {f.termsOfUse}
            </LocaleLink>
          </div>
        </div>

        {/* Registry + copyright */}
        <div className="mt-8 flex flex-col justify-between gap-3 text-[13px] sm:flex-row">
          <span>
            © {new Date().getFullYear()} Pluscode Sp. z o.o. {f.allRightsReserved}
          </span>
          <span>
            {f.krs} 0000811470 · {f.nip} 7812002984 · {f.regon} 384741150
          </span>
        </div>
      </div>
    </footer>
  );
}
