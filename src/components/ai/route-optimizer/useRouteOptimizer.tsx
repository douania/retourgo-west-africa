
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAIServices } from "@/services/AIService";
import { MapMarker } from "@/components/map/types";
import { RouteOptimizationResult } from "./types";

export const useRouteOptimizer = () => {
  const { user } = useAuth();
  const { getRouteOptimization } = useAIServices();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteOptimizationResult | null>(null);
  const [error, setError] = useState("");
  const [routeMarkers, setRouteMarkers] = useState<MapMarker[]>([]);

  const handleOptimize = async () => {
    if (!origin.trim() || !destination.trim() || !user?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await getRouteOptimization(origin, destination, user.id);
      setResult(response);
      
      // Create markers for origin and destination
      const newMarkers: MapMarker[] = [
        {
          id: 'origin',
          position: { 
            lat: 14.7167 + Math.random() * 0.1 - 0.05, // Demo values around Dakar
            lng: -17.4677 + Math.random() * 0.1 - 0.05 
          },
          type: 'location',
          label: origin
        },
        {
          id: 'destination',
          position: { 
            lat: 14.7167 + Math.random() * 0.1 - 0.05,
            lng: -17.4677 + Math.random() * 0.1 - 0.05 
          },
          type: 'location',
          label: destination
        }
      ];
      
      // Add markers for rest points and checkpoints
      if (response.route.restPoints) {
        response.route.restPoints.forEach((point: string, index: number) => {
          newMarkers.push({
            id: `rest-${index}`,
            position: { 
              lat: 14.7167 + Math.random() * 0.1 - 0.05,
              lng: -17.4677 + Math.random() * 0.1 - 0.05 
            },
            type: 'location',
            label: point
          });
        });
      }
      
      if (response.route.checkpoints) {
        response.route.checkpoints.forEach((point: string, index: number) => {
          newMarkers.push({
            id: `checkpoint-${index}`,
            position: { 
              lat: 14.7167 + Math.random() * 0.1 - 0.05,
              lng: -17.4677 + Math.random() * 0.1 - 0.05 
            },
            type: 'vehicle',
            label: point
          });
        });
      }
      
      setRouteMarkers(newMarkers);
    } catch (err: any) {
      setError(err.message || "Error optimizing route");
    } finally {
      setLoading(false);
    }
  };

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    loading,
    result,
    error,
    routeMarkers,
    handleOptimize
  };
};
