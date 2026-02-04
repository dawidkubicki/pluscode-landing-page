import type { Metadata } from "next";

const caseStudiesMetadata: Record<string, { title: string; description: string }> = {
  zabka: {
    title: "Żabka Case Study - Digital Transformation in Retail",
    description:
      "Discover how we helped Żabka transform their retail operations with innovative technology solutions and data-driven strategies.",
  },
  ubs: {
    title: "UBS Case Study - Financial Services Innovation",
    description:
      "Learn how we partnered with UBS to deliver cutting-edge financial technology solutions and enhance their digital capabilities.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudiesMetadata[slug];

  if (!study) {
    return {
      title: "Case Study",
      description: "Explore our case study and see how we deliver results.",
    };
  }

  return {
    title: study.title,
    description: study.description,
    openGraph: {
      title: `${study.title} | Pluscode`,
      description: study.description,
    },
  };
}

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
