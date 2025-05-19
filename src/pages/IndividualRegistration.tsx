
import React from "react";
import { User } from "lucide-react";
import PersonalInfoForm from "@/components/registration/PersonalInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useIndividualRegistration } from "@/hooks/useIndividualRegistration";
import { RegistrationStep } from "@/components/registration/RegistrationProgress";

const IndividualRegistration = () => {
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
      name: "Identité"
    },
    {
      id: 2,
      name: "Coordonnées"
    }
  ];

  return (
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
  );
};

export default IndividualRegistration;
