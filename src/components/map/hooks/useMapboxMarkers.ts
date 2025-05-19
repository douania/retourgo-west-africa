
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MapMarker } from "../types";

interface UseMapboxMarkersOptions {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  followMarker?: string;
}

export const useMapboxMarkers = ({
  map,
  markers,
  onMarkerClick,
  followMarker
}: UseMapboxMarkersOptions) => {
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  
  // Handle markers update
  useEffect(() => {
    if (!map.current) return;
    
    // Remove old markers that are no longer in the list
    Object.keys(markersRef.current).forEach(id => {
      if (!markers.find(m => m.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
    
    // Add or update markers
    markers.forEach(marker => {
      if (markersRef.current[marker.id]) {
        // Update existing marker
        markersRef.current[marker.id].setLngLat([marker.position.lng, marker.position.lat]);
      } else {
        // Create custom DOM element for marker
        const el = document.createElement("div");
        el.className = "flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110";
        el.style.backgroundColor = marker.color || 
          (marker.type === 'vehicle' ? "#22c55e" : 
           marker.type === 'freight' ? "#f97316" : "#3b82f6");
        
        // Add appropriate icon to marker
        const iconContainer = document.createElement("div");
        iconContainer.className = "text-white";
        
        if (marker.type === "vehicle") {
          iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M8 5v12"/><path d="M2 8h8"/><path d="M9 2v3"/><path d="M3 2v3"/><path d="M11 8h7l4 4v5h-4"/><circle cx="15" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>`;
        } else if (marker.type === "freight") {
          iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        } else {
          iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        }
        
        el.appendChild(iconContainer);
        
        // Create mapbox marker
        const mapboxMarker = new mapboxgl.Marker({element: el})
          .setLngLat([marker.position.lng, marker.position.lat])
          .addTo(map.current);
        
        // Add click event if needed
        if (onMarkerClick) {
          mapboxMarker.getElement().addEventListener("click", () => {
            onMarkerClick(marker);
          });
        }
        
        // Add popup if marker has a label
        if (marker.label) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.label);
          mapboxMarker.setPopup(popup);
        }
        
        // Store marker in reference
        markersRef.current[marker.id] = mapboxMarker;
      }
    });
    
    // If a marker needs to be followed, center the map on it
    if (followMarker && markersRef.current[followMarker]) {
      const markerToFollow = markers.find(m => m.id === followMarker);
      if (markerToFollow && map.current) {
        map.current.flyTo({
          center: [markerToFollow.position.lng, markerToFollow.position.lat],
          essential: true
        });
      }
    }
  }, [markers, map.current, onMarkerClick, followMarker]);

  return {
    markersRef
  };
};
