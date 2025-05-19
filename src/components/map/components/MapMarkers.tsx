
import React from "react";
import { MapPin, Truck } from "lucide-react";
import { MapMarker } from "../types";

interface MapMarkersProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

export const MapMarkers = ({ markers, onMarkerClick }: MapMarkersProps) => {
  // Simulate marker rendering (in a real implementation, these would be rendered on the map)
  return (
    <>
      {markers.map(marker => (
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
      ))}
    </>
  );
};
