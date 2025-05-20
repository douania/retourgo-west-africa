
import { supabase } from "@/integrations/supabase/client";
import { DemandPredictionResponse } from "./types";

export async function getDemandPrediction(
  region: string, 
  timeframe: string, 
  transportType?: string
): Promise<DemandPredictionResponse> {
  console.log("Calling demand prediction");
  
  const { data, error } = await supabase.functions.invoke('demand-prediction', {
    body: { region, timeframe, transportType }
  });
  
  if (error) {
    console.error("Demand prediction error:", error);
    throw new Error(`Error getting demand prediction: ${error.message}`);
  }
  
  return data as DemandPredictionResponse;
}
