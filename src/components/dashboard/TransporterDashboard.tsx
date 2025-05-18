
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, Star, Bell, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FreightCard from "@/components/freight/FreightCard";
import { TransportOffer, Freight } from "@/types/freight";

interface TransporterDashboardProps {
  offers: TransportOffer[];
  nearbyFreights: Freight[];
}

const TransporterDashboard = ({ offers, nearbyFreights }: TransporterDashboardProps) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();

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
              onCheckedChange={setIsAvailable}
            />
            <Label htmlFor="availability" className="font-medium text-lg">
              Je suis disponible
            </Label>
          </div>
          <p className="text-gray-600 mb-4">
            Activez votre disponibilité pour être visible par les expéditeurs et recevoir des propositions de fret.
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
            Nouvelles offres de fret: <span className="font-semibold">3</span>
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
            Voir les frets disponibles
          </Button>
        </Card>
      </div>

      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="nearby">Frets à proximité</TabsTrigger>
          <TabsTrigger value="my-offers">Mes offres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-retourgo-orange" />
            Frets disponibles autour de vous
          </h3>
          {nearbyFreights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucun fret à proximité</h3>
              <p className="text-gray-500 mt-2">Activez votre disponibilité pour être notifié des nouveaux frets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyFreights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
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
              <p className="text-gray-500 mt-2">Vous n'avez pas encore fait d'offre sur un fret.</p>
              <Button 
                onClick={() => navigate("/marketplace")} 
                className="mt-6 bg-retourgo-green hover:bg-retourgo-green/90"
              >
                Voir les frets disponibles
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
                         'Refusée'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 text-retourgo-orange" />
                      <span>{offer.freights.origin} → {offer.freights.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{offer.price_offered} €</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/freight/${offer.freight_id}`)}
                      >
                        Voir le fret
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
