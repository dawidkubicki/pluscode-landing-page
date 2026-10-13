import type { GlobalConfig } from "payload";
import { seoFields } from "./seo";

/**
 * Copy of the Contact page. Mirrors `contactPage` in
 * dictionaries/{en,pl}.json field for field, see globals/HomePage.ts. Email
 * and phone are the same in every language, so they are not localized.
 */
export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact",
  admin: {
    description: "Text of the Contact page. A field left empty shows the built-in text.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      admin: { description: "Page title, over the photo at the top." },
    },
    {
      name: "intro",
      type: "textarea",
      localized: true,
      admin: { description: "Text under the title. Leave a blank line between paragraphs." },
    },
    {
      name: "email",
      type: "text",
      admin: { description: "Email address shown on the page, the same in every language." },
    },
    {
      name: "phone",
      type: "text",
      admin: { description: "Phone number shown on the page, the same in every language." },
    },
    {
      name: "address",
      type: "textarea",
      localized: true,
      admin: { description: "Postal address shown on the page. One line per row." },
    },
    ...seoFields(),
  ],
};
