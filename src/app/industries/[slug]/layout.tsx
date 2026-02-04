import type { Metadata } from "next";

// Industry metadata mapping
const industryMetadata: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  finance: {
    title: "Financial Services IT Solutions",
    description:
      "Custom software solutions for financial services. AI-powered fraud detection, regulatory compliance, trading platforms, and secure banking applications.",
    keywords: [
      "fintech",
      "banking software",
      "fraud detection",
      "regulatory compliance",
      "trading platforms",
      "financial services",
    ],
  },
  healthcare: {
    title: "Healthcare IT Solutions",
    description:
      "Digital healthcare solutions including patient management systems, telemedicine platforms, medical data analytics, and HIPAA-compliant applications.",
    keywords: [
      "healthcare software",
      "telemedicine",
      "patient management",
      "medical data analytics",
      "HIPAA compliance",
      "health tech",
    ],
  },
  ecommerce: {
    title: "E-Commerce & Retail IT Solutions",
    description:
      "Custom e-commerce platforms, inventory management, customer analytics, and omnichannel retail solutions to boost sales and customer experience.",
    keywords: [
      "e-commerce development",
      "retail software",
      "inventory management",
      "customer analytics",
      "online store",
      "omnichannel",
    ],
  },
  hr: {
    title: "HR & Recruitment IT Solutions",
    description:
      "HR technology solutions including applicant tracking systems, employee management platforms, AI-powered recruitment tools, and workforce analytics.",
    keywords: [
      "HR software",
      "recruitment technology",
      "ATS",
      "employee management",
      "workforce analytics",
      "HR tech",
    ],
  },
  logistics: {
    title: "Logistics & Transport IT Solutions",
    description:
      "Supply chain and logistics software including fleet management, route optimization, warehouse management, and real-time tracking systems.",
    keywords: [
      "logistics software",
      "fleet management",
      "supply chain",
      "route optimization",
      "warehouse management",
      "transport technology",
    ],
  },
  ai: {
    title: "AI & Machine Learning Solutions",
    description:
      "Custom AI and machine learning solutions including predictive analytics, natural language processing, computer vision, and intelligent automation.",
    keywords: [
      "artificial intelligence",
      "machine learning",
      "AI development",
      "predictive analytics",
      "NLP",
      "computer vision",
    ],
  },
  saas: {
    title: "SaaS & Startup IT Solutions",
    description:
      "Scalable SaaS development for startups. MVP development, rapid prototyping, cloud-native architecture, and growth-ready software solutions.",
    keywords: [
      "SaaS development",
      "startup software",
      "MVP development",
      "cloud-native",
      "scalable architecture",
      "startup tech",
    ],
  },
  manufacturing: {
    title: "Manufacturing & Industry IT Solutions",
    description:
      "Industry 4.0 solutions including IoT integration, predictive maintenance, production optimization, and smart factory automation systems.",
    keywords: [
      "manufacturing software",
      "Industry 4.0",
      "IoT",
      "predictive maintenance",
      "smart factory",
      "industrial automation",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = industryMetadata[slug] || {
    title: "Industry Solutions",
    description: "Custom software solutions tailored for your industry.",
    keywords: ["software development", "IT solutions", "custom software"],
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

export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
