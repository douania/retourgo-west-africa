
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Navigation, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapPosition {
  lat: number;
  lng: number;
}

interface MapMarker {
  id: string;
  position: MapPosition;
  type: "vehicle" | "freight" | "location";
  label?: string;
  color?: string;
}

interface InteractiveMapProps {
  initialPosition?: MapPosition;
  showCurrentLocation?: boolean;
  readOnly?: boolean;
  onPositionChange?: (position: MapPosition) => void;
  title?: string;
  markers?: MapMarker[];
  height?: string;
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
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
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  
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

  // Simulate marker rendering (in a real implementation, these would be rendered on the map)
  const renderedMarkers = markers.map(marker => (
    <div 
      key={marker.id}
      className={`absolute w-5 h-5 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-125`}
      style={{
        backgroundColor: marker.color || (marker.type === 'vehicle' ? "#22c55e" : 
                           marker.type === 'freight' ? "#f97316" : "#3b82f6"),
        top: `${Math.random() * 80 + 10}%`, // For demo; would be calculated from lat/lng
        left: `${Math.random() * 80 + 10}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onMarkerClick?.(marker)}
    >
      {marker.type === 'vehicle' && <Truck className="h-3 w-3 text-white" />}
      {marker.type === 'freight' && <MapPin className="h-3 w-3 text-white" />}
      {marker.type === 'location' && <MapPin className="h-3 w-3 text-white" />}
    </div>
  ));

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
          {/* Placeholder de carte - à remplacer par une véritable implémentation de carte */}
          <div className="text-gray-500 text-center p-4 z-10">
            <p>Carte interactive - Intégration MapBox/Google Maps en cours</p>
            {currentPosition && (
              <p className="mt-2 font-mono text-xs">
                Position actuelle: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </p>
            )}
            {markers.length > 0 && (
              <p className="mt-1 text-xs">
                {markers.length} marqueur{markers.length > 1 ? 's' : ''} sur la carte
              </p>
            )}
          </div>
          
          {/* Render markers */}
          {renderedMarkers}
          
          {/* Simulated map background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M20,20 L30,15 L40,25 L50,20 L60,30 L70,25 L80,40 L70,50 L80,60 L70,70 L60,65 L50,75 L40,65 L30,70 L20,60 Z" 
                fill="none" 
                stroke="#000" 
                strokeWidth="0.5"
              />
              <path 
                d="M30,30 L40,35 L50,30 L60,40 L50,50 L60,60 L50,65 L40,55 Z" 
                fill="none" 
                stroke="#000" 
                strokeWidth="0.5"
              />
            </svg>
          </div>
          
          {/* User location indicator */}
          {currentPosition && (
            <div className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md z-20" 
                 style={{ 
                   left: "50%", 
                   top: "50%", 
                   transform: "translate(-50%, -50%)" 
                 }}>
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
          
          {/* Map controls simulation */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button className="w-6 h-6 bg-white rounded shadow flex items-center justify-center">
              +
            </button>
            <button className="w-6 h-6 bg-white rounded shadow flex items-center justify-center">
              -
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!readOnly && (
            <Button 
              onClick={handleUpdateLocation} 
              className="bg-retourgo-green hover:bg-retourgo-green/90 flex items-center gap-2 flex-grow"
              type="button"
              size="sm"
            >
              <MapPin className="h-4 w-4" />
              Actualiser ma position
            </Button>
          )}
          
          {allowTracking && (
            <Button
              onClick={toggleTracking}
              variant={isTracking ? "destructive" : "outline"}
              className="flex items-center gap-2 flex-grow"
              type="button"
              size="sm"
            >
              {isTracking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Arrêter le suivi
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  Suivre en temps réel
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
