import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Navigate the Pluscode website. Find all our pages including services, case studies, insights, and more.",
  openGraph: {
    title: "Sitemap | Pluscode",
    description: "Navigate the Pluscode website and find all our pages.",
  },
};

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
