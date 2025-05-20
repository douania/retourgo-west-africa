
import React from "react";
import { Building, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CompanyInfoForm from "@/components/registration/CompanyInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useCompanyRegistration } from "@/hooks/useCompanyRegistration";
import { RegistrationStep } from "@/components/registration/RegistrationProgress";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

const CompanyRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleGoBack = () => {
    navigate(-1); // Retourne à la page précédente
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 z-10 flex items-center" 
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("registration.go_back")}
      </Button>

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
    </div>
  );
};

export default CompanyRegistration;
