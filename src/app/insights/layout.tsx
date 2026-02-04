import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Blog",
  description:
    "Stay updated with the latest in software development, AI, machine learning, and digital transformation. Expert insights and thought leadership from Pluscode.",
  openGraph: {
    title: "Insights & Blog | Pluscode",
    description:
      "Stay updated with the latest in software development, AI, and digital transformation.",
  },
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
