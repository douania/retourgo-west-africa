import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, Star, Bell, Calendar, Navigation } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FreightCard from "@/components/freight/FreightCard";
import { TransportOffer, Freight } from "@/types/freight";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import LocationMap from "@/components/map/LocationMap";

interface TransporterDashboardProps {
  offers: TransportOffer[];
  nearbyFreights: Freight[];
}

const TransporterDashboard = ({ offers, nearbyFreights }: TransporterDashboardProps) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasReturnRoute, setHasReturnRoute] = useState(false);
  const [returnOrigin, setReturnOrigin] = useState("");
  const [returnDestination, setReturnDestination] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_available, return_origin, return_destination')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          return;
        }
        
        if (data) {
          setIsAvailable(data.is_available || false);
          setReturnOrigin(data.return_origin || "");
          setReturnDestination(data.return_destination || "");
          setHasReturnRoute(!!(data.return_origin && data.return_destination));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur:", err);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleAvailabilityChange = async (newStatus: boolean) => {
    if (!user) return;
    
    setIsAvailable(newStatus);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_available: newStatus })
        .eq('id', user.id);
        
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour votre disponibilité",
          variant: "destructive",
        });
        setIsAvailable(!newStatus); // Revenir à l'état précédent
        return;
      }
      
      toast({
        title: newStatus ? "Disponible" : "Non disponible",
        description: newStatus 
          ? "Vous êtes maintenant disponible pour des marchandises retour" 
          : "Vous n'êtes plus disponible pour des marchandises retour",
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la disponibilité:", err);
      setIsAvailable(!newStatus);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  };
  
  const handleDefineReturnRoute = async (origin: string, destination: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          return_origin: origin,
          return_destination: destination
        })
        .eq('id', user.id);
        
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre trajet retour",
          variant: "destructive",
        });
        return;
      }
      
      setReturnOrigin(origin);
      setReturnDestination(destination);
      setHasReturnRoute(true);
      
      toast({
        title: "Trajet retour enregistré",
        description: `De ${origin} à ${destination}`,
      });
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du trajet retour:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du trajet retour",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6 bg-white shadow-md col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Votre statut</h2>
            <Badge variant={isAvailable ? "success" : "secondary"}>
              {isAvailable ? "Disponible" : "Non disponible"}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <Switch 
              id="availability" 
              checked={isAvailable}
              onCheckedChange={handleAvailabilityChange}
            />
            <Label htmlFor="availability" className="font-medium text-lg">
              Je suis disponible pour des marchandises retour
            </Label>
          </div>
          <p className="text-gray-600 mb-4">
            Activez votre disponibilité pour être visible par les expéditeurs et recevoir des propositions de transport.
            {hasReturnRoute && (
              <span className="block mt-2">
                Trajet retour défini: <span className="font-medium">{returnOrigin}</span> → <span className="font-medium">{returnDestination}</span>
              </span>
            )}
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/vehicles")}
            >
              <Truck className="h-4 w-4" />
              <span>Gérer mes véhicules</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/profile")}
            >
              <Star className="h-4 w-4" />
              <span>Mon profil</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Bell className="h-5 w-5 text-retourgo-orange" />
          </div>
          <p className="text-gray-600 mb-2">
            Nouvelles offres de transport: <span className="font-semibold">3</span>
          </p>
          <p className="text-gray-600 mb-2">
            Messages: <span className="font-semibold">1</span>
          </p>
          <p className="text-gray-600 mb-4">
            Évaluations en attente: <span className="font-semibold">2</span>
          </p>
          <Button 
            className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
            onClick={() => navigate("/marketplace")}
          >
            Voir les marchandises disponibles
          </Button>
        </Card>
      </div>
      
      <Card className="p-6 bg-white shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-retourgo-orange" />
            Géolocalisation et trajets retour
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <LocationMap 
              showCurrentLocation={true}
              onDefineReturnRoute={handleDefineReturnRoute}
              title="Ma position actuelle"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Mon trajet retour</h3>
            {hasReturnRoute ? (
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-retourgo-green" />
                  <h4 className="font-medium">Trajet retour enregistré</h4>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-retourgo-orange" />
                  <div className="flex flex-col">
                    <span>Départ: {returnOrigin}</span>
                    <span className="font-semibold text-retourgo-green">→ Destination: {returnDestination}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Le système vous notifiera des marchandises compatibles avec ce trajet.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setHasReturnRoute(false)}
                >
                  Modifier mon trajet retour
                </Button>
              </div>
            ) : (
              <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
                <p className="text-sm text-gray-700">
                  Vous n'avez pas encore défini de trajet retour. Utilisez le formulaire sur la carte pour le définir.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Cela vous permettra de recevoir des suggestions de marchandises compatibles avec votre itinéraire.
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium mb-2">Suivi en temps réel</h4>
              <p className="text-sm text-gray-600">
                Activez le suivi de position pour être alerté des marchandises à proximité de votre localisation actuelle.
              </p>
              <ul className="text-xs text-gray-500 mt-2 list-disc list-inside space-y-1">
                <li>Optimisez vos trajets retour</li>
                <li>Réduisez les kilomètres à vide</li>
                <li>Maximisez votre rentabilité</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="nearby">Marchandises à proximité</TabsTrigger>
          <TabsTrigger value="my-offers">Mes offres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-retourgo-orange" />
            Marchandises disponibles autour de vous
          </h3>
          {nearbyFreights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucune marchandise à proximité</h3>
              <p className="text-gray-500 mt-2">Activez votre disponibilité pour être notifié des nouvelles marchandises.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyFreights.map((freight) => (
                <FreightCard 
                  key={freight.id} 
                  freight={{...freight, isReturnTrip: isAvailable}}
                  showReturnDiscount={isAvailable}
                  originalPrice={isAvailable ? Math.round(freight.price / 0.7) : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-offers">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-retourgo-orange" />
            Vos offres de transport
          </h3>
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucune offre</h3>
              <p className="text-gray-500 mt-2">Vous n'avez pas encore fait d'offre sur une marchandise.</p>
              <Button 
                onClick={() => navigate("/marketplace")} 
                className="mt-6 bg-retourgo-green hover:bg-retourgo-green/90"
              >
                Voir les marchandises disponibles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden hover:shadow-md">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{offer.freights.title}</h3>
                      <Badge 
                        variant={
                          offer.status === 'pending' ? 'default' : 
                          offer.status === 'accepted' ? 'success' : 
                          'secondary'
                        }
                      >
                        {offer.status === 'pending' ? 'En attente' : 
                         offer.status === 'accepted' ? 'Acceptée' : 
                         offer.status === 'rejected' ? 'Refusée' : ''}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-retourgo-orange" />
                      <span>{offer.freights.origin} → {offer.freights.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{offer.price_offered} FCFA</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/freight/${offer.freight_id}`)}
                      >
                        Voir la marchandise
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransporterDashboard;
