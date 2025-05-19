
import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useToast } from "@/hooks/use-toast";
import { MapPosition, MapMarker } from "../types";

interface UseMapboxLocationOptions {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialPosition: MapPosition;
  onPositionChange?: (position: MapPosition) => void;
  showCurrentLocation?: boolean;
}

export const useMapboxLocation = ({
  map,
  initialPosition,
  onPositionChange,
  showCurrentLocation = false
}: UseMapboxLocationOptions) => {
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  // Initialize user location if needed
  useEffect(() => {
    if (!map.current || !showCurrentLocation) return;

    if (navigator.geolocation) {
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
          
          if (!map.current) return;
          
          // Create or update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([newPosition.lng, newPosition.lat]);
          } else {
            // Create custom DOM element for user marker
            const el = document.createElement("div");
            el.className = "w-5 h-5 bg-blue-500 rounded-full border-2 border-white";
            
            // Add pulse effect
            const pulse = document.createElement("div");
            pulse.className = "w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-75 absolute top-0 left-0";
            el.appendChild(pulse);
            
            userMarkerRef.current = new mapboxgl.Marker({element: el})
              .setLngLat([newPosition.lng, newPosition.lat])
              .addTo(map.current);
          }
          
          // Center map on user position
          map.current.flyTo({
            center: [newPosition.lng, newPosition.lat],
            essential: true
          });
        },
        (error) => {
          console.error("Géolocalisation error:", error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'obtenir votre position actuelle.",
            variant: "destructive"
          });
        }
      );
    }
  }, [map.current, showCurrentLocation, onPositionChange, toast]);

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
        
        if (map.current) {
          map.current.flyTo({
            center: [newPosition.lng, newPosition.lat],
            essential: true
          });
          
          // Update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([newPosition.lng, newPosition.lat]);
          }
        }
        
        toast({
          title: "Position mise à jour",
          description: "Votre position actuelle a été mise à jour avec succès."
        });
      },
      (error) => {
        console.error("Géolocalisation error:", error);
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

  return {
    currentPosition,
    isTracking,
    userMarkerRef,
    handleUpdateLocation,
    toggleTracking,
  };
};
