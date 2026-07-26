import type { Metadata } from "next";

const productMetadata: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  quanty: {
    title: "Quanty.ai — AI Knowledge Graph for Financial Markets",
    description:
      "Quanty.ai turns financial news into a queryable knowledge graph. Entity extraction, sentiment scoring, AI summaries and market insights through a single GraphQL API. Built by Pluscode.",
    keywords: [
      "Quanty",
      "financial data API",
      "knowledge graph",
      "GraphQL API",
      "market sentiment analysis",
      "crypto and stock insights",
      "AI in finance",
    ],
  },
  trenerapp: {
    title: "TrenerApp.pl — Software for Personal Trainers",
    description:
      "TrenerApp.pl is the platform personal trainers use to build training plans, coach clients online and run their business in one place. Built by Pluscode.",
    keywords: [
      "TrenerApp",
      "aplikacja dla trenerów personalnych",
      "personal trainer software",
      "training plans",
      "online coaching",
      "fitness app",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = productMetadata[slug] || {
    title: "Products",
    description: "Software products designed, built and operated by Pluscode.",
    keywords: ["Pluscode products", "software products"],
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${meta.title} | Pluscode`,
      description: meta.description,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
