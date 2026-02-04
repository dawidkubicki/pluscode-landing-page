import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Data Consulting",
  description:
    "Expert AI and data consulting services. Strategy development, technology assessment, implementation guidance, and training for your data-driven transformation.",
  keywords: [
    "AI consulting",
    "data consulting",
    "digital strategy",
    "AI implementation",
    "data governance",
    "AI training",
    "technology assessment",
  ],
  openGraph: {
    title: "AI & Data Consulting | Pluscode",
    description:
      "Expert AI and data consulting services. Strategy development, technology assessment, and implementation guidance.",
  },
};

export default function ConsultingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
