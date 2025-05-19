
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

export interface BaseMapProps {
  initialPosition?: MapPosition;
  showCurrentLocation?: boolean;
  readOnly?: boolean;
  onPositionChange?: (position: MapPosition) => void;
  title?: string;
  markers?: MapMarker[];
  height?: string;
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
}
