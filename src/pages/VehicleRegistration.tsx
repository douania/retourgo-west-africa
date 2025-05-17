
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentScanner from "@/components/form/DocumentScanner";
import { useToast } from "@/hooks/use-toast";
import { Truck, FileBadge } from "lucide-react";

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
      // In a real implementation, this would send data to your backend
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-retourgo-orange" />
              <CardTitle>Enregistrement d'un nouveau véhicule</CardTitle>
            </div>
            <CardDescription>
              Ajoutez un véhicule à votre flotte en scannant la carte grise ou en remplissant le formulaire manuellement
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <DocumentScanner
                documentType="vehicle_registration"
                onDocumentCaptured={handleDocumentCapture}
                previewUrl={registrationImage}
                onDocumentRemove={handleRemoveDocument}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="plate_number">Numéro d'immatriculation*</Label>
                  <Input
                    id="plate_number"
                    name="plate_number"
                    value={vehicleInfo.plate_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="make">Marque*</Label>
                  <Input
                    id="make"
                    name="make"
                    value={vehicleInfo.make}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle*</Label>
                  <Input
                    id="model"
                    name="model"
                    value={vehicleInfo.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    name="year"
                    value={vehicleInfo.year}
                    onChange={handleInputChange}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear().toString()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type de véhicule*</Label>
                  <Input
                    id="type"
                    name="type"
                    value={vehicleInfo.type}
                    onChange={handleInputChange}
                    placeholder="Ex: Camion, Van, Pickup..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité de charge (kg)*</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    value={vehicleInfo.capacity}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Ajouter ce véhicule à ma flotte"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VehicleRegistration;
