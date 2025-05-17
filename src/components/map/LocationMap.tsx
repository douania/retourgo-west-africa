
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapPosition {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  initialPosition?: MapPosition;
  showCurrentLocation?: boolean;
  readOnly?: boolean;
  onPositionChange?: (position: MapPosition) => void;
  title?: string;
}

const LocationMap = ({
  initialPosition = { lat: 14.7167, lng: -17.4677 }, // Dakar default
  showCurrentLocation = false,
  readOnly = false,
  onPositionChange,
  title = "Localisation"
}: LocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
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
        
        {!readOnly && (
          <Button 
            onClick={handleUpdateLocation} 
            className="mt-4 bg-retourgo-green hover:bg-retourgo-green/90 flex items-center gap-2"
            type="button"
          >
            <MapPin className="h-4 w-4" />
            Mettre à jour ma position
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
