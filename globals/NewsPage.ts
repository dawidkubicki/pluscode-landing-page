import type { GlobalConfig } from "payload";
import { seoFields } from "./seo";

/**
 * Copy of the News listing page. Mirrors `newsPage` in
 * dictionaries/{en,pl}.json field for field, see globals/HomePage.ts. The
 * articles themselves are the News collection.
 */
export const NewsPage: GlobalConfig = {
  slug: "news-page",
  label: "News page",
  admin: {
    description: "Text of the News page. A field left empty shows the built-in text.",
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
      admin: { description: "Optional text under the title. Leave a blank line between paragraphs." },
    },
    ...seoFields(),
  ],
};
