
import { useToast } from "@/hooks/use-toast";
import { getAssistantResponse } from "./assistantService";
import { getRouteOptimization } from "./routeService";
import { getPriceEstimation } from "./priceService";
import { analyzeDocument } from "./documentService";
import { getDemandPrediction } from "./demandService";

export function useAIServices() {
  const { toast } = useToast();
  
  const handleError = (error: any, message: string) => {
    console.error(error);
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive"
    });
    throw error;
  };
  
  return {
    getAssistantResponse: async (messages: { role: string; content: string }[], userId: string) => {
      try {
        return await getAssistantResponse(messages, userId);
      } catch (error) {
        return handleError(error, "Impossible d'obtenir une réponse de l'assistant");
      }
    },
    
    getRouteOptimization: async (origin: string, destination: string, userId: string) => {
      try {
        return await getRouteOptimization(origin, destination, userId);
      } catch (error) {
        return handleError(error, "Impossible d'optimiser l'itinéraire");
      }
    },
    
    getPriceEstimation: async (
      origin: string, 
      destination: string, 
      weight: number, 
      vehicleType: string,
      volume?: number,
      specialRequirements?: string
    ) => {
      try {
        return await getPriceEstimation(origin, destination, weight, vehicleType, volume, specialRequirements);
      } catch (error) {
        return handleError(error, "Impossible d'estimer le prix");
      }
    },
    
    analyzeDocument: async (documentBase64: string, documentType: string, userId: string) => {
      try {
        console.log("useAIServices.analyzeDocument called with:", {
          documentType,
          userId,
          documentBase64Length: documentBase64.length
        });
        
        // For demo purposes, allow document analysis without authentication
        if (!userId || userId === "demo-user") {
          console.log("Using demo mode for document analysis");
          // We'll still make the API call but with a demo tag
          userId = "demo-user";
        }
        
        return await analyzeDocument(documentBase64, documentType, userId);
      } catch (error) {
        console.error("Error in analyzeDocument:", error);
        return handleError(error, "Impossible d'analyser le document");
      }
    },
    
    getDemandPrediction: async (region: string, timeframe: string, transportType?: string) => {
      try {
        return await getDemandPrediction(region, timeframe, transportType);
      } catch (error) {
        return handleError(error, "Impossible d'obtenir une prédiction de demande");
      }
    }
  };
}
