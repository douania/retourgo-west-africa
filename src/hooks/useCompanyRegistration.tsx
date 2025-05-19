
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyRegistrationState } from "@/hooks/useCompanyRegistrationState";
import { fetchDocumentImage, useDocumentUploader } from "@/services/DocumentService";
import { checkUserProfile, updateCompanyProfile } from "@/services/CompanyRegistrationService";

export const useCompanyRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { uploadDocument } = useDocumentUploader();
  
  // Get user type from navigation state
  const userTypeFromState = (location.state as { userType?: string })?.userType;
  
  const {
    companyInfo,
    setCompanyInfo,
    isTransporter,
    updateUserType,
    isSubmitting,
    setIsSubmitting,
    step,
    businessDocFile,
    businessDocImage,
    handleInputChange,
    handleDocumentCapture,
    handleDocumentRemove,
    nextStep,
    prevStep
  } = useCompanyRegistrationState({
    initialUserType: userTypeFromState
  });

  // Check profile type on component mount
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        // Get profile data from database
        const profileData = await checkUserProfile(user.id);
        
        // If user type is not defined by navigation, use from database
        if (!userTypeFromState && profileData.userType) {
          updateUserType(profileData.userType === "company_transporter");
        }
        
        // Pre-fill company name if available
        if (profileData.companyName || profileData.verificationStatus) {
          setCompanyInfo(prev => ({
            ...prev,
            company_name: profileData.companyName || prev.company_name,
            verification_status: profileData.verificationStatus
          }));
        }
        
        // Fetch the business document image if it exists
        const docImageUrl = await fetchDocumentImage(user.id, 'business_registration');
        if (docImageUrl) {
          handleDocumentCapture(
            // This is a temporary file object just to maintain the state structure
            // The actual file isn't needed since we have the image URL
            new File([], "existing-document.png", { type: "image/png" })
          );
          // Override the image URL from the blob with the fetched URL
          document.getElementById('business-doc-preview')?.setAttribute('src', docImageUrl);
        }
      };
      
      loadUserProfile();
    }
  }, [user, userTypeFromState]);

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
        // Upload business document if available
        if (businessDocFile) {
          await uploadDocument(user.id, businessDocFile, 'business_registration');
        }
        
        const result = await updateCompanyProfile(user.id, {
          ...companyInfo,
          isTransporter
        });
        
        if (!result.success) throw result.error;
      }
      
      toast({
        title: "Informations enregistrées",
        description: "Les informations de votre entreprise ont été enregistrées avec succès. Votre document sera vérifié par notre équipe.",
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

  return {
    companyInfo,
    isTransporter,
    isSubmitting,
    step,
    businessDocImage,
    handleInputChange,
    handleDocumentCapture,
    handleDocumentRemove,
    handleSubmit,
    nextStep,
    prevStep
  };
};
