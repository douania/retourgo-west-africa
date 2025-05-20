import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  AIAssistantResponse,
  RouteOptimizationResponse,
  PriceEstimationResponse,
  DocumentRecognitionResponse,
  DemandPredictionResponse
} from "./types";
import { getAssistantResponse } from "./assistantService";
import { getRouteOptimization } from "./routeService";
import { getPriceEstimation } from "./priceService";
import { analyzeDocument } from "./documentService";
import { getDemandPrediction } from "./demandService";

export function useAIServices() {
  const [loading, setLoading] = useState<{
    assistant: boolean;
    route: boolean;
    price: boolean;
    document: boolean;
    demand: boolean;
  }>({
    assistant: false,
    route: false,
    price: false,
    document: false,
    demand: false
  });
  
  const { toast } = useToast();

  // Assistant service
  const getAIAssistantResponse = async (
    messages: { role: string; content: string }[], 
    userId: string
  ): Promise<AIAssistantResponse | null> => {
    try {
      setLoading(prev => ({ ...prev, assistant: true }));
      console.log("Calling AI assistant service with userId:", userId);
      
      const response = await getAssistantResponse(messages, userId);
      return response;
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de la communication avec l'assistant IA";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, assistant: false }));
    }
  };

  // Route optimization service
  const getRouteOptimization = async (
    origin: string, 
    destination: string, 
    userId: string
  ): Promise<RouteOptimizationResponse | null> => {
    try {
      setLoading(prev => ({ ...prev, route: true }));
      console.log("Calling route optimization service with userId:", userId);
      
      const response = await getRouteOptimization(origin, destination, userId);
      return response;
    } catch (error) {
      console.error("Route optimization error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de l'optimisation de l'itinéraire";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, route: false }));
    }
  };

  // Price estimation service
  const getPriceEstimation = async (
    origin: string, 
    destination: string, 
    weight: number, 
    vehicleType: string,
    volume?: number,
    specialRequirements?: string
  ): Promise<PriceEstimationResponse | null> => {
    try {
      setLoading(prev => ({ ...prev, price: true }));
      console.log("Calling price estimation service");
      
      const response = await getPriceEstimation(
        origin, 
        destination, 
        weight, 
        vehicleType, 
        volume, 
        specialRequirements
      );
      
      return response;
    } catch (error) {
      console.error("Price estimation error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de l'estimation du prix";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, price: false }));
    }
  };

  // Document analysis service
  const analyzeDocument = async (
    documentBase64: string, 
    documentType: string, 
    userId: string
  ): Promise<DocumentRecognitionResponse | null> => {
    try {
      setLoading(prev => ({ ...prev, document: true }));
      console.log("Calling document analysis service with userId:", userId);
      
      const response = await analyzeDocument(documentBase64, documentType, userId);
      
      // Log success for debugging
      console.log("Document analysis successful, confidence:", response.confidenceScore);
      
      // Show a success toast if the analysis was successful
      if (response.source && !response.source.includes('mock')) {
        toast({
          title: "Analyse réussie",
          description: "Le document a été analysé avec succès",
        });
      } else if (response.source && response.source.includes('mock')) {
        toast({
          title: "Mode démonstration",
          description: "Des données simulées ont été utilisées pour l'analyse",
          variant: "default"
        });
      }
      
      return response;
    } catch (error) {
      console.error("Document analysis error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de l'analyse du document";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, document: false }));
    }
  };

  // Demand prediction service
  const getDemandPrediction = async (
    region: string, 
    timeframe: string, 
    transportType?: string
  ): Promise<DemandPredictionResponse | null> => {
    try {
      setLoading(prev => ({ ...prev, demand: true }));
      console.log("Calling demand prediction service");
      
      const response = await getDemandPrediction(region, timeframe, transportType);
      return response;
    } catch (error) {
      console.error("Demand prediction error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de la prédiction de la demande";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, demand: false }));
    }
  };

  // Return the services and loading states
  return {
    loading,
    getAssistantResponse: getAIAssistantResponse,
    getRouteOptimization,
    getPriceEstimation,
    analyzeDocument,
    getDemandPrediction,
    // Keep backward compatibility with old names
    optimizeRoute: getRouteOptimization,
    estimatePrice: getPriceEstimation,
    predictDemand: getDemandPrediction
  };
}
