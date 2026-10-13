import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

/* Sent with every response, the admin and the API included, so each one has
   to be safe for Payload and Google Analytics. `SAMEORIGIN` rather
   than `DENY` because Payload's live preview frames the site from /admin. The
   Permissions-Policy only switches off features nothing here asks for. There
   is no Content-Security-Policy yet: it needs its own pass against the admin. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

/* A year, and never revalidated. That is only true while a file under these
   folders keeps its content for as long as it keeps its name: replace a
   picture by adding it under a new name (the share cards carry a `?v=`). */
const immutable = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  // A parent-directory lockfile exists, so pin the workspace root explicitly.
  turbopack: {
    root: import.meta.dirname,
  },
  // withPayload adds its own "Next.js, Payload" header unless this is false.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // The photographs are full bleed, so the steps follow real viewports and
    // their 2x versions, and stop at the widest source file.
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/assets/:path*", headers: immutable },
      { source: "/og/:path*", headers: immutable },
    ];
  },
};

// withPayload wires up Payload's admin/API. On Next 16 it supplies both a
// turbopack and a webpack config, so Turbopack (the default) keeps working.
export default withPayload(nextConfig);
