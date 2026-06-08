import path from "path";

import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    // Explicit absolute path so it always matches the mounted Docker volume
    // (/app/media in the container). Defaults to <cwd>/media otherwise.
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 768 },
      { name: "hero", width: 1600 },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: { description: "Describe the image for accessibility / SEO." },
    },
  ],
};
