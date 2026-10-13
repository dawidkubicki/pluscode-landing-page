import type { GlobalConfig } from "payload";
import { seoFields } from "./seo";

/**
 * Copy of the home page. Mirrors `homePage` in dictionaries/{en,pl}.json field
 * for field: lib/pages.ts takes each value from here and falls back to the
 * dictionary when a field is empty, so nothing is required.
 */
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home",
  admin: {
    description: "Text of the home page. A field left empty shows the built-in text.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTagline",
      type: "text",
      localized: true,
      admin: { description: "The tagline beside the signet in the hero." },
    },
    {
      name: "missionHeading",
      type: "text",
      localized: true,
      admin: { description: "Large heading of the mission band, under the hero." },
    },
    {
      name: "missionBody",
      type: "textarea",
      localized: true,
      admin: {
        description: "Text inside the ring of the mission band. Leave a blank line between paragraphs.",
      },
    },
    {
      name: "portfolioLabel",
      type: "text",
      localized: true,
      admin: { description: "Small grey label above the portfolio." },
    },
    {
      name: "portfolioStatement",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Statement above the portfolio cards. Words in [square brackets] become chips.",
      },
    },
    {
      name: "peopleHeading",
      type: "text",
      localized: true,
      admin: { description: "Heading above the portraits." },
    },
    {
      name: "peopleIntro",
      type: "text",
      localized: true,
      admin: { description: "Optional short line under the people heading." },
    },
    {
      name: "newsHeading",
      type: "text",
      localized: true,
      admin: { description: "Heading above the latest news on the home page." },
    },
    ...seoFields(),
  ],
};
