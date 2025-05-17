
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, TruckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Freight } from "@/components/freight/FreightCard";

interface TransportOffer {
  id: string;
  freight_id: string;
  transporter_id: string;
  price_offered: number;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    user_type: string;
    phone: string | null;
    rating: number | null;
  };
}

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
            profiles:transporter_id(first_name, last_name, user_type, phone, rating)
          `)
          .eq("freight_id", id)
          .order("price_offered", { ascending: true });

        if (offersError) throw offersError;
        
        setOffers(offersData);
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

        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Offres pour {freight.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {freight.origin} → {freight.destination}
                </p>
              </div>
              <Badge variant={freight.status === "available" ? "success" : "secondary"}>
                {freight.status === "available" ? "Disponible" : "Attribué"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {offers.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700">Aucune offre</h3>
                <p className="text-gray-500 mt-2">
                  Votre fret n'a pas encore reçu d'offres de transporteurs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b text-sm font-medium text-gray-500">
                  <div className="w-1/4">Transporteur</div>
                  <div className="w-1/4 text-center">Date de l'offre</div>
                  <div className="w-1/4 text-center">Prix offert</div>
                  <div className="w-1/4"></div>
                </div>

                {offers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className="flex justify-between items-center p-4 border rounded-md bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="w-1/4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-retourgo-green" />
                        <span className="font-medium">
                          {offer.profiles?.first_name || ''} {offer.profiles?.last_name || ''}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/4 text-center text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4 text-retourgo-orange" />
                        {new Date(offer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="w-1/4 text-center">
                      <span className="text-lg font-bold text-retourgo-orange">
                        {offer.price_offered} €
                      </span>
                    </div>
                    <div className="w-1/4 flex justify-end">
                      {offer.status === 'pending' && freight.status === 'available' ? (
                        <Button
                          className="bg-retourgo-green hover:bg-retourgo-green/90"
                          onClick={() => handleAcceptOffer(offer.id)}
                          disabled={Boolean(processingId)}
                        >
                          <TruckIcon className="mr-2 h-4 w-4" />
                          {processingId === offer.id ? "En cours..." : "Accepter"}
                        </Button>
                      ) : (
                        <Badge variant={offer.status === 'accepted' ? 'success' : 'secondary'}>
                          {offer.status === 'accepted' ? 'Accepté' : 'Refusé'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightOffers;
