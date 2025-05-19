
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useMapLocation } from "./hooks/useMapLocation";
import { MapControls } from "./components/MapControls";
import { MapMarkers } from "./components/MapMarkers";
import { MapPlaceholder } from "./components/MapPlaceholder";
import { MapPosition, MapMarker, BaseMapProps } from "./types";

interface InteractiveMapProps extends BaseMapProps {
  followMarker?: string; // ID of marker to follow/center on
  allowTracking?: boolean;
}

const InteractiveMap = ({
  initialPosition = { lat: 14.7167, lng: -17.4677 }, // Dakar default
  showCurrentLocation = false,
  readOnly = false,
  onPositionChange,
  title = "Carte interactive",
  markers = [],
  height = "h-64",
  zoom = 12,
  onMarkerClick,
  followMarker,
  allowTracking = false
}: InteractiveMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentPosition,
    setCurrentPosition,
    isTracking,
    handleUpdateLocation,
    toggleTracking
  } = useMapLocation({ onPositionChange });
  
  useEffect(() => {
    // Dans une version complète, cette fonction initialiserait une carte MapBox ou Google Maps
    
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
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, [showCurrentLocation, onPositionChange, setCurrentPosition]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-retourgo-orange" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={mapContainerRef}
          className={`w-full ${height} bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden`}
        >
          <MapPlaceholder 
            currentPosition={currentPosition} 
            markers={markers}
            isTracking={isTracking}
          />
          
          {/* Render markers */}
          <MapMarkers markers={markers} onMarkerClick={onMarkerClick} />
        </div>
        
        <MapControls 
          readOnly={readOnly}
          isTracking={isTracking}
          allowTracking={allowTracking}
          onUpdateLocation={handleUpdateLocation}
          onToggleTracking={toggleTracking}
        />
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
