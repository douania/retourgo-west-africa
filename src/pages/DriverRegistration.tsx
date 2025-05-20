
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DocumentScanner from "@/components/form/DocumentScanner";
import DriverInfoForm from "@/components/driver/DriverInfoForm";
import { User, FileText, IdCard } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";

interface DriverInfo {
  full_name: string;
  license_number: string;
  license_categories: string;
  license_expiry: string;
  id_number: string;
  birth_date: string;
}

const DriverRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [driverInfo, setDriverInfo] = useState<DriverInfo>({
    full_name: "",
    license_number: "",
    license_categories: "",
    license_expiry: "",
    id_number: "",
    birth_date: ""
  });

  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle ID card capture with OCR data
  const handleIdCardCapture = (file: File, extractedData?: any) => {
    console.log("ID card captured with extracted data:", extractedData);
    const imageUrl = URL.createObjectURL(file);
    setIdCardImage(imageUrl);

    if (extractedData) {
      setDriverInfo(prev => ({
        ...prev,
        full_name: extractedData.full_name || extractedData.nom_complet || prev.full_name,
        birth_date: extractedData.birth_date || extractedData.date_de_naissance || prev.birth_date,
        id_number: extractedData.id_number || extractedData.numero_identification || extractedData.numero_carte || prev.id_number
      }));
    }
  };

  // Handle driver license capture with OCR data
  const handleLicenseCapture = (file: File, extractedData?: any) => {
    console.log("License captured with extracted data:", extractedData);
    const imageUrl = URL.createObjectURL(file);
    setLicenseImage(imageUrl);

    if (extractedData) {
      setDriverInfo(prev => ({
        ...prev,
        full_name: extractedData.full_name || extractedData.nom_complet || prev.full_name,
        license_number: extractedData.license_number || extractedData.numero_permis || extractedData.numero || prev.license_number,
        license_categories: extractedData.categories || extractedData.license_categories || extractedData.categorie || prev.license_categories,
        license_expiry: extractedData.expiry_date || extractedData.date_expiration || prev.license_expiry
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveIdCard = () => {
    setIdCardImage(null);
  };

  const handleRemoveLicense = () => {
    setLicenseImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!driverInfo.full_name || !driverInfo.license_number || !driverInfo.id_number) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Check for images
    if (!idCardImage || !licenseImage) {
      toast({
        title: "Documents manquants",
        description: "Veuillez télécharger la carte d'identité et le permis de conduire.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In practice, you would send this data to your backend
      // For example: await registerDriver(driverInfo, idCardImage, licenseImage);
      
      // Simulate a registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Conducteur enregistré",
        description: `Le conducteur ${driverInfo.full_name} a été ajouté à votre entreprise.`,
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Erreur d'enregistrement du conducteur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du conducteur.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-retourgo-orange" />
              <CardTitle>Enregistrement d'un nouveau conducteur</CardTitle>
            </div>
            <CardDescription>
              Ajoutez un conducteur à votre entreprise en scannant ses documents d'identité
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <DocumentScanner
                  documentType="id_card"
                  onDocumentCaptured={handleIdCardCapture}
                  previewUrl={idCardImage}
                  onDocumentRemove={handleRemoveIdCard}
                  showBothSides={true}
                />
                
                <DocumentScanner
                  documentType="driver_license"
                  onDocumentCaptured={handleLicenseCapture}
                  previewUrl={licenseImage}
                  onDocumentRemove={handleRemoveLicense}
                  showBothSides={true}
                />
              </div>
              
              <DriverInfoForm
                driverInfo={driverInfo}
                handleInputChange={handleInputChange}
              />
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Ajouter ce conducteur"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default DriverRegistration;
