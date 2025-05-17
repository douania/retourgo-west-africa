
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentScanner from "@/components/form/DocumentScanner";
import VehicleInfoForm from "@/components/vehicle/VehicleInfoForm";
import { Truck, FileBadge } from "lucide-react";

interface VehicleInfo {
  plate_number: string;
  make: string;
  model: string;
  year: string;
  type: string;
  capacity: string;
}

interface RegistrationCardProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  vehicleInfo: VehicleInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDocumentCapture: (file: File, extractedData?: any) => void;
  handleRemoveDocument: () => void;
  registrationImage: string | null;
}

const RegistrationCard = ({
  isSubmitting,
  onSubmit,
  vehicleInfo,
  handleInputChange,
  handleDocumentCapture,
  handleRemoveDocument,
  registrationImage
}: RegistrationCardProps) => {
  return (
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
      
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <DocumentScanner
            documentType="vehicle_registration"
            onDocumentCaptured={handleDocumentCapture}
            previewUrl={registrationImage}
            onDocumentRemove={handleRemoveDocument}
          />
          
          <VehicleInfoForm
            vehicleInfo={vehicleInfo}
            handleInputChange={handleInputChange}
          />
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
  );
};

export default RegistrationCard;
