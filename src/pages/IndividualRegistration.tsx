
import React from "react";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "@/components/registration/PersonalInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useIndividualRegistration } from "@/hooks/useIndividualRegistration";
import { RegistrationStep } from "@/components/registration/RegistrationProgress";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

const IndividualRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
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
  } = useIndividualRegistration();

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
    navigate(-1); // Returns to the previous page
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
        title="Complétez votre profil"
        description="Informations personnelles"
        currentStep={step}
        totalSteps={2}
        steps={registrationSteps}
        onNext={nextStep}
        onPrevious={prevStep}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        icon={User}
        isLastStep={step === 2}
        nextButtonText={t("registration.next")}
        previousButtonText={t("registration.previous")}
        submitButtonText={isSubmitting ? t("registration.submitting") : t("registration.finish")}
      >
        <PersonalInfoForm
          personalInfo={personalInfo}
          onInputChange={handleInputChange}
          idCardImage={idCardImage}
          onIdCardCapture={handleIdCardCapture}
          onIdCardRemove={handleRemoveIdCard}
          step={step}
          isTransporter={isTransporter}
        />
      </RegistrationLayout>
    </div>
  );
};

export default IndividualRegistration;
