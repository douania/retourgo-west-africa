
import { 
  VEHICLE_TYPE_LABELS, 
  ADDITIONAL_FEE_LABELS, 
  VEHICLE_WEIGHT_CAPACITIES 
} from './constants';
import { VehicleType, AdditionalFeeType, VehicleWeightCapacity } from './types';

// Utility function to format prices in FCFA
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-SN').format(price) + ' FCFA';
}

// Get vehicle type labels
export function getVehicleTypeLabel(type: VehicleType): string {
  return VEHICLE_TYPE_LABELS[type] || type;
}

// Get additional fee labels
export function getAdditionalFeeLabel(type: AdditionalFeeType): string {
  return ADDITIONAL_FEE_LABELS[type] || type;
}

// Get vehicle weight capacity
export function getVehicleWeightCapacity(vehicleType: VehicleType): VehicleWeightCapacity {
  return VEHICLE_WEIGHT_CAPACITIES[vehicleType];
}

// Function to get price per kg-km based on distance and weight
export function calculatePricePerKgKm(distance: number, weight: number): number {
  if (distance <= 0 || weight <= 0) return 0;
  
  // The longer the distance, the lower the price per kg-km (economies of scale)
  let scaleFactor = 1.0;
  
  if (distance > 800) scaleFactor = 0.7;
  else if (distance > 500) scaleFactor = 0.75;
  else if (distance > 300) scaleFactor = 0.8;
  else if (distance > 200) scaleFactor = 0.85;
  else if (distance > 100) scaleFactor = 0.9;
  
  // The heavier the load, the lower the price per kg-km (economies of scale)
  if (weight > 25000) scaleFactor *= 0.7;
  else if (weight > 15000) scaleFactor *= 0.8;
  else if (weight > 5000) scaleFactor *= 0.9;
  
  // Base price per kg-km in FCFA
  const basePricePerKgKm = 0.15;
  
  return basePricePerKgKm * scaleFactor;
}
