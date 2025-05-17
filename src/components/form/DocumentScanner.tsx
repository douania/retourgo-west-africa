
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { FileType, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocumentType = "vehicle_registration" | "driver_license" | "other";

interface DocumentScannerProps {
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  documentType: DocumentType;
  title?: string;
  description?: string;
  previewUrl?: string | null;
  onDocumentRemove?: () => void;
}

const DocumentScanner = ({
  onDocumentCaptured,
  documentType,
  title,
  description,
  previewUrl,
  onDocumentRemove
}: DocumentScannerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Get title and description based on document type if not provided
  const getTitle = () => {
    if (title) return title;
    
    switch (documentType) {
      case "vehicle_registration":
        return "Carte grise du véhicule";
      case "driver_license":
        return "Permis de conduire";
      default:
        return "Document";
    }
  };

  const getDescription = () => {
    if (description) return description;
    
    switch (documentType) {
      case "vehicle_registration":
        return "Prenez en photo la carte grise pour enregistrer automatiquement les informations du véhicule";
      case "driver_license":
        return "Prenez en photo votre permis de conduire pour valider votre compte transporteur";
      default:
        return "Prenez en photo ou téléchargez votre document";
    }
  };

  const handleImageCapture = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, we would send the image to an OCR service
      // and extract the relevant information
      
      // For now, just simulate processing with a timeout
      setTimeout(() => {
        let mockExtractedData = null;
        
        // Mock data based on document type
        if (documentType === "vehicle_registration") {
          mockExtractedData = {
            plate_number: "1234 ABC 75",
            make: "TOYOTA",
            model: "HILUX",
            year: "2018",
            registration_date: "15/06/2018",
            owner: "NOM PRÉNOM",
            vehicle_type: "PICKUP"
          };
        } else if (documentType === "driver_license") {
          mockExtractedData = {
            license_number: "12345678",
            full_name: "NOM PRÉNOM",
            birth_date: "01/01/1980",
            issue_date: "01/01/2020",
            expiry_date: "01/01/2025",
            categories: "B, C"
          };
        }
        
        // Pass the file and extracted data to the parent component
        onDocumentCaptured(file, mockExtractedData);
        
        // Show success toast
        toast({
          title: "Document traité",
          description: mockExtractedData ? "Les informations ont été extraites avec succès." : "Le document a été enregistré.",
        });
        
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du document.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileType className="h-5 w-5 text-retourgo-orange" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4 border rounded-lg bg-gray-50">
            <div className="w-12 h-12 border-4 border-t-retourgo-orange rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Analyse du document en cours...</p>
          </div>
        ) : (
          <ImageUpload
            onImageCapture={handleImageCapture}
            onImageRemove={onDocumentRemove}
            previewUrl={previewUrl}
            allowCapture={true}
            label={getTitle()}
            description={getDescription()}
          />
        )}

        {documentType === "vehicle_registration" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
            <p className="font-medium mb-1">Conseils pour la photo de carte grise:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Assurez-vous que tout le document est visible et bien éclairé</li>
              <li>Évitez les reflets ou les ombres sur le document</li>
              <li>Placez le document sur une surface plane de couleur unie</li>
            </ul>
          </div>
        )}

        {documentType === "driver_license" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
            <p className="font-medium mb-1">Conseils pour la photo du permis:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Assurez-vous que les informations sont clairement lisibles</li>
              <li>Vérifiez que la date d'expiration est visible</li>
              <li>Prenez en photo le recto et le verso du permis</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
