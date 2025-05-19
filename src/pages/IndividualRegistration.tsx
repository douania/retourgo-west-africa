
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DocumentScanner from "@/components/form/DocumentScanner";

interface PersonalInfo {
  full_name: string;
  id_number: string;
  address: string;
  phone: string;
  email: string;
  preferred_origin?: string;
}

const IndividualRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer le type d'utilisateur du state de navigation
  const userTypeFromState = (location.state as { userType?: string })?.userType;
  const [isTransporter, setIsTransporter] = useState(
    userTypeFromState === "individual_transporter"
  );
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: "",
    id_number: "",
    address: "",
    phone: "",
    email: "",
    preferred_origin: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);

  // Check profile type on component mount
  React.useEffect(() => {
    if (user) {
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, first_name, last_name, phone')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const userType = data.user_type;
        // Si le type d'utilisateur n'est pas défini par la navigation, utiliser celui de la base de données
        if (!userTypeFromState) {
          setIsTransporter(userType === "individual_transporter");
        }
        
        // Pre-fill form with existing data
        setPersonalInfo(prev => ({
          ...prev,
          full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          phone: data.phone || "",
          email: user.email || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la capture de la carte d'identité
  const handleIdCardCapture = (file: File, extractedData?: any) => {
    const imageUrl = URL.createObjectURL(file);
    setIdCardImage(imageUrl);

    if (extractedData) {
      setPersonalInfo(prev => ({
        ...prev,
        full_name: extractedData.full_name || prev.full_name,
        id_number: extractedData.id_number || prev.id_number
      }));
    }
  };

  const handleRemoveIdCard = () => {
    setIdCardImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!personalInfo.full_name || !personalInfo.id_number) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update profile with personal info
      if (user) {
        // Split full name into first and last name
        const nameParts = personalInfo.full_name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ");
        
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: personalInfo.phone,
            return_origin: personalInfo.preferred_origin || null,
            user_type: isTransporter ? "individual_transporter" : "individual_shipper"
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Informations enregistrées",
        description: "Vos informations personnelles ont été enregistrées avec succès.",
      });
      
      // Navigate to next step based on user type
      if (isTransporter) {
        navigate("/vehicle-selection");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des informations.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-retourgo-orange" />
              <CardTitle>Complétez votre profil</CardTitle>
            </div>
            <CardDescription>
              Étape {step}/2 - Informations personnelles
            </CardDescription>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div 
                className="bg-retourgo-orange h-2.5 rounded-full" 
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <DocumentScanner
                    documentType="id_card"
                    onDocumentCaptured={handleIdCardCapture}
                    previewUrl={idCardImage}
                    onDocumentRemove={handleRemoveIdCard}
                    showBothSides={true}
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet*</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={personalInfo.full_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="id_number">Numéro de pièce d'identité*</Label>
                    <Input
                      id="id_number"
                      name="id_number"
                      value={personalInfo.id_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={personalInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                  
                  {!isTransporter && (
                    <div className="space-y-2">
                      <Label htmlFor="preferred_origin">Adresse de départ habituelle (optionnelle)</Label>
                      <Input
                        id="preferred_origin"
                        name="preferred_origin"
                        value={personalInfo.preferred_origin || ""}
                        onChange={handleInputChange}
                        placeholder="Ex: Dakar, Quartier Mermoz"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className={`${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={prevStep}
                >
                  Précédent
                </Button>
              )}
              
              {step < 2 ? (
                <Button 
                  type="button" 
                  className="bg-retourgo-orange hover:bg-retourgo-orange/90"
                  onClick={nextStep}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-retourgo-orange hover:bg-retourgo-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Terminer l'inscription"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default IndividualRegistration;
