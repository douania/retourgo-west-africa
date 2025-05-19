
import React from "react";
import { MapPosition, MapMarker } from "../types";

interface MapPlaceholderProps {
  currentPosition: MapPosition | null;
  markers: MapMarker[];
  isTracking?: boolean;
}

export const MapPlaceholder = ({ currentPosition, markers, isTracking }: MapPlaceholderProps) => {
  return (
    <>
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
        {isTracking && (
          <p className="text-retourgo-green text-xs mt-1">
            Suivi en temps réel actif
          </p>
        )}
      </div>
      
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
    </>
  );
};
