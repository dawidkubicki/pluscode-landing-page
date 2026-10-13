import type { Field } from "payload";

/**
 * The two search fields every page global ends with. A function, because
 * Payload sanitizes field objects in place and four globals must not share
 * one pair.
 */
export const seoFields = (): Field[] => [
  {
    name: "seoTitle",
    type: "text",
    localized: true,
    admin: { description: "Page title for search engines and the browser tab." },
  },
  {
    name: "seoDescription",
    type: "textarea",
    localized: true,
    admin: { description: "One or two sentences for search engines and link previews." },
  },
];
