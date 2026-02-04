import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Learning Solutions",
  description:
    "Custom machine learning solutions including predictive modeling, NLP, computer vision, deep learning, and MLOps. Build intelligent AI-powered applications.",
  keywords: [
    "machine learning",
    "artificial intelligence",
    "predictive modeling",
    "NLP",
    "natural language processing",
    "computer vision",
    "deep learning",
    "MLOps",
  ],
  openGraph: {
    title: "Machine Learning Solutions | Pluscode",
    description:
      "Custom machine learning solutions including predictive modeling, NLP, computer vision, and deep learning.",
  },
};

export default function MachineLearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
