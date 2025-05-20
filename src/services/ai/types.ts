
// Types for AI service responses
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
  source?: string;
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
