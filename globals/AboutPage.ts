import type { GlobalConfig } from "payload";
import { seoFields } from "./seo";

/**
 * Copy of the About page. Mirrors `aboutPage` in dictionaries/{en,pl}.json
 * field for field, see globals/HomePage.ts. An empty Principles list falls
 * back to the dictionary list, which may be empty too.
 */
export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About",
  admin: {
    description: "Text of the About page. A field left empty shows the built-in text.",
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
      admin: { description: "Opening text under the title. Leave a blank line between paragraphs." },
    },
    {
      name: "storyLabel",
      type: "text",
      localized: true,
      admin: { description: "Small grey label above the story." },
    },
    {
      name: "storyBody",
      type: "textarea",
      localized: true,
      admin: { description: "The story. Leave a blank line between paragraphs." },
    },
    {
      name: "principlesLabel",
      type: "text",
      localized: true,
      admin: { description: "Small grey label above the principles." },
    },
    {
      name: "principles",
      type: "array",
      labels: { singular: "Principle", plural: "Principles" },
      admin: { description: "Optional list under the story. Leave it empty to show none." },
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
          admin: { description: "The principle in a few words." },
        },
        {
          name: "text",
          type: "textarea",
          localized: true,
          admin: { description: "One or two sentences under it." },
        },
      ],
    },
    ...seoFields(),
  ],
};
