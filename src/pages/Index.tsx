
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import MapSection from "../components/MapSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialSection from "../components/TestimonialSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <FeatureSection />
        <MapSection />
        <HowItWorksSection />
        <TestimonialSection />
        <CtaSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
