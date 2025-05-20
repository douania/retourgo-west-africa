
import { useState } from "react";
import { PersonalInfoFormData } from "@/components/registration/PersonalInfoForm";
import { VerificationStatus } from "@/types/supabase-extensions";

export interface UseIndividualRegistrationStateProps {
  initialUserType?: string;
  initialVerificationStatus?: VerificationStatus;
  initialFullName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export function useIndividualRegistrationState({
  initialUserType,
  initialVerificationStatus,
  initialFullName,
  initialEmail = "",
  initialPhone = ""
}: UseIndividualRegistrationStateProps = {}) {
  // State for determining if the user is a transporter or shipper
  const [isTransporter, setIsTransporter] = useState(
    initialUserType === "individual_transporter"
  );
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData>({
    full_name: initialFullName || "",
    id_number: "",
    address: "",
    phone: initialPhone,
    email: initialEmail,
    preferred_origin: "",
    verification_status: initialVerificationStatus
  });

  // Form processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  // Form field handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Document handlers
  const handleIdCardCapture = (file: File, extractedData?: any) => {
    console.log("ID card captured in useIndividualRegistrationState with data:", extractedData);
    const imageUrl = URL.createObjectURL(file);
    setIdCardImage(imageUrl);
    setIdCardFile(file);

    if (extractedData) {
      // Map extracted data to form fields, handling different formats
      const mappedData = {
        // Handle various possible field names from OCR services
        full_name: extractedData.full_name || extractedData.nom_complet || extractedData.nom || "",
        id_number: extractedData.id_number || extractedData.numero_identification || extractedData.numero_carte || "",
        address: extractedData.address || extractedData.adresse || "",
        birth_date: extractedData.birth_date || extractedData.date_naissance || "",
        nationality: extractedData.nationality || extractedData.nationalite || ""
      };

      console.log("Mapped OCR data:", mappedData);
      
      setPersonalInfo(prev => ({
        ...prev,
        full_name: mappedData.full_name || prev.full_name,
        id_number: mappedData.id_number || prev.id_number,
        address: mappedData.address || prev.address
        // We could also store birth_date and nationality in custom fields if needed
      }));
    }
  };

  const handleIdCardRemove = () => {
    setIdCardImage(null);
    setIdCardFile(null);
  };

  // Step navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Update user type (needed when we get data from the database)
  const updateUserType = (isTransporterValue: boolean) => {
    setIsTransporter(isTransporterValue);
  };

  return {
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
  };
}
