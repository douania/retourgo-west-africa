
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export function useLocationTracking() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Démarrer le suivi de la position
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas prise en charge par votre navigateur");
      return;
    }

    setIsTracking(true);
  };

  // Arrêter le suivi de la position
  const stopTracking = () => {
    setIsTracking(false);
  };

  // Mettre à jour la position de l'utilisateur dans la base de données
  const updateUserLocation = async (location: LocationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          current_latitude: location.latitude,
          current_longitude: location.longitude,
          location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error("Erreur lors de la mise à jour de la position:", error);
        setError("Impossible de mettre à jour votre position");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la position:", err);
      setError("Une erreur est survenue lors de la mise à jour de la position");
    }
  };

  // Suivre les changements de position
  useEffect(() => {
    let watchId: number;

    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(position.timestamp)
          };
          
          setLocation(newLocation);
          updateUserLocation(newLocation);
          setError(null);
        },
        (err) => {
          console.error("Erreur de géolocalisation:", err);
          setError(`Erreur de géolocalisation: ${err.message}`);
          toast({
            title: "Erreur de localisation",
            description: "Impossible de suivre votre position. Veuillez vérifier vos paramètres de confidentialité.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    }

    // Nettoyage
    return () => {
      if (watchId !== undefined && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, user, toast]);

  return {
    location,
    isTracking,
    error,
    startTracking,
    stopTracking
  };
}
