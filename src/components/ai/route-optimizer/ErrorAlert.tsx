
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/useTranslation";

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  const { t } = useTranslation();
  
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertTitle>{t("ai.error_title")}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
