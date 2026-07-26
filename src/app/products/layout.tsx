import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software products designed, built and operated by Pluscode — Quanty.ai, the AI knowledge graph for financial markets, and TrenerApp.pl, the platform for personal trainers.",
  keywords: [
    "Pluscode products",
    "Quanty.ai",
    "TrenerApp.pl",
    "AI financial data",
    "personal trainer software",
    "product engineering",
  ],
  openGraph: {
    title: "Products | Pluscode",
    description:
      "Software products designed, built and operated by Pluscode — Quanty.ai and TrenerApp.pl.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
