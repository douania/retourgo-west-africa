
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Map } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { RouteOptimizationFormData } from "./types";

interface RouteFormProps {
  origin: string;
  destination: string;
  loading: boolean;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSubmit: () => void;
}

const RouteForm: React.FC<RouteFormProps> = ({
  origin,
  destination,
  loading,
  onOriginChange,
  onDestinationChange,
  onSubmit
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="origin">{t("ai.origin")}</Label>
          <Input
            id="origin"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            placeholder={t("ai.origin_placeholder")}
          />
        </div>
        <div>
          <Label htmlFor="destination">{t("ai.destination")}</Label>
          <Input
            id="destination"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            placeholder={t("ai.destination_placeholder")}
          />
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        disabled={!origin.trim() || !destination.trim() || loading}
        className="w-full"
      >
        {loading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Map className="mr-2 h-4 w-4" />
        )}
        {t("ai.optimize_route")}
      </Button>
    </div>
  );
};

export default RouteForm;
