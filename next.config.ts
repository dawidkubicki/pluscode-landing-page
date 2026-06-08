import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // A parent-directory lockfile exists, so pin the workspace root explicitly.
  turbopack: {
    root: import.meta.dirname,
  },
};

// withPayload wires up Payload's admin/API. On Next 16 it supplies both a
// turbopack and a webpack config, so Turbopack (the default) keeps working.
export default withPayload(nextConfig);
