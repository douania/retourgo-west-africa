
import { useState, useEffect } from "react";
import { 
  VehicleType, 
  AdditionalFeeType, 
  calculatePrice, 
  estimateDistance 
} from "@/lib/pricing";

interface UsePricingCalculationProps {
  origin: string;
  destination: string;
  weight: number;
  setValue: (name: string, value: number) => void;
}

export const usePricingCalculation = ({ origin, destination, weight, setValue }: UsePricingCalculationProps) => {
  // Pour les charges lourdes, sélectionner un véhicule plus approprié par défaut
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
  
  // Recalculer le prix lorsque les paramètres changent
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
        
        // Mettre à jour le champ de prix dans le formulaire
        setValue("price", pricing.total);
      } catch (error: any) {
        // Capturer l'erreur si le véhicule ne peut pas transporter ce poids
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
  
  // Mise à jour du véhicule par défaut lorsque le poids change
  useEffect(() => {
    if (weight > 0) {
      const recommendedVehicle = getDefaultVehicleType(weight);
      setVehicleType(prev => {
        // Ne changer automatiquement que si l'utilisateur n'a pas déjà fait une sélection manuelle
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
