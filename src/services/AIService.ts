
// This file provides backward compatibility with the old AIService API
// It re-exports everything from the new modular AI services

import { 
  AIService as ModularAIService,
  useAIServices as ModularUseAIServices,
  AIAssistantResponse,
  RouteOptimizationResponse,
  PriceEstimationResponse,
  DocumentRecognitionResponse,
  DemandPredictionResponse
} from "./ai";

// Re-export types for backward compatibility
export type {
  AIAssistantResponse,
  RouteOptimizationResponse,
  PriceEstimationResponse,
  DocumentRecognitionResponse,
  DemandPredictionResponse
};

// Re-export the AIService object with all the same functions
export const AIService = ModularAIService;

// Re-export the hook
export const useAIServices = ModularUseAIServices;
