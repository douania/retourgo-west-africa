
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RegistrationCard from "@/components/vehicle/RegistrationCard";
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

const VehicleRegistration = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [registrationImage, setRegistrationImage] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    plate_number: "",
    make: "",
    model: "",
    year: "",
    type: "",
    capacity: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        type: extractedData.vehicle_type || "",
        capacity: ""
      });
    }
    // Sinon, garder les données actuelles du formulaire pour que l'utilisateur les complète manuellement
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
    if (!vehicleInfo.plate_number || !vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.type || !vehicleInfo.capacity) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-700">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
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

export default VehicleRegistration;
