
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, Truck, MessageSquare } from "lucide-react";
import FreightCard from "@/components/freight/FreightCard";
import { Freight } from "@/types/freight";

interface ShipperDashboardProps {
  myFreights: Freight[];
}

const ShipperDashboard = ({ myFreights }: ShipperDashboardProps) => {
  const navigate = useNavigate();

  const activeFreights = myFreights.filter(f => f.status === 'available');
  const inProgressFreights = myFreights.filter(f => f.status === 'in-progress');
  const completedFreights = myFreights.filter(f => f.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6 bg-white shadow-md col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Gérer vos marchandises</h2>
            <Package className="h-5 w-5 text-retourgo-orange" />
          </div>
          <p className="text-gray-600 mb-6">
            Créez votre demande d'expédition et trouvez rapidement un transporteur fiable pour vos marchandises.
          </p>
          <Button 
            className="bg-retourgo-orange hover:bg-retourgo-orange/90"
            onClick={() => navigate("/new-freight")}
          >
            Publier une nouvelle marchandise
          </Button>
        </Card>

        <Card className="p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Résumé</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Marchandises actives:</span>
              <Badge variant="default" className="bg-blue-500">
                {activeFreights.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En cours de livraison:</span>
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                {inProgressFreights.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Livraisons terminées:</span>
              <Badge variant="outline" className="border-green-500 text-green-500">
                {completedFreights.length}
              </Badge>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 mt-2"
                onClick={() => navigate("/profile")}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Mes messages</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="in-progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-retourgo-orange" />
              Marchandises en attente de transporteur
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate("/marketplace")}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Voir tous les transporteurs</span>
            </Button>
          </div>
          {activeFreights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucune marchandise active</h3>
              <p className="text-gray-500 mt-2">Publiez une marchandise pour trouver un transporteur.</p>
              <Button 
                onClick={() => navigate("/new-freight")} 
                className="mt-6 bg-retourgo-orange hover:bg-retourgo-orange/90"
              >
                Publier une marchandise
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFreights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-retourgo-orange" />
            Marchandises en cours de livraison
          </h3>
          {inProgressFreights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucune marchandise en cours</h3>
              <p className="text-gray-500 mt-2">Vous n'avez pas de livraison en cours.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressFreights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-retourgo-orange" />
            Marchandises livrées
          </h3>
          {completedFreights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucune marchandise livrée</h3>
              <p className="text-gray-500 mt-2">Votre historique de livraisons sera affiché ici.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedFreights.map((freight) => (
                <FreightCard key={freight.id} freight={freight} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipperDashboard;
