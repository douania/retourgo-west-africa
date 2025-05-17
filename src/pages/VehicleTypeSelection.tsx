
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, ArrowRight } from "lucide-react";

const vehicleTypes = [
  {
    id: "pickup",
    name: "Pickup",
    icon: <Truck className="h-10 w-10 text-retourgo-orange" />,
    description: "Véhicule utilitaire léger pour les petites charges",
    capacity: "Jusqu'à 1 tonne",
    example: "Toyota Hilux, Ford Ranger"
  },
  {
    id: "van",
    name: "Fourgon",
    icon: <Package className="h-10 w-10 text-retourgo-green" />,
    description: "Parfait pour les livraisons urbaines",
    capacity: "1 à 3 tonnes",
    example: "Mercedes Sprinter, Renault Master"
  },
  {
    id: "truck",
    name: "Camion",
    icon: <Truck className="h-10 w-10 text-blue-500" />,
    description: "Pour le transport de charges lourdes",
    capacity: "Plus de 3 tonnes",
    example: "Scania, MAN, Iveco"
  }
];

const VehicleTypeSelection = () => {
  const navigate = useNavigate();

  const handleVehicleTypeSelect = (vehicleType: string) => {
    navigate(`/vehicles/new?type=${vehicleType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Ajouter un véhicule à votre flotte
          </h1>
          <p className="mt-2 text-gray-600">
            Sélectionnez le type de véhicule que vous souhaitez enregistrer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicleTypes.map((type) => (
            <Card 
              key={type.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-retourgo-orange"
              onClick={() => handleVehicleTypeSelect(type.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-center">{type.icon}</div>
                <CardTitle className="text-center">{type.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-2">{type.description}</CardDescription>
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Capacité:</span> {type.capacity}</p>
                  <p><span className="font-medium">Exemples:</span> {type.example}</p>
                </div>
                <Button 
                  className="mt-4 w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
                >
                  Sélectionner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeSelection;
