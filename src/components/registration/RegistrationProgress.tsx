
import React from "react";

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const RegistrationProgress = ({ currentStep, totalSteps }: RegistrationProgressProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Étape {currentStep}/{totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-retourgo-orange h-2.5 rounded-full" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
