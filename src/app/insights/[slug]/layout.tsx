import type { Metadata } from "next";

const articlesMetadata: Record<string, { title: string; description: string }> = {
  "ai-transforming-business": {
    title: "How AI is Transforming Business Operations",
    description:
      "Explore how artificial intelligence is revolutionizing business operations, from automation to predictive analytics and decision-making.",
  },
  "scalable-microservices": {
    title: "Building Scalable Microservices Architecture",
    description:
      "Learn best practices for designing and implementing scalable microservices architecture for modern applications.",
  },
  "startup-to-scaleup": {
    title: "From Startup to Scale-up: Technical Considerations",
    description:
      "Essential technical strategies and considerations for scaling your startup into a successful enterprise.",
  },
  "cloud-native-best-practices": {
    title: "Cloud-Native Development Best Practices",
    description:
      "Discover the best practices for cloud-native development, including containerization, orchestration, and CI/CD pipelines.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesMetadata[slug];

  if (!article) {
    return {
      title: "Insight",
      description: "Read our latest insights on technology and business.",
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | Pluscode`,
      description: article.description,
      type: "article",
    },
  };
}

export default function InsightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
