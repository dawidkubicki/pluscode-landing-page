import LocaleLink from "./locale-link";
import { CookieSettingsLink } from "./cookie-consent";
import { SignetRing, Wordmark } from "./signet";
import { Container, LinkedInIcon } from "./ui";
import { COMPANY } from "@/lib/company";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const fineLink =
  "inline-flex min-h-11 items-center text-grey transition-colors duration-200 hover:text-blue lg:min-h-0";

/**
 * The footer: the ring with the wordmark in its big disc, how to reach the
 * company, where it is registered, and a ruled row of fine print. White and
 * quiet, as the reference's is.
 */
export default function SiteFooter({
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { footer, nav, company, ui } = dict;

  return (
    <footer className="bg-white pt-16 pb-10 text-fine lg:pt-20 lg:pb-20">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <LocaleLink
              href="/"
              aria-label={nav.homeLink}
              className="relative block aspect-[57.2108/44] h-[9.375rem] text-ink transition-colors duration-200 hover:text-navy"
            >
              <SignetRing tone="dark" className="h-full w-full" />
              <Wordmark
                title={null}
                className="absolute top-1/2 right-[6.5%] w-[37%] -translate-y-1/2"
              />
            </LocaleLink>
          </div>

          <ul className="lg:pt-2">
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-blue lg:min-h-0"
              >
                {COMPANY.email}
              </a>
            </li>
            <li className="lg:mt-3">
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 transition-colors duration-200 hover:text-blue lg:min-h-0"
              >
                <LinkedInIcon className="h-4 w-4" />
                <span>{company.linkedin}</span>
                <span className="sr-only">, {ui.opensInNewTab}</span>
              </a>
            </li>
          </ul>

          <address className="not-italic lg:pt-2">
            <strong className="font-bold">{COMPANY.legalName}</strong>
            <br />
            {COMPANY.street}
            <br />
            {COMPANY.postalCode} {COMPANY.city}, {company.country}
          </address>
        </div>

        <div className="mt-12 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-grey-light pt-4 lg:mt-16">
          <p className="w-full sm:w-auto">
            Pluscode © {new Date().getFullYear()}. {footer.rights}
          </p>
          <nav aria-label={nav.footer}>
            <ul className="flex flex-wrap items-baseline gap-x-5">
              <li>
                <LocaleLink href="/privacy-policy" className={fineLink}>
                  {footer.privacy}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms-of-use" className={fineLink}>
                  {footer.terms}
                </LocaleLink>
              </li>
              <li>
                <CookieSettingsLink className={`${fineLink} cursor-pointer`}>
                  {footer.cookies}
                </CookieSettingsLink>
              </li>
            </ul>
          </nav>
          <p className="w-full text-grey lg:ml-auto lg:w-auto">{footer.registry}</p>
        </div>
      </Container>
    </footer>
  );
}
