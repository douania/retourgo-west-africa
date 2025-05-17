
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TruckIcon, MapPin, Calendar } from "lucide-react";
import { Freight } from "./FreightCard";

interface ShipperProfile {
  first_name: string | null;
  last_name: string | null;
}

interface FreightDetailsCardProps {
  freight: Freight;
  shipper: ShipperProfile | null;
}

export const FreightDetailsCard = ({ freight, shipper }: FreightDetailsCardProps) => {
  return (
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
