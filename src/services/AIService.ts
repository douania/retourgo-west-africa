
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
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { messages, userId }
    });
    
    if (error) throw new Error(`Error getting AI assistant response: ${error.message}`);
    return data as AIAssistantResponse;
  },
  
  // Optimisation d'itinéraire
  async getRouteOptimization(origin: string, destination: string, userId: string): Promise<RouteOptimizationResponse> {
    const { data, error } = await supabase.functions.invoke('route-optimization', {
      body: { origin, destination, userId }
    });
    
    if (error) throw new Error(`Error getting route optimization: ${error.message}`);
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
    const { data, error } = await supabase.functions.invoke('price-estimation', {
      body: { origin, destination, weight, volume, vehicleType, specialRequirements }
    });
    
    if (error) throw new Error(`Error getting price estimation: ${error.message}`);
    return data as PriceEstimationResponse;
  },
  
  // Reconnaissance de documents
  async analyzeDocument(documentBase64: string, documentType: string, userId: string): Promise<DocumentRecognitionResponse> {
    const { data, error } = await supabase.functions.invoke('document-recognition', {
      body: { documentBase64, documentType, userId }
    });
    
    if (error) throw new Error(`Error analyzing document: ${error.message}`);
    return data as DocumentRecognitionResponse;
  },
  
  // Prédiction de demande
  async getDemandPrediction(region: string, timeframe: string, transportType?: string): Promise<DemandPredictionResponse> {
    const { data, error } = await supabase.functions.invoke('demand-prediction', {
      body: { region, timeframe, transportType }
    });
    
    if (error) throw new Error(`Error getting demand prediction: ${error.message}`);
    return data as DemandPredictionResponse;
  }
};

// Hook pour utiliser les services IA avec des toasts pour le feedback
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
        return await AIService.analyzeDocument(documentBase64, documentType, userId);
      } catch (error) {
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
