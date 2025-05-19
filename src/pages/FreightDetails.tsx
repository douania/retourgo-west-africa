
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Freight } from "@/components/freight/FreightCard";
import { FreightDetailsHeader } from "@/components/freight/FreightDetailsHeader";
import { FreightDetailsCard } from "@/components/freight/FreightDetailsCard";
import { FreightOfferForm } from "@/components/freight/FreightOfferForm";
import { Button } from "@/components/ui/button";

const FreightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipper, setShipper] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userOffer, setUserOffer] = useState<any>(null);

  useEffect(() => {
    const fetchFreightDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch freight details
        const { data: freightData, error: freightError } = await supabase
          .from("freights")
          .select("*")
          .eq("id", id)
          .single();

        if (freightError) throw freightError;
        
        setFreight(freightData as Freight);

        // Fetch shipper (freight owner) details
        if (freightData) {
          const { data: shipperData, error: shipperError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", freightData.user_id)
            .single();

          if (!shipperError) {
            setShipper(shipperData);
          }

          // Check if current user has already made an offer
          if (user) {
            const { data: offerData, error: offerError } = await supabase
              .from("transport_offers")
              .select("*")
              .eq("freight_id", id)
              .eq("transporter_id", user.id)
              .single();

            if (!offerError && offerData) {
              setUserOffer(offerData);
              setOfferPrice(offerData.price_offered.toString());
            }
          }
        }

      } catch (error: any) {
        console.error("Error fetching freight details:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du fret",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFreightDetails();
  }, [id, user, toast]);

  const handleMakeOffer = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une offre",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!offerPrice) {
      toast({
        title: "Prix requis",
        description: "Veuillez entrer un prix pour votre offre",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (userOffer) {
        // Update existing offer
        const { error } = await supabase
          .from("transport_offers")
          .update({ price_offered: Number(offerPrice), updated_at: new Date().toISOString() })
          .eq("id", userOffer.id);

        if (error) throw error;

        toast({
          title: "Offre mise à jour",
          description: "Votre offre a été mise à jour avec succès",
        });

        setUserOffer({ ...userOffer, price_offered: Number(offerPrice) });
      } else {
        // Create new offer
        const { data, error } = await supabase
          .from("transport_offers")
          .insert({
            freight_id: id,
            transporter_id: user.id,
            price_offered: Number(offerPrice),
            status: "pending"
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Offre envoyée",
          description: "Votre offre a été envoyée au propriétaire de la marchandise",
        });

        setUserOffer(data);
      }
    } catch (error: any) {
      console.error("Error submitting offer:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de soumettre votre offre",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOffers = () => {
    navigate(`/freight/${freight?.id}/offers`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!freight) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Marchandise non trouvée</h1>
          <p className="mt-2 text-gray-600">Cette marchandise n'existe pas ou a été supprimée</p>
          <Button 
            onClick={() => navigate("/marketplace")}
            className="mt-6 bg-retourgo-orange hover:bg-retourgo-orange/90"
          >
            Retour à la place de marché
          </Button>
        </div>
      </div>
    );
  }

  const isOwnFreight = user && user.id === freight.user_id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FreightDetailsHeader 
          onBack={() => navigate(-1)} 
          title={freight.title}
        />

        <FreightDetailsCard 
          freight={freight} 
          shipper={shipper}
        />

        <Card>
          <CardContent className="pt-6">
            <FreightOfferForm
              freight={freight}
              isOwnFreight={isOwnFreight}
              userOffer={userOffer}
              offerPrice={offerPrice}
              isSubmitting={isSubmitting}
              onOfferPriceChange={setOfferPrice}
              onMakeOffer={handleMakeOffer}
              onViewOffers={handleViewOffers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightDetails;
