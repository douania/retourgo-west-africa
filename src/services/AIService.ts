
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types pour les réponses des API
export interface AIAssistantResponse {
  response: {
    content: string;
    role: string;
  };
}

export interface RouteOptimizationResponse {
  route: {
    distance: number;
    duration: number;
    route: string[];
    restPoints: string[];
    avoidAreas: string[];
    checkpoints: string[];
    summary: string;
  };
  origin: string;
  destination: string;
  distance: number;
  duration: number;
}

export interface PriceEstimationResponse {
  priceEstimation: {
    estimatedPrice: number;
    priceRange: { min: number; max: number };
    distance: number;
    factors: {
      fuel: number;
      operationalCosts: number;
      roadConditions: string;
      seasonalFactor: number;
    };
    explanation: string;
  };
  origin: string;
  destination: string;
  weight: number;
  volume: number | null;
  vehicleType: string;
}

export interface DocumentRecognitionResponse {
  extractedData: Record<string, any>;
  documentType: string;
  confidenceScore: number;
  source?: string; // Adding the optional source property to fix the type error
}

export interface DemandPredictionResponse {
  prediction: {
    region: string;
    timeframe: string;
    predictedDemand: number;
    confidenceScore: number;
    factors: {
      seasonal: { impact: number; explanation: string };
      economic: { impact: number; explanation: string };
      weather: { impact: number; explanation: string };
      industrial: { impact: number; explanation: string };
    };
    recommendation: string;
  };
  region: string;
  timeframe: string;
}

// Service pour les fonctionnalités IA
export const AIService = {
  // Assistant IA
  async getAssistantResponse(messages: { role: string; content: string }[], userId: string): Promise<AIAssistantResponse> {
    console.log("Calling AI assistant with userId:", userId);
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { messages, userId }
    });
    
    if (error) {
      console.error("AI assistant error:", error);
      throw new Error(`Error getting AI assistant response: ${error.message}`);
    }
    return data as AIAssistantResponse;
  },
  
  // Optimisation d'itinéraire
  async getRouteOptimization(origin: string, destination: string, userId: string): Promise<RouteOptimizationResponse> {
    console.log("Calling route optimization with userId:", userId);
    const { data, error } = await supabase.functions.invoke('route-optimization', {
      body: { origin, destination, userId }
    });
    
    if (error) {
      console.error("Route optimization error:", error);
      throw new Error(`Error getting route optimization: ${error.message}`);
    }
    return data as RouteOptimizationResponse;
  },
  
  // Estimation de prix
  async getPriceEstimation(
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
  },
  
  // Reconnaissance de documents
  async analyzeDocument(documentBase64: string, documentType: string, userId: string): Promise<DocumentRecognitionResponse> {
    console.log("Calling document analysis with userId:", userId);
    console.log("Document content length:", documentBase64.length);
    console.log("Document type:", documentType);
    
    const { data, error } = await supabase.functions.invoke('document-recognition', {
      body: { documentBase64, documentType, userId }
    });
    
    if (error) {
      console.error("Document analysis error:", error);
      throw new Error(`Error analyzing document: ${error.message}`);
    }
    
    console.log("Document analysis completed successfully");
    return data as DocumentRecognitionResponse;
  },
  
  // Prédiction de demande
  async getDemandPrediction(region: string, timeframe: string, transportType?: string): Promise<DemandPredictionResponse> {
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
};

// Hook for using the services IA with toasts for feedback
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
        return await AIService.getAssistantResponse(messages, userId);
      } catch (error) {
        return handleError(error, "Impossible d'obtenir une réponse de l'assistant");
      }
    },
    
    getRouteOptimization: async (origin: string, destination: string, userId: string) => {
      try {
        return await AIService.getRouteOptimization(origin, destination, userId);
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
        return await AIService.getPriceEstimation(origin, destination, weight, vehicleType, volume, specialRequirements);
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
        
        return await AIService.analyzeDocument(documentBase64, documentType, userId);
      } catch (error) {
        console.error("Error in analyzeDocument:", error);
        return handleError(error, "Impossible d'analyser le document");
      }
    },
    
    getDemandPrediction: async (region: string, timeframe: string, transportType?: string) => {
      try {
        return await AIService.getDemandPrediction(region, timeframe, transportType);
      } catch (error) {
        return handleError(error, "Impossible d'obtenir une prédiction de demande");
      }
    }
  };
}
