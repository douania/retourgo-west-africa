
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMapLocation } from "./hooks/useMapLocation";
import { MapControls } from "./components/MapControls";
import { MapPlaceholder } from "./components/MapPlaceholder";
import { RouteDefinition } from "./components/RouteDefinition";
import { BaseMapProps } from "./types";

interface LocationMapProps extends BaseMapProps {
  showNearbyFreights?: boolean;
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
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [returnOrigin, setReturnOrigin] = useState("");
  const [returnDestination, setReturnDestination] = useState("");
  const [nearbyFreights, setNearbyFreights] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const updateUserLocation = async (position: { lat: number; lng: number }) => {
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
  
  const {
    currentPosition,
    isTracking,
    handleUpdateLocation,
    startPositionTracking,
    stopPositionTracking
  } = useMapLocation({ 
    onPositionChange, 
    updateUserLocation 
  });

  useEffect(() => {
    if (showCurrentLocation) {
      // Demander l'accès à la géolocalisation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
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
  }, [showCurrentLocation, toast]);

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
          <MapPlaceholder 
            currentPosition={currentPosition}
            markers={[]}
            isTracking={isTracking}
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {!readOnly && (
            <MapControls
              readOnly={readOnly}
              onUpdateLocation={handleUpdateLocation}
            />
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
          <RouteDefinition
            returnOrigin={returnOrigin}
            returnDestination={returnDestination}
            onOriginChange={setReturnOrigin}
            onDestinationChange={setReturnDestination}
            onDefineRoute={handleDefineReturnRoute}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
