
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, TruckIcon, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Freight } from "@/components/freight/FreightCard";

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
          description: "Votre offre a été envoyée au propriétaire du fret",
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
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <Card className="mb-6">
          <CardHeader className="border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">{freight.title}</CardTitle>
                <p className="text-gray-600 mt-1">
                  Publié par {shipper ? `${shipper.first_name || ''} ${shipper.last_name || ''}` : 'Transporteur'}
                </p>
              </div>
              <Badge variant={freight.status === "available" ? "success" : "secondary"}>
                {freight.status === "available" ? "Disponible" : "Attribué"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Détails du fret</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-retourgo-orange mt-0.5" />
                    <div>
                      <p className="font-medium">Itinéraire:</p>
                      <p className="text-lg font-semibold text-retourgo-green">
                        {freight.origin} → {freight.destination}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-retourgo-orange mt-0.5" />
                    <div>
                      <p className="font-medium">Dates:</p>
                      <p>Chargement: {new Date(freight.pickup_date).toLocaleDateString()}</p>
                      <p>Livraison: {new Date(freight.delivery_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-retourgo-orange mt-0.5" />
                    <div>
                      <p className="font-medium">Dimensions:</p>
                      <p>Poids: {freight.weight} kg</p>
                      <p>Volume: {freight.volume} m³</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{freight.description}</p>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Prix demandé:</span>
                    <span className="text-2xl font-bold text-retourgo-orange">{freight.price} €</span>
                  </div>

                  {!isOwnFreight && freight.status === "available" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="offerPrice">Votre offre (€)</Label>
                        <Input
                          id="offerPrice"
                          type="number"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          placeholder="Saisir votre offre"
                          min={1}
                        />
                      </div>
                      <Button
                        onClick={handleMakeOffer}
                        className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting 
                          ? "Envoi en cours..." 
                          : userOffer 
                            ? "Mettre à jour mon offre" 
                            : "Faire une offre"}
                      </Button>
                      {userOffer && (
                        <p className="text-sm text-gray-500 text-center">
                          Vous avez déjà fait une offre de {userOffer.price_offered}€ pour ce fret.
                          {userOffer.status !== 'pending' && ` (Statut: ${userOffer.status === 'accepted' ? 'Acceptée' : 'Refusée'})`}
                        </p>
                      )}
                    </div>
                  )}

                  {isOwnFreight && (
                    <Button
                      onClick={() => navigate(`/freight/${freight.id}/offers`)}
                      className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
                    >
                      <TruckIcon className="mr-2 h-4 w-4" /> Voir les offres de transport
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightDetails;
