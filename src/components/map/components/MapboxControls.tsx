
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface MapboxControlsProps {
  readOnly?: boolean;
  isTracking?: boolean;
  allowTracking?: boolean;
  onUpdateLocation: () => void;
  onToggleTracking?: () => void;
}

export const MapboxControls = ({
  readOnly = false,
  isTracking = false,
  allowTracking = false,
  onUpdateLocation,
  onToggleTracking
}: MapboxControlsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {!readOnly && (
        <Button 
          onClick={onUpdateLocation} 
          className="bg-retourgo-green hover:bg-retourgo-green/90 flex items-center gap-2 flex-grow"
          type="button"
          size="sm"
        >
          <MapPin className="h-4 w-4" />
          Actualiser ma position
        </Button>
      )}
      
      {allowTracking && onToggleTracking && (
        <Button
          onClick={onToggleTracking}
          variant={isTracking ? "destructive" : "outline"}
          className="flex items-center gap-2 flex-grow"
          type="button"
          size="sm"
        >
          {isTracking ? (
            <>
              <Navigation className="h-4 w-4 animate-spin" />
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
  );
};
