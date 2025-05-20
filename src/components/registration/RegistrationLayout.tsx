
import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import RegistrationProgress, { RegistrationStep } from "./RegistrationProgress";
import { LucideIcon } from "lucide-react";

interface RegistrationLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  steps?: RegistrationStep[];
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  icon?: LucideIcon;
  isLastStep?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  submitButtonText?: string;
}

const RegistrationLayout = ({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  steps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false,
  icon: Icon,
  isLastStep = false,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  submitButtonText = "Finish Registration"
}: RegistrationLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-6 w-6 text-retourgo-orange" />}
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>
              {description || "Personal information"}
            </CardDescription>
            
            <RegistrationProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps}
              steps={steps}
            />
          </CardHeader>
          
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              {children}
            </CardContent>
            
            <CardFooter className={`${currentStep > 1 ? "justify-between" : "justify-end"}`}>
              {currentStep > 1 && onPrevious && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onPrevious}
                >
                  {previousButtonText}
                </Button>
              )}
              
              {!isLastStep ? (
                <Button 
                  type="button" 
                  className="bg-retourgo-orange hover:bg-retourgo-orange/90"
                  onClick={onNext}
                >
                  {nextButtonText}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-retourgo-orange hover:bg-retourgo-orange/90"
                  disabled={isSubmitting}
                >
                  {submitButtonText}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default RegistrationLayout;
