
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
import { useUserTheme } from "@/hooks/useUserTheme";

const Index = () => {
  const { user } = useAuth();
  const { userType } = useUserTheme();

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
      
      {/* Adapté en fonction du type d'utilisateur */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
          <p className="text-lg text-gray-600 mb-8">
            {userType === 'transporter' 
              ? "Découvrez les marchandises disponibles pour optimiser vos trajets retour" 
              : "Publiez votre première marchandise ou trouvez un transporteur fiable"}
          </p>
          
          {user ? (
            <div className="flex flex-wrap justify-center gap-4">
              {userType === 'transporter' ? (
                <Link to="/marketplace">
                  <Button className="bg-transporter hover:bg-transporter/90 text-lg py-6 px-8">
                    Voir les marchandises disponibles
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/new-freight">
                    <Button className="bg-retourgo-orange hover:bg-retourgo-orange/90 text-lg py-6 px-8">
                      Publier une marchandise
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button variant="outline" className="text-lg py-6 px-8 border-2">
                      Trouver un transporteur
                    </Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-retourgo-orange hover:bg-retourgo-orange/90 text-lg py-6 px-8">
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
