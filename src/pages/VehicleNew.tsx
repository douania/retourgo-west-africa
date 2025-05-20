
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, ArrowLeft } from "lucide-react";
import RegistrationCard from "@/components/vehicle/RegistrationCard";
import { useToast } from "@/hooks/use-toast";
import { registerVehicle } from "@/services/VehicleRegistrationService";
import BottomNavigation from "@/components/navigation/BottomNavigation";

interface VehicleInfo {
  plate_number: string;
  make: string;
  model: string;
  year: string;
  type: string;
  capacity: string;
}

const vehicleTypeLabels: Record<string, string> = {
  pickup: "Pickup",
  van: "Fourgon",
  truck: "Camion"
};

const VehicleNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const vehicleType = searchParams.get("type") || "";
  
  const [registrationImage, setRegistrationImage] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    plate_number: "",
    make: "",
    model: "",
    year: "",
    type: vehicleType,
    capacity: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update vehicle type when URL param changes
  useEffect(() => {
    setVehicleInfo(prev => ({
      ...prev,
      type: vehicleType
    }));
  }, [vehicleType]);
  
  // Redirect to type selection if no type is provided
  useEffect(() => {
    if (!vehicleType) {
      navigate("/vehicle-type");
    }
  }, [vehicleType, navigate]);

  const handleDocumentCapture = (file: File, extractedData?: any) => {
    // Créer URL pour la prévisualisation de l'image
    const imageUrl = URL.createObjectURL(file);
    setRegistrationImage(imageUrl);
    
    // Mettre à jour le formulaire avec les données extraites si disponibles
    if (extractedData) {
      setVehicleInfo({
        plate_number: extractedData.plate_number || "",
        make: extractedData.make || "",
        model: extractedData.model || "",
        year: extractedData.year || "",
        type: vehicleType || extractedData.vehicle_type || "",
        capacity: ""  // La capacité doit toujours être saisie manuellement
      });
    }
  };

  const handleRemoveDocument = () => {
    setRegistrationImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!vehicleInfo.plate_number || !vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.capacity) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerVehicle(vehicleInfo, registrationImage);
      
      toast({
        title: "Véhicule enregistré",
        description: `Le véhicule ${vehicleInfo.make} ${vehicleInfo.model} a été ajouté à votre flotte.`,
      });
      
      // Naviguer vers la liste des véhicules
      navigate("/profile");
    } catch (error) {
      console.error("Error registering vehicle:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du véhicule.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/vehicle-type");
  };

  const vehicleTypeLabel = vehicleTypeLabels[vehicleType] || "Véhicule";

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-4">
          <Button variant="ghost" onClick={handleGoBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-retourgo-orange" />
              Ajout d'un {vehicleTypeLabel}
            </CardTitle>
            <CardDescription>
              Ajoutez un véhicule de type {vehicleTypeLabel.toLowerCase()} à votre flotte en scannant sa carte grise ou en remplissant le formulaire
            </CardDescription>
          </CardHeader>
        </Card>
        
        <RegistrationCard 
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          vehicleInfo={vehicleInfo}
          handleInputChange={handleInputChange}
          handleDocumentCapture={handleDocumentCapture}
          handleRemoveDocument={handleRemoveDocument}
          registrationImage={registrationImage}
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default VehicleNew;
