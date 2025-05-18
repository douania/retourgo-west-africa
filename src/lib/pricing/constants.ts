
import { VehicleType, AdditionalFeeType } from './types';

// Base pricing configuration
export const BASE_FEE = 15000; // FCFA - Increased base fee

// Adjusted rates per km based on weight and vehicle type
// Based on real Senegalese market data for containers
export const COST_PER_KM: Record<VehicleType, { 
  base: number,           // For light weights < 5 tons
  medium: number,         // For medium weights 5-22 tons
  heavy: number           // For heavy weights > 22 tons
}> = {
  car: { base: 250, medium: 0, heavy: 0 },              // Car: only for small packages
  van: { base: 350, medium: 450, heavy: 0 },            // Van: up to about 3.5t
  truck: { base: 500, medium: 800, heavy: 1200 },       // Truck: for medium and heavy loads
  semi: { base: 0, medium: 1000, heavy: 1500 },         // Semi-trailer: only for heavy loads
  refrigerated: { base: 700, medium: 1200, heavy: 1800 } // Refrigerated: premium price
};

export const ADDITIONAL_FEES: Record<AdditionalFeeType, number | string> = {
  manual_loading: 25000,   // Increased cost for manual loading
  fragile: '15%',          // Increased percentage for fragile cargo
  urgent: '25%'            // Increased percentage for urgency
};

export const EMPTY_RETURN_DISCOUNT = {
  min: 0.15, // 15%
  max: 0.30  // 30%
};

// Weight thresholds to determine pricing category
export const WEIGHT_THRESHOLDS = {
  MEDIUM: 5000, // 5 tons
  HEAVY: 22000  // 22 tons (based on provided rate chart)
};

// Adjustment factor for long distances
export const LONG_DISTANCE_FACTORS = {
  ZIGUINCHOR_FACTOR: 1.2,  // Special factor for Ziguinchor (difficult roads)
  TAMBACOUNDA_FACTOR: 1.1, // Factor for Tambacounda
  DEFAULT_FACTOR: 1.0      // Default factor
};

// Vehicle labels mapping
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Voiture',
  van: 'Camionnette',
  truck: 'Camion plateau ou benne',
  semi: 'Semi-remorque / gros porteur',
  refrigerated: 'Réfrigéré'
};

// Additional fee labels mapping
export const ADDITIONAL_FEE_LABELS: Record<AdditionalFeeType, string> = {
  manual_loading: 'Chargement manuel',
  fragile: 'Cargaison fragile',
  urgent: 'Cargaison urgente (livrée le jour-même)'
};

// Vehicle weight capacity mapping
export const VEHICLE_WEIGHT_CAPACITIES: Record<VehicleType, {minWeight: number; maxWeight: number}> = {
  car: { minWeight: 0, maxWeight: 500 },          // Up to 500kg
  van: { minWeight: 0, maxWeight: 3500 },         // Up to 3.5 tons
  truck: { minWeight: 0, maxWeight: 30000 },      // Up to 30 tons
  semi: { minWeight: 5000, maxWeight: 40000 },    // From 5 to 40 tons
  refrigerated: { minWeight: 0, maxWeight: 25000 } // Up to 25 tons
};
