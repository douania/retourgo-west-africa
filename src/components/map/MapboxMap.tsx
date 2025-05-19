
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mapbox necesssite un token d'API public
// Dans un environnement de production, ce token devrait être stocké dans les secrets Supabase
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHZkd3M4NmYxdjRiMnZxaGx5NGEyNmZzIn0.kPHm_UwtutL-Ni1KFSYydw";

if (!MAPBOX_TOKEN) {
  console.error("Mapbox token is not defined");
}

// Définir le token Mapbox
mapboxgl.accessToken = MAPBOX_TOKEN;

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: MapPosition;
  type: "vehicle" | "freight" | "location";
  label?: string;
  color?: string;
}

interface MapboxMapProps {
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

const MapboxMap = ({
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
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialPosition.lng, initialPosition.lat],
      zoom: zoom
    });

    // Ajouter les contrôles de navigation
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    map.current = newMap;

    // Nettoyer la carte lors du démontage du composant
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialPosition.lat, initialPosition.lng, zoom]);

  // Gérer l'affichage de la position actuelle
  useEffect(() => {
    if (!map.current || !showCurrentLocation) return;

    if (navigator.geolocation) {
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
          
          if (!map.current) return;
          
          // Créer ou mettre à jour le marqueur de l'utilisateur
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([newPosition.lng, newPosition.lat]);
          } else {
            // Créer un élément DOM personnalisé pour le marqueur utilisateur
            const el = document.createElement("div");
            el.className = "w-5 h-5 bg-blue-500 rounded-full border-2 border-white";
            
            // Ajouter un effet de pulsation
            const pulse = document.createElement("div");
            pulse.className = "w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-75 absolute top-0 left-0";
            el.appendChild(pulse);
            
            userMarkerRef.current = new mapboxgl.Marker({element: el})
              .setLngLat([newPosition.lng, newPosition.lat])
              .addTo(map.current);
          }
          
          // Centrer la carte sur la position de l'utilisateur
          map.current.flyTo({
            center: [newPosition.lng, newPosition.lat],
            essential: true
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
    }
  }, [map.current, showCurrentLocation, onPositionChange]);

  // Gérer la mise à jour des marqueurs
  useEffect(() => {
    if (!map.current) return;
    
    // Supprimer les anciens marqueurs qui ne sont plus dans la liste
    Object.keys(markersRef.current).forEach(id => {
      if (!markers.find(m => m.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
    
    // Ajouter ou mettre à jour les marqueurs
    markers.forEach(marker => {
      if (markersRef.current[marker.id]) {
        // Mettre à jour le marqueur existant
        markersRef.current[marker.id].setLngLat([marker.position.lng, marker.position.lat]);
      } else {
        // Créer un élément DOM personnalisé pour le marqueur
        const el = document.createElement("div");
        el.className = "flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110";
        el.style.backgroundColor = marker.color || 
          (marker.type === 'vehicle' ? "#22c55e" : 
           marker.type === 'freight' ? "#f97316" : "#3b82f6");
        
        // Ajouter l'icône appropriée au marqueur
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
        
        // Créer le marqueur
        const mapboxMarker = new mapboxgl.Marker({element: el})
          .setLngLat([marker.position.lng, marker.position.lat])
          .addTo(map.current);
        
        // Ajouter un événement de clic si nécessaire
        if (onMarkerClick) {
          mapboxMarker.getElement().addEventListener("click", () => {
            onMarkerClick(marker);
          });
        }
        
        // Ajouter un popup si le marqueur a un label
        if (marker.label) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.label);
          mapboxMarker.setPopup(popup);
        }
        
        // Stocker le marqueur dans la référence
        markersRef.current[marker.id] = mapboxMarker;
      }
    });
    
    // Si un marqueur doit être suivi, centrer la carte sur celui-ci
    if (followMarker && markersRef.current[followMarker]) {
      const markerToFollow = markers.find(m => m.id === followMarker);
      if (markerToFollow) {
        map.current.flyTo({
          center: [markerToFollow.position.lng, markerToFollow.position.lat],
          essential: true
        });
      }
    }
  }, [markers, map.current, onMarkerClick, followMarker]);

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
        
        if (map.current) {
          map.current.flyTo({
            center: [newPosition.lng, newPosition.lat],
            essential: true
          });
          
          // Mettre à jour le marqueur utilisateur
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([newPosition.lng, newPosition.lat]);
          }
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
      // Arrêter le suivi
      setIsTracking(false);
      toast({
        title: "Suivi désactivé",
        description: "Le suivi de position en temps réel a été désactivé."
      });
    } else {
      // Démarrer le suivi
      setIsTracking(true);
      toast({
        title: "Suivi activé",
        description: "Le suivi de position en temps réel a été activé."
      });
      
      // Dans une implémentation réelle, nous commencerions le suivi continu de la position
      // Pour la démo, mettre juste à jour une fois
      handleUpdateLocation();
    }
  };

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
      </CardContent>
    </Card>
  );
};

export default MapboxMap;
