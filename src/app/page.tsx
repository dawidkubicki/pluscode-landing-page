import AnnouncementBar from "@/components/AnnouncementBar";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Portfolio from "@/components/Portfolio";
import Testimonial from "@/components/Testimonial";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navigation />
      <Hero />
      <Services />
      <Industries />
      <Portfolio />
      <Testimonial />
      <Insights />
      <Contact />
      <Footer />
    </div>
  );
}
