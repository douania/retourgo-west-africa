
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MapPosition {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  initialPosition?: MapPosition;
  showCurrentLocation?: boolean;
  readOnly?: boolean;
  onPositionChange?: (position: MapPosition) => void;
  showNearbyFreights?: boolean;
  title?: string;
  onDefineReturnRoute?: (origin: string, destination: string) => void;
}

const LocationMap = ({
  initialPosition = { lat: 14.7167, lng: -17.4677 }, // Dakar default
  showCurrentLocation = false,
  readOnly = false,
  onPositionChange,
  showNearbyFreights = false,
  title = "Localisation",
  onDefineReturnRoute
}: LocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [nearbyFreights, setNearbyFreights] = useState([]);
  const [returnOrigin, setReturnOrigin] = useState("");
  const [returnDestination, setReturnDestination] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // Dans une version complète, cette fonction initialiserait une carte MapBox ou Google Maps
    // Pour l'instant, nous affichons un espace réservé pour la carte
    
    if (showCurrentLocation) {
      // Demander l'accès à la géolocalisation
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
          
          // Si l'utilisateur est connecté, mettre à jour sa position
          updateUserLocation(newPosition);
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
    }
  }, [showCurrentLocation, onPositionChange, toast]);

  const updateUserLocation = async (position: MapPosition) => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({
          current_latitude: position.lat,
          current_longitude: position.lng,
          location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      console.log("Position utilisateur mise à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la position:", error);
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
      // ID du watch pour pouvoir l'arrêter plus tard
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(newPosition);
          updateUserLocation(newPosition);
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
      
      // Stockage de l'ID pour le nettoyage
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

  const handleDefineReturnRoute = () => {
    if (onDefineReturnRoute && returnOrigin && returnDestination) {
      onDefineReturnRoute(returnOrigin, returnDestination);
    } else {
      toast({
        title: "Information manquante",
        description: "Veuillez spécifier l'origine et la destination de votre trajet retour.",
        variant: "destructive"
      });
    }
  };

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
        
        updateUserLocation(newPosition);
        
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-retourgo-orange" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainerRef}
          className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden"
        >
          {/* Placeholder de carte - à remplacer par une véritable implémentation de carte */}
          <div className="text-gray-500 text-center p-4">
            <p>Carte interactive - Intégration MapBox/Google Maps en cours</p>
            {currentPosition && (
              <p className="mt-2 font-mono text-xs">
                Position actuelle: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </p>
            )}
            {isTracking && (
              <p className="text-retourgo-green text-xs mt-1">
                Suivi en temps réel actif
              </p>
            )}
          </div>
          
          {/* Indicateur simulé de position */}
          {currentPosition && (
            <div className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md" 
                 style={{ 
                   left: "50%", 
                   top: "50%", 
                   transform: "translate(-50%, -50%)" 
                 }}>
              <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {!readOnly && (
            <Button 
              onClick={handleUpdateLocation} 
              className="bg-retourgo-green hover:bg-retourgo-green/90 flex items-center gap-2"
              type="button"
            >
              <MapPin className="h-4 w-4" />
              Mettre à jour ma position
            </Button>
          )}
          
          {showCurrentLocation && !isTracking && (
            <Button 
              onClick={startPositionTracking}
              className="flex items-center gap-2"
              type="button"
            >
              <Navigation className="h-4 w-4" />
              Activer le suivi en temps réel
            </Button>
          )}
          
          {showCurrentLocation && isTracking && (
            <Button 
              onClick={stopPositionTracking}
              variant="destructive"
              className="flex items-center gap-2"
              type="button"
            >
              <Navigation className="h-4 w-4" />
              Désactiver le suivi
            </Button>
          )}
        </div>
        
        {onDefineReturnRoute && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Définir mon trajet retour</h4>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Origine" 
                value={returnOrigin}
                onChange={(e) => setReturnOrigin(e.target.value)}
                className="border rounded p-2 text-sm"
              />
              <input 
                type="text" 
                placeholder="Destination" 
                value={returnDestination}
                onChange={(e) => setReturnDestination(e.target.value)}
                className="border rounded p-2 text-sm"
              />
            </div>
            <Button 
              onClick={handleDefineReturnRoute}
              className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90 mt-2"
              type="button"
            >
              <Truck className="h-4 w-4 mr-2" />
              Enregistrer mon trajet retour
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
