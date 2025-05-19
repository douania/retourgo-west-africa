
import React, { useState } from 'react';
import MapboxMap from "@/components/map/MapboxMap";
import { MapMarker } from "@/components/map/types";

const MapPage = () => {
  // Sample data for the map
  const sampleMarkers: MapMarker[] = [
    { id: '1', position: { lat: 14.7167, lng: -17.4677 }, type: 'freight', label: 'Textile, 500kg' },
    { id: '2', position: { lat: 14.6937, lng: -17.4441 }, type: 'freight', label: 'Électronique, 200kg' },
    { id: '3', position: { lat: 14.7337, lng: -17.4877 }, type: 'freight', label: 'Alimentaire, 1000kg' },
    { id: '4', position: { lat: 14.6967, lng: -17.4877 }, type: 'vehicle', label: 'Camion, 3T' },
    { id: '5', position: { lat: 14.7397, lng: -17.4341 }, type: 'vehicle', label: '4x4, 1T' },
  ];

  const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>(undefined);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarkerId(marker.id);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Carte interactive</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <MapboxMap
          height="h-[70vh]"
          markers={sampleMarkers}
          showCurrentLocation={true}
          onMarkerClick={handleMarkerClick}
          followMarker={selectedMarkerId}
          allowTracking={true}
          title="Carte de frets et transporteurs"
          zoom={14}
        />
      </div>
    </div>
  );
};

export default MapPage;
