
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MapSection from "@/components/MapSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      
      {!user && (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Rejoignez RetourGo dès aujourd'hui</h2>
          <p className="text-lg mb-6">Découvrez notre parcours d'inscription simplifié et personnalisé</p>
          <Link to="/user-type-selection">
            <Button className="bg-retourgo-orange hover:bg-retourgo-orange/90 text-lg py-6 px-8">
              Commencer l'inscription
            </Button>
          </Link>
        </div>
      )}
      
      <FeatureSection />
      <HowItWorksSection />
      <MapSection />
      <TestimonialSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
