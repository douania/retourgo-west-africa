
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
