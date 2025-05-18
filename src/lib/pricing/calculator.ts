
import { VehicleType, AdditionalFeeType, PricingOptions, PricingBreakdown } from './types';
import { 
  BASE_FEE, 
  COST_PER_KM, 
  ADDITIONAL_FEES, 
  EMPTY_RETURN_DISCOUNT, 
  WEIGHT_THRESHOLDS, 
  LONG_DISTANCE_FACTORS 
} from './constants';
import { getVehicleTypeLabel } from './utils';

// Function to calculate the estimated price
export function calculatePrice(options: PricingOptions): PricingBreakdown {
  const { 
    distance, 
    vehicleType, 
    weight = 0, 
    additionalFees = [], 
    emptyReturn = false, 
    emptyReturnDiscount 
  } = options;
  
  // Determine pricing category based on weight
  let weightCategory: 'base' | 'medium' | 'heavy' = 'base';
  if (weight >= WEIGHT_THRESHOLDS.HEAVY) {
    weightCategory = 'heavy';
  } else if (weight >= WEIGHT_THRESHOLDS.MEDIUM) {
    weightCategory = 'medium';
  }
  
  // Check if the vehicle can carry this weight
  const ratePerKm = COST_PER_KM[vehicleType][weightCategory];
  if (ratePerKm === 0) {
    // If rate is 0, it means this vehicle cannot carry this weight category
    throw new Error(`This vehicle type (${getVehicleTypeLabel(vehicleType)}) cannot carry ${weight}kg`);
  }
  
  // Calculate base price
  const baseFee = BASE_FEE;
  
  // Apply special multiplier for certain destinations
  let distanceFactor = LONG_DISTANCE_FACTORS.DEFAULT_FACTOR;
  
  // Check if destination is Ziguinchor (add special multiplier)
  if (distance > 800) {
    distanceFactor = LONG_DISTANCE_FACTORS.ZIGUINCHOR_FACTOR;
  } else if (distance > 400) {
    distanceFactor = LONG_DISTANCE_FACTORS.TAMBACOUNDA_FACTOR;
  }
  
  // Calculate kilometer price
  const distanceFee = distance * ratePerKm * distanceFactor;
  
  // Calculate additional fees
  let totalAdditionalFees = 0;
  const additionalFeesBreakdown: { type: string; amount: number }[] = [];
  
  additionalFees.forEach(feeType => {
    const fee = ADDITIONAL_FEES[feeType];
    let feeAmount = 0;
    
    if (typeof fee === 'number') {
      feeAmount = fee;
    } else if (typeof fee === 'string' && fee.endsWith('%')) {
      // Calculate percentage of subtotal (base + distance)
      const percentage = parseFloat(fee.replace('%', '')) / 100;
      feeAmount = (baseFee + distanceFee) * percentage;
    }
    
    totalAdditionalFees += feeAmount;
    additionalFeesBreakdown.push({ type: feeType, amount: feeAmount });
  });
  
  // Subtotal before discount
  const subtotal = baseFee + distanceFee + totalAdditionalFees;
  
  // Calculate discount for empty return
  let discount = 0;
  if (emptyReturn) {
    // If specific percentage is provided, use it, otherwise use default value
    // Modification: Augmentation de la réduction entre 30% et 50% (plus agressive)
    const minDiscount = 0.30; // 30%
    const maxDiscount = 0.50; // 50%
    
    const discountRate = emptyReturnDiscount !== undefined 
      ? Math.max(minDiscount, Math.min(maxDiscount, emptyReturnDiscount))
      : minDiscount;
    
    discount = subtotal * discountRate;
  }
  
  // Calculate total
  const total = Math.round(subtotal - discount);
  
  return {
    total,
    breakdown: {
      baseFee,
      distanceFee,
      additionalFees: additionalFeesBreakdown,
      emptyReturnDiscount: discount
    }
  };
}
