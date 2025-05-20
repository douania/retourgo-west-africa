
import { supabase } from "@/integrations/supabase/client";
import { RouteOptimizationResponse } from "./types";

export async function getRouteOptimization(
  origin: string, 
  destination: string, 
  userId: string
): Promise<RouteOptimizationResponse> {
  console.log("Calling route optimization with userId:", userId);
  
  const { data, error } = await supabase.functions.invoke('route-optimization', {
    body: { origin, destination, userId }
  });
  
  if (error) {
    console.error("Route optimization error:", error);
    throw new Error(`Error getting route optimization: ${error.message}`);
  }
  
  return data as RouteOptimizationResponse;
}
