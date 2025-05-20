
import { supabase } from "@/integrations/supabase/client";
import { PriceEstimationResponse } from "./types";

export async function getPriceEstimation(
  origin: string, 
  destination: string, 
  weight: number, 
  vehicleType: string,
  volume?: number,
  specialRequirements?: string
): Promise<PriceEstimationResponse> {
  console.log("Calling price estimation");
  
  const { data, error } = await supabase.functions.invoke('price-estimation', {
    body: { origin, destination, weight, volume, vehicleType, specialRequirements }
  });
  
  if (error) {
    console.error("Price estimation error:", error);
    throw new Error(`Error getting price estimation: ${error.message}`);
  }
  
  return data as PriceEstimationResponse;
}
