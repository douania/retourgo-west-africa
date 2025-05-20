
import React from "react";
import { Building } from "lucide-react";
import CompanyInfoForm from "@/components/registration/CompanyInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useCompanyRegistration } from "@/hooks/useCompanyRegistration";
import { RegistrationStep } from "@/components/registration/RegistrationProgress";
import { useTranslation } from "@/hooks/useTranslation";

const CompanyRegistration = () => {
  const { t } = useTranslation();
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
      name: t("registration.step") + " 1"
    },
    {
      id: 2,
      name: t("registration.step") + " 2"
    }
  ];

  return (
    <RegistrationLayout
      title={t("registration.company")}
      description={t("registration.company.description")}
      currentStep={step}
      totalSteps={2}
      steps={registrationSteps}
      onNext={nextStep}
      onPrevious={prevStep}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      icon={Building}
      isLastStep={step === 2}
      nextButtonText={t("registration.next")}
      previousButtonText={t("registration.previous")}
      submitButtonText={isSubmitting ? t("registration.submitting") : t("registration.finish")}
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
