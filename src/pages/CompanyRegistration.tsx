
import React from "react";
import { Building } from "lucide-react";
import CompanyInfoForm from "@/components/registration/CompanyInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useCompanyRegistration } from "@/hooks/useCompanyRegistration";

const CompanyRegistration = () => {
  const {
    companyInfo,
    isTransporter,
    isSubmitting,
    step,
    handleInputChange,
    handleSubmit,
    nextStep,
    prevStep
  } = useCompanyRegistration();

  return (
    <RegistrationLayout
      title="Enregistrement de votre entreprise"
      description="Informations sur votre société"
      currentStep={step}
      totalSteps={2}
      onNext={nextStep}
      onPrevious={prevStep}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      icon={Building}
      isLastStep={step === 2}
    >
      <CompanyInfoForm
        companyInfo={companyInfo}
        onInputChange={handleInputChange}
        step={step}
        isTransporter={isTransporter}
      />
    </RegistrationLayout>
  );
};

export default CompanyRegistration;
