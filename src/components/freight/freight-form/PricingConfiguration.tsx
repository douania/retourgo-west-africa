
import React from "react";
import { VehicleType, AdditionalFeeType } from "@/lib/pricing";
import PricingOptions from "../PricingOptions";
import PriceEstimation from "../PriceEstimation";

interface PricingConfigurationProps {
  vehicleType: VehicleType;
  additionalFees: AdditionalFeeType[];
  emptyReturn: boolean;
  distance: number;
  origin: string;
  destination: string;
  priceEstimation: {
    total: number;
    breakdown: {
      baseFee: number;
      distanceFee: number;
      additionalFees: { type: string; amount: number }[];
      emptyReturnDiscount: number;
    }
  };
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
  priceEstimation,
  onVehicleTypeChange,
  onAdditionalFeesChange,
  onEmptyReturnChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <PricingOptions
        vehicleType={vehicleType}
        additionalFees={additionalFees}
        emptyReturn={emptyReturn}
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
          additionalFees={priceEstimation.breakdown.additionalFees}
          emptyReturnDiscount={priceEstimation.breakdown.emptyReturnDiscount}
          total={priceEstimation.total}
        />
      )}
    </div>
  );
};

export default PricingConfiguration;
