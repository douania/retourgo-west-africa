
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  checkUserProfile, 
  updateIndividualProfile 
} from "@/services/IndividualRegistrationService";
import {
  fetchDocumentImage,
  uploadDocument
} from "@/services/DocumentService";
import { 
  useIndividualRegistrationState, 
  UseIndividualRegistrationStateProps 
} from "./useIndividualRegistrationState";

export const useIndividualRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get user type from navigation state
  const userTypeFromState = (location.state as { userType?: string })?.userType;
  
  // Setup state management
  const {
    personalInfo,
    setPersonalInfo,
    isTransporter,
    updateUserType,
    isSubmitting,
    setIsSubmitting,
    step,
    idCardFile,
    idCardImage,
    handleInputChange,
    handleIdCardCapture,
    handleIdCardRemove,
    nextStep,
    prevStep
  } = useIndividualRegistrationState({
    initialUserType: userTypeFromState,
  });

  // Check profile type and fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile data
      const profileData = await checkUserProfile(user.id);
      
      // If the user type isn't defined by navigation, use the one from the database
      if (!userTypeFromState) {
        updateUserType(profileData.userType === "individual_transporter");
      }
      
      // Pre-fill form with existing data
      setPersonalInfo(prev => ({
        ...prev,
        full_name: profileData.fullName || "",
        phone: profileData.phone || "",
        email: user.email || "",
        verification_status: profileData.verificationStatus
      }));
      
      // Fetch ID card image if it exists
      const idCardUrl = await fetchDocumentImage(user.id, 'id_card');
      if (idCardUrl) {
        handleIdCardCapture({ name: 'id_card.jpg' } as File, null);
        // Override the image URL that was created by handleIdCardCapture
        window.URL.revokeObjectURL(idCardImage!);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est authentifié avant de continuer
    if (!user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour terminer votre inscription.",
        variant: "destructive"
      });
      
      // Rediriger vers la page de connexion
      navigate("/login", { 
        state: { 
          returnUrl: location.pathname,
          userType: isTransporter ? "individual_transporter" : "individual_shipper"
        } 
      });
      return;
    }
    
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
      // Upload ID card if available
      if (idCardFile) {
        await uploadDocument(user.id, idCardFile, 'id_card');
      }
      
      // Update profile with personal info
      const result = await updateIndividualProfile(
        user.id, 
        personalInfo, 
        isTransporter
      );
      
      if (!result.success) throw result.error;
      
      toast({
        title: "Informations enregistrées",
        description: "Vos informations personnelles ont été enregistrées avec succès. Votre document sera vérifié par notre équipe.",
      });
      
      // Navigate to next step based on user type
      if (isTransporter) {
        navigate("/vehicle-type"); // Updated from /vehicle-selection to /vehicle-type
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

  return {
    personalInfo,
    isTransporter,
    isSubmitting,
    step,
    idCardImage,
    handleInputChange,
    handleIdCardCapture,
    handleRemoveIdCard: handleIdCardRemove,
    handleSubmit,
    nextStep,
    prevStep
  };
};
