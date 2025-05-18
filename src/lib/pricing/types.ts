
// Types for the pricing system
export type VehicleType = 'car' | 'van' | 'truck' | 'semi' | 'refrigerated';
export type AdditionalFeeType = 'manual_loading' | 'fragile' | 'urgent';

export interface PricingOptions {
  distance: number;
  vehicleType: VehicleType;
  weight?: number;          // Weight in kg, optional
  additionalFees?: AdditionalFeeType[];
  emptyReturn?: boolean;
  emptyReturnDiscount?: number; // Between 0.25 and 0.50
}

export interface PricingBreakdown {
  total: number;
  breakdown: {
    baseFee: number;
    distanceFee: number;
    additionalFees: { type: string; amount: number }[];
    emptyReturnDiscount: number;
  };
}

export interface VehicleWeightCapacity {
  minWeight: number;
  maxWeight: number;
}
