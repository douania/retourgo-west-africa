
import React from "react";
import MapboxMap from "@/components/map/MapboxMap";
import { MapMarker } from "@/components/map/types";
import { useTranslation } from "@/hooks/useTranslation";

interface ResultMapProps {
  markers: MapMarker[];
  title: string;
}

const ResultMap: React.FC<ResultMapProps> = ({ markers, title }) => {
  const { t } = useTranslation();
  
  if (markers.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
      <MapboxMap
        height="h-[300px]"
        markers={markers}
        initialPosition={markers[0]?.position || { lat: 14.7167, lng: -17.4677 }}
        zoom={11}
        title={title || t("ai.optimized_route")}
      />
    </div>
  );
};

export default ResultMap;
