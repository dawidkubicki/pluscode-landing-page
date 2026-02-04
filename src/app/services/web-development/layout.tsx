import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom web development services including frontend, backend, e-commerce, and CMS solutions. Build scalable, high-performance web applications with Pluscode.",
  keywords: [
    "web development",
    "frontend development",
    "backend development",
    "React",
    "Next.js",
    "e-commerce",
    "CMS",
    "web applications",
  ],
  openGraph: {
    title: "Web Development Services | Pluscode",
    description:
      "Custom web development services including frontend, backend, e-commerce, and CMS solutions.",
  },
};

export default function WebDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
