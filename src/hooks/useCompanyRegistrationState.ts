
import { useState } from "react";
import { CompanyInfoFormData } from "@/components/registration/CompanyInfoForm";
import { VerificationStatus } from "@/types/supabase-extensions";

export interface UseCompanyRegistrationStateProps {
  initialUserType?: string;
  initialVerificationStatus?: VerificationStatus;
  initialCompanyName?: string;
}

export function useCompanyRegistrationState({
  initialUserType,
  initialVerificationStatus,
  initialCompanyName
}: UseCompanyRegistrationStateProps = {}) {
  // State for determining if the user is a transporter or shipper
  const [isTransporter, setIsTransporter] = useState(
    initialUserType === "company_transporter"
  );
  
  // Company information state
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoFormData>({
    company_name: initialCompanyName || "",
    ninea: "",
    rc: "",
    address: "",
    logistics_contact_name: "",
    logistics_contact_phone: "",
    transport_license: "",
    recurrent_locations: "",
    verification_status: initialVerificationStatus,
    isTransporter // Add this to the state to use in the update function
  });

  // Form processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [businessDocFile, setBusinessDocFile] = useState<File | null>(null);
  const [businessDocImage, setBusinessDocImage] = useState<string | null>(null);

  // Form field handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Document handlers
  const handleDocumentCapture = (file: File, extractedData?: any) => {
    const imageUrl = URL.createObjectURL(file);
    setBusinessDocImage(imageUrl);
    setBusinessDocFile(file);

    if (extractedData) {
      // Pre-fill form if data is extracted automatically
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

  // Step navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Update user type (needed when we get data from the database)
  const updateUserType = (isTransporterValue: boolean) => {
    setIsTransporter(isTransporterValue);
    setCompanyInfo(prev => ({
      ...prev,
      isTransporter: isTransporterValue
    }));
  };

  return {
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
  };
}
