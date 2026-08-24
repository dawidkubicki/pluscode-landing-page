import type { GlobalConfig } from "payload";

/**
 * Heading copy for the home "Ambition in action" use-case mosaic
 * (components/use-cases.tsx). The cards themselves live in the `use-cases`
 * collection; this global only owns the section label + title.
 *
 * Text is localized (en/pl/de) and every field is optional — empty fields keep
 * the dictionary copy, so the section renders before an editor touches
 * anything.
 */
export const UseCasesSection: GlobalConfig = {
  slug: "useCasesSection",
  label: "Home · Use cases",
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
