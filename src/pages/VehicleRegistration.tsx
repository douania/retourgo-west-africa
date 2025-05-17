
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RegistrationCard from "@/components/vehicle/RegistrationCard";
import { registerVehicle } from "@/services/VehicleRegistrationService";

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
    // Create URL for image preview
    const imageUrl = URL.createObjectURL(file);
    setRegistrationImage(imageUrl);
    
    // Update form with extracted data if available
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
    setIsSubmitting(true);
    
    try {
      await registerVehicle(vehicleInfo, registrationImage);
      
      toast({
        title: "Véhicule enregistré",
        description: `Le véhicule ${vehicleInfo.make} ${vehicleInfo.model} a été ajouté à votre flotte.`,
      });
      
      // Navigate to vehicles list (or create it if it doesn't exist)
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
    <div className="min-h-screen bg-gray-50 py-12">
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
    </div>
  );
};

export default VehicleRegistration;
