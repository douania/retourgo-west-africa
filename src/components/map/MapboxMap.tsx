
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { BaseMapProps } from "./types";
import { useMapboxLocation } from "./hooks/useMapboxLocation";
import { useMapboxMarkers } from "./hooks/useMapboxMarkers";
import { MapboxControls } from "./components/MapboxControls";

// Mapbox requires a public API token
// In a production environment, this token should be stored in Supabase secrets
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHZkd3M4NmYxdjRiMnZxaGx5NGEyNmZzIn0.kPHm_UwtutL-Ni1KFSYydw";

if (!MAPBOX_TOKEN) {
  console.error("Mapbox token is not defined");
}

// Set Mapbox token
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapboxMap: React.FC<BaseMapProps> = ({
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
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialPosition.lng, initialPosition.lat],
      zoom: zoom
    });

    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    map.current = newMap;

    // Clean up map on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialPosition.lat, initialPosition.lng, zoom]);

  // Use the location hook
  const {
    currentPosition,
    isTracking,
    handleUpdateLocation,
    toggleTracking
  } = useMapboxLocation({
    map,
    initialPosition,
    onPositionChange,
    showCurrentLocation
  });

  // Use the markers hook
  useMapboxMarkers({
    map,
    markers,
    onMarkerClick,
    followMarker
  });

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
          ref={mapContainer}
          className={`w-full ${height} rounded-md overflow-hidden border`}
        />
        
        <MapboxControls 
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

export default MapboxMap;
