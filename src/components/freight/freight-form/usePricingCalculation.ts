import { useState, useEffect } from "react";
import { 
  VehicleType, 
  AdditionalFeeType, 
  calculatePrice, 
  estimateDistance,
  getVehicleWeightCapacity
} from "@/lib/pricing";

interface UsePricingCalculationProps {
  origin: string;
  destination: string;
  weight: number;
  setValue: (name: string, value: number) => void;
}

export const usePricingCalculation = ({ origin, destination, weight, setValue }: UsePricingCalculationProps) => {
  // For heavy loads, select a more appropriate vehicle by default
  const getDefaultVehicleType = (weight: number): VehicleType => {
    if (weight > 22000) return 'semi';
    if (weight > 5000) return 'truck';
    if (weight > 1000) return 'van';
    return 'car';
  };

  const [vehicleType, setVehicleType] = useState<VehicleType>(() => getDefaultVehicleType(weight));
  const [additionalFees, setAdditionalFees] = useState<AdditionalFeeType[]>([]);
  const [emptyReturn, setEmptyReturn] = useState(false);
  const [priceEstimation, setPriceEstimation] = useState({
    total: 0,
    breakdown: {
      baseFee: 0,
      distanceFee: 0,
      additionalFees: [] as { type: string; amount: number }[],
      emptyReturnDiscount: 0
    }
  });
  const [distance, setDistance] = useState(0);
  const [pricingError, setPricingError] = useState<string | null>(null);
  
  // Recalculate price when parameters change
  useEffect(() => {
    if (origin && destination) {
      const calculatedDistance = estimateDistance(origin, destination);
      setDistance(calculatedDistance);
      
      try {
        setPricingError(null);
        const pricing = calculatePrice({
          distance: calculatedDistance,
          vehicleType,
          weight: Number(weight) || 0,
          additionalFees,
          emptyReturn
        });
        
        setPriceEstimation(pricing);
        
        // Update price field in the form
        setValue("price", pricing.total);
      } catch (error: any) {
        // Capture error if vehicle cannot carry this weight
        setPricingError(error.message);
        setPriceEstimation({
          total: 0,
          breakdown: {
            baseFee: 0,
            distanceFee: 0,
            additionalFees: [],
            emptyReturnDiscount: 0
          }
        });
        setValue("price", 0);
      }
    }
  }, [origin, destination, vehicleType, additionalFees, emptyReturn, weight, setValue]);
  
  // Update default vehicle when weight changes
  useEffect(() => {
    if (weight > 0) {
      const recommendedVehicle = getDefaultVehicleType(weight);
      setVehicleType(prev => {
        // Only change automatically if user hasn't already made a manual selection
        if (prev === 'car' && recommendedVehicle !== 'car') {
          return recommendedVehicle;
        }
        return prev;
      });
    }
  }, [weight]);

  return {
    vehicleType,
    additionalFees,
    emptyReturn,
    priceEstimation,
    distance,
    pricingError,
    setVehicleType,
    setAdditionalFees,
    setEmptyReturn
  };
};

export default usePricingCalculation;
