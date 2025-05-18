
import React from "react";
import { VehicleType, AdditionalFeeType } from "@/lib/pricing";
import PricingOptions from "../PricingOptions";
import PriceEstimation from "../PriceEstimation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PricingConfigurationProps {
  vehicleType: VehicleType;
  additionalFees: AdditionalFeeType[];
  emptyReturn: boolean;
  distance: number;
  origin: string;
  destination: string;
  weight: number;
  priceEstimation: {
    total: number;
    breakdown: {
      baseFee: number;
      distanceFee: number;
      additionalFees: { type: string; amount: number }[];
      emptyReturnDiscount: number;
    }
  };
  pricingError: string | null;
  onVehicleTypeChange: (value: VehicleType) => void;
  onAdditionalFeesChange: (value: AdditionalFeeType[]) => void;
  onEmptyReturnChange: (value: boolean) => void;
}

export const PricingConfiguration: React.FC<PricingConfigurationProps> = ({
  vehicleType,
  additionalFees,
  emptyReturn,
  distance,
  origin,
  destination,
  weight,
  priceEstimation,
  pricingError,
  onVehicleTypeChange,
  onAdditionalFeesChange,
  onEmptyReturnChange
}) => {
  return (
    <div className="space-y-4">
      {pricingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de tarification</AlertTitle>
          <AlertDescription>{pricingError}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PricingOptions
          vehicleType={vehicleType}
          additionalFees={additionalFees}
          emptyReturn={emptyReturn}
          weight={weight}
          onVehicleTypeChange={onVehicleTypeChange}
          onAdditionalFeesChange={onAdditionalFeesChange}
          onEmptyReturnChange={onEmptyReturnChange}
        />
        
        {origin && destination && (
          <PriceEstimation
            baseFee={priceEstimation.breakdown.baseFee}
            distanceFee={priceEstimation.breakdown.distanceFee}
            distance={distance}
            origin={origin}
            destination={destination}
            vehicleType={vehicleType}
            weight={weight}
            additionalFees={priceEstimation.breakdown.additionalFees}
            emptyReturnDiscount={priceEstimation.breakdown.emptyReturnDiscount}
            total={priceEstimation.total}
          />
        )}
      </div>
    </div>
  );
};

export default PricingConfiguration;
