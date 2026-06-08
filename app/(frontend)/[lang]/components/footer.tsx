import { Reveal } from "./motion";
import LocaleLink from "./locale-link";
import { LinkedInIcon, InstagramIcon } from "./icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const socials = [
  { label: "LinkedIn", Icon: LinkedInIcon, href: "https://www.linkedin.com/company/pluscode" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://instagram.com" },
];

const linkCls = "text-[15px] text-bone/90 transition-colors hover:text-lime";

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = dict.navigation;
  const { tagline, columns, privacyPolicy, termsOfUse, sitemap, allRightsReserved } =
    dict.footer;

  const serviceLinks = [
    { label: nav.servicesItems.webDevelopment.title, href: "/services/web-development" },
    { label: nav.servicesItems.mobileApps.title, href: "/services/mobile" },
    { label: nav.servicesItems.cloudSolutions.title, href: "/services/cloud" },
  ];

  const aiLinks = [
    { label: nav.aiDataItems.machineLearning.title, href: "/ai-data/machine-learning" },
    { label: nav.aiDataItems.dataAnalytics.title, href: "/ai-data/analytics" },
    { label: nav.aiDataItems.aiConsulting.title, href: "/ai-data/consulting" },
  ];

  const companyLinks = [
    { label: nav.about, href: "/about" },
    { label: nav.insights, href: "/insights" },
    { label: "Case Studies", href: "/case-studies" },
    { label: nav.getInTouch, href: "/contact" },
  ];

  const linkColumns = [
    { title: nav.services, links: serviceLinks },
    { title: nav.aiData, links: aiLinks },
    { title: columns.company, links: companyLinks },
  ];

  return (
    <footer className="bg-night px-5 pb-10 pt-20 text-bone sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_repeat(3,1fr)_1.2fr]">
          <Reveal>
            <div>
              <LocaleLink href="/" className="display text-4xl text-bone sm:text-5xl">
                Pluscode<span className="align-super text-[0.4em] text-lime">+</span>
              </LocaleLink>
              <p className="mt-5 max-w-xs text-lg leading-snug text-bone-soft">
                {tagline}
              </p>
            </div>
          </Reveal>

          {linkColumns.map((col) => (
            <Reveal key={col.title} delay={0.05}>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-soft">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <LocaleLink href={l.href} className={linkCls}>
                        {l.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.05}>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-soft">
                {columns.contact}
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href="mailto:contact@pluscode.io" className={linkCls}>
                    contact@pluscode.io
                  </a>
                </li>
                <li>
                  <a href="tel:+48667688927" className={linkCls}>
                    +48 667 688 927
                  </a>
                </li>
                <li>
                  <LocaleLink href="/contact" className={linkCls}>
                    Kosowska 12/3, Poznań
                  </LocaleLink>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-night-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-soft">
            © {new Date().getFullYear()} Pluscode Sp. z o.o. · KRS 0000811470 ·
            NIP PL7812002984 · REGON 384741150
          </p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 text-[13px] text-bone-soft">
              <LocaleLink href="/privacy-policy" className="transition-colors hover:text-lime">
                {privacyPolicy}
              </LocaleLink>
              <LocaleLink href="/terms-of-use" className="transition-colors hover:text-lime">
                {termsOfUse}
              </LocaleLink>
              <LocaleLink href="/site-map" className="transition-colors hover:text-lime">
                {sitemap}
              </LocaleLink>
            </div>
            <div className="flex items-center gap-4 text-bone-soft">
              {socials.map(({ label, Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-colors hover:text-lime">
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="sr-only">{allRightsReserved}</p>
      </div>
    </footer>
  );
}
