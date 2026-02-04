import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Pluscode - our story, values, and the team behind innovative software development and AI solutions. Discover how we help businesses transform digitally.",
  openGraph: {
    title: "About Us | Pluscode",
    description:
      "Learn about Pluscode - our story, values, and the team behind innovative software development and AI solutions.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
