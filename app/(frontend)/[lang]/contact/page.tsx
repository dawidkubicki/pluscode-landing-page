import type { Metadata } from "next";
import ContactForm from "../components/contact-form";
import JsonLd from "../components/json-ld";
import PageHero from "../components/page-hero";
import { Container, ExternalIcon, Label } from "../components/ui";
import { COMPANY } from "@/lib/company";
import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getContactPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd, webPageLd } from "@/lib/structured-data";

export const revalidate = 60;

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const contact = await getContactPage(locale);
  return pageMetadata(locale, {
    path: "/contact",
    title: contact.seoTitle,
    description: contact.seoDescription,
  });
}

/** "linkedin.com/company/pluscodeio": an address reads better than "LinkedIn" twice. */
const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/* Label beside value, except between `lg` and `xl`: there the column is five
   twelfths of a small screen and the LinkedIn address no longer fits beside
   its label, so the pair stacks rather than break the address mid-word. */
const ROW =
  "grid gap-x-8 gap-y-1 border-b border-grey-mid py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]";
const TERM = "text-small text-grey sm:pt-0.5 lg:pt-0 xl:pt-0.5";

export default async function ContactPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const contact = await getContactPage(locale);
  const email = contact.email.trim() || COMPANY.email;
  const phone = contact.phone.trim();
  const address = contact.address.trim();

  return (
    <main id="main">
      <PageHero
        size="tall"
        image="contact"
        locale={locale}
        title={contact.heading}
        intro={contact.intro.trim() || undefined}
      />

      <section className="pc-section">
        <Container>
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Label>{dict.company.email}</Label>
              <p className="mt-2 text-title">
                <a href={`mailto:${email}`} className="pc-link [overflow-wrap:anywhere]">
                  {email}
                </a>
              </p>

              <dl className="mt-10 border-t border-grey-mid">
                <div className={ROW}>
                  <dt className={TERM}>{dict.company.linkedin}</dt>
                  <dd>
                    <a
                      href={COMPANY.linkedin}
                      target="_blank"
                      rel="noopener"
                      className="pc-link inline-flex items-center gap-2 [overflow-wrap:anywhere]"
                    >
                      {bareUrl(COMPANY.linkedin)}
                      <ExternalIcon className="size-3 shrink-0 text-grey-soft" />
                      <span className="sr-only">, {dict.ui.opensInNewTab}</span>
                    </a>
                  </dd>
                </div>
                {phone && (
                  <div className={ROW}>
                    <dt className={TERM}>{dict.company.phone}</dt>
                    <dd>
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="pc-link">
                        {phone}
                      </a>
                    </dd>
                  </div>
                )}
                {address && (
                  <div className={ROW}>
                    <dt className={TERM}>{dict.company.office}</dt>
                    <dd>
                      <address className="whitespace-pre-line not-italic">{address}</address>
                    </dd>
                  </div>
                )}
              </dl>

              <p className="mt-5 text-fine text-grey">{dict.footer.registry}</p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <ContactForm t={dict.contact.form} newTabLabel={dict.ui.opensInNewTab} />
            </div>
          </div>
        </Container>
      </section>

      <JsonLd
        data={[
          webPageLd(locale, {
            path: "/contact",
            name: contact.seoTitle || contact.heading,
            description: contact.seoDescription,
            type: "ContactPage",
          }),
          breadcrumbLd(locale, [
            { name: dict.nav.home, path: "" },
            { name: contact.heading, path: "/contact" },
          ]),
        ]}
      />
    </main>
  );
}
