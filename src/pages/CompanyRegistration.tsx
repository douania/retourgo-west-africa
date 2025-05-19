
import React from "react";
import { Building } from "lucide-react";
import CompanyInfoForm from "@/components/registration/CompanyInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useCompanyRegistration } from "@/hooks/useCompanyRegistration";
import { RegistrationStep } from "@/components/registration/RegistrationProgress";

const CompanyRegistration = () => {
  const {
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
  } = useCompanyRegistration();

  const registrationSteps: RegistrationStep[] = [
    {
      id: 1,
      name: "Entreprise"
    },
    {
      id: 2,
      name: "Contact"
    }
  ];

  return (
    <RegistrationLayout
      title="Enregistrement de votre entreprise"
      description="Informations sur votre société"
      currentStep={step}
      totalSteps={2}
      steps={registrationSteps}
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
        businessDocImage={businessDocImage}
        onDocumentCapture={handleDocumentCapture}
        onDocumentRemove={handleDocumentRemove}
      />
    </RegistrationLayout>
  );
};

export default CompanyRegistration;
