
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PersonalInfoFormData } from "@/components/registration/PersonalInfoForm";

export const useIndividualRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Récupérer le type d'utilisateur du state de navigation
  const userTypeFromState = (location.state as { userType?: string })?.userType;
  const [isTransporter, setIsTransporter] = useState(
    userTypeFromState === "individual_transporter"
  );
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData>({
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

  return {
    personalInfo,
    isTransporter,
    isSubmitting,
    step,
    idCardImage,
    handleInputChange,
    handleIdCardCapture,
    handleRemoveIdCard,
    handleSubmit,
    nextStep,
    prevStep
  };
};
