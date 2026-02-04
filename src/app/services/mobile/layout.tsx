import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile App Development",
  description:
    "Professional mobile app development for iOS and Android. Native and cross-platform solutions including React Native and Flutter. Build engaging mobile experiences.",
  keywords: [
    "mobile app development",
    "iOS development",
    "Android development",
    "React Native",
    "Flutter",
    "cross-platform",
    "mobile applications",
  ],
  openGraph: {
    title: "Mobile App Development | Pluscode",
    description:
      "Professional mobile app development for iOS and Android. Native and cross-platform solutions.",
  },
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
