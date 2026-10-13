/**
 * The company's fixed facts, in one place: the footer, the contact page, the
 * legal pages, llms.txt and the structured data all read this, so a change of
 * address or register number is made once.
 *
 * Not translated and not in the CMS on purpose. These are register entries.
 */
export const SITE_URL = "https://pluscode.io";

export const COMPANY = {
  name: "Pluscode",
  legalName: "Pluscode Sp. z o.o.",
  street: "ul. Kosowska 12/3",
  postalCode: "60-464",
  city: "Poznań",
  countryCode: "PL",
  krs: "0000811470",
  nip: "PL7812002984",
  regon: "384741150",
  email: "contact@pluscode.io",
  linkedin: "https://www.linkedin.com/company/pluscodeio/",
} as const;

/** Our own product, and for now the whole portfolio. */
export const QUANTY_URL = "https://quanty.ai";
