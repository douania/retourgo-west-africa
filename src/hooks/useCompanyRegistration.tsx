
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
    recurrent_locations: "",
    verification_status: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [businessDocFile, setBusinessDocFile] = useState<File | null>(null);
  const [businessDocImage, setBusinessDocImage] = useState<string | null>(null);

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
        .select('user_type, first_name, verification_status')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const userType = data.user_type;
        // If user type is not defined by navigation, use the one from database
        if (!userTypeFromState) {
          setIsTransporter(userType === "company_transporter");
        }
        
        // Pre-fill company name if available
        if (data.first_name) {
          setCompanyInfo(prev => ({
            ...prev,
            company_name: data.first_name,
            verification_status: data.verification_status
          }));
        }
        
        // Récupérer l'image du document d'entreprise si elle existe
        fetchBusinessDocImage(user.id);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const fetchBusinessDocImage = async (userId: string) => {
    try {
      const { data: documentData, error: documentError } = await supabase
        .from('user_documents')
        .select('document_url')
        .eq('user_id', userId)
        .eq('document_type', 'business_registration')
        .single();
        
      if (documentError && documentError.code !== 'PGRST116') {
        console.error("Error fetching document:", documentError);
        return;
      }
      
      if (documentData?.document_url) {
        // Récupérer l'URL signée pour afficher l'image
        const { data: storageData } = await supabase.storage
          .from('user_documents')
          .createSignedUrl(documentData.document_url, 3600);
          
        if (storageData?.signedUrl) {
          setBusinessDocImage(storageData.signedUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching business document image:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDocumentCapture = (file: File, extractedData?: any) => {
    const imageUrl = URL.createObjectURL(file);
    setBusinessDocImage(imageUrl);
    setBusinessDocFile(file);

    if (extractedData) {
      // Si des données sont extraites automatiquement, pré-remplir le formulaire
      setCompanyInfo(prev => ({
        ...prev,
        company_name: extractedData.company_name || prev.company_name,
        ninea: extractedData.ninea || prev.ninea,
        rc: extractedData.rc || prev.rc
      }));
    }
  };

  const handleDocumentRemove = () => {
    setBusinessDocImage(null);
    setBusinessDocFile(null);
  };
  
  const uploadBusinessDoc = async (userId: string, file: File): Promise<string | null> => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/business_doc_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { error: docError } = await supabase
        .from('user_documents')
        .upsert({
          user_id: userId,
          document_type: 'business_registration',
          document_url: filePath,
          uploaded_at: new Date().toISOString(),
          verification_status: 'pending'
        }, {
          onConflict: 'user_id, document_type'
        });
        
      if (docError) throw docError;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verification_status: 'pending' })
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      return filePath;
    } catch (error) {
      console.error("Error uploading business document:", error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'envoi de votre document.",
        variant: "destructive"
      });
      return null;
    }
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
        // Upload business document if available
        if (businessDocFile) {
          await uploadBusinessDoc(user.id, businessDocFile);
        }
        
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
    businessDocImage,
    handleInputChange,
    handleDocumentCapture,
    handleDocumentRemove,
    handleSubmit,
    nextStep,
    prevStep
  };
};
