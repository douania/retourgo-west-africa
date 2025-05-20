
// Export all service functions
export * from "./assistantService";
export * from "./routeService";
export * from "./priceService";
export * from "./documentService";
export * from "./demandService";

// Export types
export * from "./types";

// Export the hook
export { useAIServices } from "./useAIServices";

// Re-export as AIService for backward compatibility
import * as assistantModule from "./assistantService";
import * as routeModule from "./routeService";
import * as priceModule from "./priceService";
import * as documentModule from "./documentService";
import * as demandModule from "./demandService";

export const AIService = {
  getAssistantResponse: assistantModule.getAssistantResponse,
  getRouteOptimization: routeModule.getRouteOptimization,
  getPriceEstimation: priceModule.getPriceEstimation,
  analyzeDocument: documentModule.analyzeDocument,
  getDemandPrediction: demandModule.getDemandPrediction
};
