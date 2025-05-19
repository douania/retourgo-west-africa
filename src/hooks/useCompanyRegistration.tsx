
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CompanyInfoFormData } from "@/components/registration/CompanyInfoForm";

export const useCompanyRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get user type from navigation state
  const userTypeFromState = (location.state as { userType?: string })?.userType;
  const [isTransporter, setIsTransporter] = useState(
    userTypeFromState === "company_transporter"
  );
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoFormData>({
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

  // Check profile type on component mount
  useEffect(() => {
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
        // If user type is not defined by navigation, use the one from database
        if (!userTypeFromState) {
          setIsTransporter(userType === "company_transporter");
        }
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
            first_name: companyInfo.company_name, // Store company name in first_name
            last_name: `NINEA: ${companyInfo.ninea}, RC: ${companyInfo.rc}`, // Store NINEA and RC in last_name
            phone: companyInfo.logistics_contact_phone, // Logistics contact phone
            return_origin: companyInfo.address, // Company address in return_origin
            return_destination: companyInfo.recurrent_locations || null, // Recurring locations in return_destination
            user_type: isTransporter ? "company_transporter" : "company_shipper"
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

  return {
    companyInfo,
    isTransporter,
    isSubmitting,
    step,
    handleInputChange,
    handleSubmit,
    nextStep,
    prevStep
  };
};
