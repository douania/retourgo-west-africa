
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapPosition } from "../types";

interface UseMapLocationOptions {
  onPositionChange?: (position: MapPosition) => void;
  updateUserLocation?: (position: MapPosition) => void;
}

export const useMapLocation = (options?: UseMapLocationOptions) => {
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  const { onPositionChange, updateUserLocation } = options || {};

  const handleUpdateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(newPosition);
        
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
        
        if (updateUserLocation) {
          updateUserLocation(newPosition);
        }
        
        toast({
          title: "Position mise à jour",
          description: "Votre position actuelle a été mise à jour avec succès."
        });
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        toast({
          title: "Erreur de localisation",
          description: "Impossible d'obtenir votre position actuelle.",
          variant: "destructive"
        });
      }
    );
  };

  const toggleTracking = () => {
    if (isTracking) {
      // Stop tracking
      setIsTracking(false);
      toast({
        title: "Suivi désactivé",
        description: "Le suivi de position en temps réel a été désactivé."
      });
    } else {
      // Start tracking
      setIsTracking(true);
      toast({
        title: "Suivi activé",
        description: "Le suivi de position en temps réel a été activé."
      });
      
      // In a real implementation, we would start continuous location tracking
      // For demo purposes, just update once
      handleUpdateLocation();
    }
  };

  const startPositionTracking = () => {
    if (navigator.geolocation) {
      setIsTracking(true);
      toast({
        title: "Suivi de position activé",
        description: "Votre position sera mise à jour automatiquement."
      });
      
      // Dans un cas réel, on utiliserait watchPosition de l'API Geolocation
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(newPosition);
          
          if (updateUserLocation) {
            updateUserLocation(newPosition);
          }
        },
        (error) => {
          console.error("Erreur de suivi de position:", error);
          toast({
            title: "Erreur de suivi",
            description: "Impossible de suivre votre position.",
            variant: "destructive"
          });
          setIsTracking(false);
        },
        { enableHighAccuracy: true }
      );
      
      // Return cleanup function
      return () => {
        navigator.geolocation.clearWatch(watchId);
        setIsTracking(false);
      };
    }
  };

  const stopPositionTracking = () => {
    setIsTracking(false);
    toast({
      title: "Suivi de position désactivé",
      description: "Votre position ne sera plus mise à jour."
    });
  };

  return {
    currentPosition,
    setCurrentPosition,
    isTracking,
    setIsTracking,
    handleUpdateLocation,
    toggleTracking,
    startPositionTracking,
    stopPositionTracking
  };
};
