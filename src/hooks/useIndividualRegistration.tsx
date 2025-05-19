
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
    preferred_origin: "",
    verification_status: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

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
        .select('user_type, first_name, last_name, phone, verification_status')
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
          email: user.email || "",
          verification_status: data.verification_status || null
        }));
        
        // Récupérer l'image d'identité si elle existe
        fetchIdCardImage(user.id);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const fetchIdCardImage = async (userId: string) => {
    try {
      const { data: documentData, error: documentError } = await supabase
        .from('user_documents')
        .select('document_url')
        .eq('user_id', userId)
        .eq('document_type', 'id_card')
        .single();
        
      if (documentError && documentError.code !== 'PGRST116') {
        // PGRST116 signifie qu'aucun document n'a été trouvé, ce n'est pas une erreur
        console.error("Error fetching document:", documentError);
        return;
      }
      
      if (documentData?.document_url) {
        // Récupérer l'URL signée pour afficher l'image
        const { data: storageData } = await supabase.storage
          .from('user_documents')
          .createSignedUrl(documentData.document_url, 3600);
          
        if (storageData?.signedUrl) {
          setIdCardImage(storageData.signedUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching ID card image:", error);
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
    setIdCardFile(file);

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
    setIdCardFile(null);
  };
  
  const uploadIdCard = async (userId: string, file: File): Promise<string | null> => {
    if (!file) return null;
    
    try {
      // Créer un nom de fichier unique avec l'extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/id_card_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload du fichier vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Enregistrer la référence du document dans la base de données
      const { error: docError } = await supabase
        .from('user_documents')
        .upsert({
          user_id: userId,
          document_type: 'id_card',
          document_url: filePath,
          uploaded_at: new Date().toISOString(),
          verification_status: 'pending'
        }, {
          onConflict: 'user_id, document_type'
        });
        
      if (docError) throw docError;
      
      // Mettre à jour le statut de vérification du profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verification_status: 'pending' })
        .eq('id', userId);
        
      if (profileError) throw profileError;
      
      return filePath;
    } catch (error) {
      console.error("Error uploading ID card:", error);
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
        // Upload ID card if available
        if (idCardFile) {
          await uploadIdCard(user.id, idCardFile);
        }
        
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
        description: "Vos informations personnelles ont été enregistrées avec succès. Votre document sera vérifié par notre équipe.",
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
