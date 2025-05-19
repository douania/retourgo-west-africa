
import React from "react";
import { User } from "lucide-react";
import PersonalInfoForm from "@/components/registration/PersonalInfoForm";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useIndividualRegistration } from "@/hooks/useIndividualRegistration";

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

  return (
    <RegistrationLayout
      title="Complétez votre profil"
      description="Informations personnelles"
      currentStep={step}
      totalSteps={2}
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
