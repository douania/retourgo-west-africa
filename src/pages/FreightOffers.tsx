
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Freight } from "@/components/freight/FreightCard";
import { FreightOfferHeader } from "@/components/freight/FreightOfferHeader";
import { FreightOfferList } from "@/components/freight/FreightOfferList";
import { TransportOffer } from "@/components/freight/FreightOfferItem";

const FreightOffers = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [offers, setOffers] = useState<TransportOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFreightAndOffers = async () => {
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
        
        // Check if user is the freight owner
        if (freightData.user_id !== user.id) {
          toast({
            title: "Accès refusé",
            description: "Vous n'êtes pas autorisé à voir ces offres",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setFreight(freightData as Freight);

        // Fetch all offers for this freight with transporter profiles
        const { data: offersData, error: offersError } = await supabase
          .from("transport_offers")
          .select(`
            *,
            transporter:profiles!transport_offers_transporter_id_fkey(first_name, last_name, user_type, phone, rating)
          `)
          .eq("freight_id", id)
          .order("price_offered", { ascending: true });

        if (offersError) throw offersError;
        
        // Safe casting to the correct type
        setOffers(offersData as unknown as TransportOffer[]);
      } catch (error: any) {
        console.error("Error fetching freight offers:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les offres pour ce fret",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFreightAndOffers();
  }, [id, user, navigate, toast]);

  const handleAcceptOffer = async (offerId: string) => {
    if (!user || !freight) return;

    try {
      setProcessingId(offerId);

      // Update the selected offer status to accepted
      const { error: offerError } = await supabase
        .from("transport_offers")
        .update({ status: "accepted" })
        .eq("id", offerId);

      if (offerError) throw offerError;

      // Update all other offers for this freight to rejected
      const { error: otherOffersError } = await supabase
        .from("transport_offers")
        .update({ status: "rejected" })
        .eq("freight_id", id)
        .neq("id", offerId);

      if (otherOffersError) throw otherOffersError;

      // Update the freight status to assigned
      const { error: freightError } = await supabase
        .from("freights")
        .update({ status: "assigned" })
        .eq("id", freight.id);

      if (freightError) throw freightError;

      toast({
        title: "Offre acceptée",
        description: "L'offre de transport a été acceptée avec succès",
      });

      // Update local state
      setFreight({ ...freight, status: "assigned" });
      setOffers(offers.map(offer => ({
        ...offer,
        status: offer.id === offerId ? "accepted" : "rejected"
      })));
    } catch (error: any) {
      console.error("Error accepting offer:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter cette offre",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Fret non trouvé</h1>
          <p className="mt-2 text-gray-600">Ce fret n'existe pas ou a été supprimé</p>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-retourgo-orange hover:bg-retourgo-orange/90"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(`/freight/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" /> Retour au détail du fret
        </Button>

        <FreightOfferHeader freight={freight} />
        
        <Card>
          <CardContent className="pt-6">
            <FreightOfferList 
              offers={offers}
              freightStatus={freight.status}
              onAcceptOffer={handleAcceptOffer}
              processingId={processingId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightOffers;
