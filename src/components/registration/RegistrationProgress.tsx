
import React from "react";
import { Check, CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RegistrationStep {
  id: number;
  name: string;
}

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: RegistrationStep[];
}

const RegistrationProgress = ({ 
  currentStep, 
  totalSteps,
  steps 
}: RegistrationProgressProps) => {
  // If steps aren't provided, generate generic step names
  const displaySteps = steps || Array.from({ length: totalSteps }, (_, i) => ({
    id: i + 1,
    name: `Étape ${i + 1}`
  }));

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Étape {currentStep}/{totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-retourgo-orange h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        {displaySteps.map((step) => (
          <div 
            key={step.id} 
            className={cn(
              "flex flex-col items-center relative",
              { "flex-1": displaySteps.length > 1 }
            )}
          >
            {/* Step connector line */}
            {step.id < displaySteps.length && (
              <div className={cn(
                "absolute top-4 w-full h-0.5 left-1/2",
                currentStep > step.id ? "bg-retourgo-orange" : "bg-gray-200"
              )} />
            )}
            
            {/* Step indicator */}
            <div className={cn(
              "z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
              currentStep === step.id 
                ? "border-retourgo-orange bg-white text-retourgo-orange" 
                : currentStep > step.id 
                  ? "border-retourgo-orange bg-retourgo-orange text-white" 
                  : "border-gray-200 bg-white text-gray-400"
            )}>
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : currentStep === step.id ? (
                <CircleDot className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>
            
            {/* Step name */}
            <span className={cn(
              "mt-2 text-xs font-medium text-center",
              currentStep === step.id 
                ? "text-retourgo-orange" 
                : currentStep > step.id 
                  ? "text-gray-700" 
                  : "text-gray-400"
            )}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationProgress;
