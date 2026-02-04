import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Explore our portfolio of successful projects. See how we've helped businesses transform with custom software, AI solutions, and digital innovation.",
  openGraph: {
    title: "Case Studies | Pluscode",
    description:
      "Explore our portfolio of successful projects and digital transformations.",
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
