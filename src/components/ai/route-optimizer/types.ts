
import { MapMarker, MapPosition } from "@/components/map/types";

export interface RouteOptimizationFormData {
  origin: string;
  destination: string;
}

export interface RouteOptimizationResult {
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
