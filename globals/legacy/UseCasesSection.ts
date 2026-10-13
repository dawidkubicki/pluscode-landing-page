import type { GlobalConfig } from "payload";

/**
 * LEGACY. Heading copy for the use case mosaic of the old home page. Nothing
 * on the site reads it since the October 2026 rebuild. It stays in the config,
 * hidden from the admin, because its tables hold real rows and earlier
 * migrations write to it through the Local API.
 */
export const UseCasesSection: GlobalConfig = {
  slug: "useCasesSection",
  label: "Home · Use cases",
  admin: {
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "label",
      type: "text",
      localized: true,
      admin: {
        description:
          'Small eyebrow above the title, e.g. "Zastosowane AI, na produkcji".',
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      admin: {
        description: 'Section heading, e.g. "Ambicja w działaniu".',
      },
    },
  ],
};
