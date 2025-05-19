
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CompanyInfo {
  company_name: string;
  ninea: string;
  rc: string;
  address: string;
  logistics_contact_name: string;
  logistics_contact_phone: string;
  transport_license?: string;
  recurrent_locations?: string;
}

const CompanyRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: "",
    ninea: "",
    rc: "",
    address: "",
    logistics_contact_name: "",
    logistics_contact_phone: "",
    transport_license: "",
    recurrent_locations: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isTransporter, setIsTransporter] = useState(false);

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
        .select('user_type')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const userType = data.user_type;
        setIsTransporter(userType === "company_transporter");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!companyInfo.company_name || !companyInfo.ninea || !companyInfo.rc || !companyInfo.address) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update profile with company info
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            company_name: companyInfo.company_name,
            ninea: companyInfo.ninea,
            rc: companyInfo.rc,
            company_address: companyInfo.address,
            logistics_contact: companyInfo.logistics_contact_name,
            logistics_phone: companyInfo.logistics_contact_phone,
            transport_license: companyInfo.transport_license,
            recurrent_locations: companyInfo.recurrent_locations
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Informations enregistrées",
        description: "Les informations de votre entreprise ont été enregistrées avec succès.",
      });
      
      // Navigate to next step based on user type
      if (isTransporter) {
        navigate("/vehicle-selection");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating company info:", error);
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
              <Building className="h-6 w-6 text-retourgo-orange" />
              <CardTitle>Enregistrement de votre entreprise</CardTitle>
            </div>
            <CardDescription>
              Étape {step}/2 - Informations sur votre société
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
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Raison sociale*</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={companyInfo.company_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ninea">NINEA*</Label>
                      <Input
                        id="ninea"
                        name="ninea"
                        value={companyInfo.ninea}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rc">Registre de Commerce (RC)*</Label>
                      <Input
                        id="rc"
                        name="rc"
                        value={companyInfo.rc}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse du siège*</Label>
                    <Input
                      id="address"
                      name="address"
                      value={companyInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  {isTransporter && (
                    <div className="space-y-2">
                      <Label htmlFor="transport_license">Agrément de transport (si disponible)</Label>
                      <Input
                        id="transport_license"
                        name="transport_license"
                        value={companyInfo.transport_license}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logistics_contact_name">Nom du responsable logistique*</Label>
                      <Input
                        id="logistics_contact_name"
                        name="logistics_contact_name"
                        value={companyInfo.logistics_contact_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logistics_contact_phone">Téléphone du responsable*</Label>
                      <Input
                        id="logistics_contact_phone"
                        name="logistics_contact_phone"
                        value={companyInfo.logistics_contact_phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {!isTransporter && (
                    <div className="space-y-2">
                      <Label htmlFor="recurrent_locations">Lieux d'envoi récurrents (optionnel)</Label>
                      <Input
                        id="recurrent_locations"
                        name="recurrent_locations"
                        value={companyInfo.recurrent_locations}
                        onChange={handleInputChange}
                        placeholder="Ex: Dakar, Thiès, Saint-Louis"
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

export default CompanyRegistration;
