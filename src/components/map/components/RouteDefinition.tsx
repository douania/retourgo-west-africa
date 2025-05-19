
import React from "react";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

interface RouteDefinitionProps {
  returnOrigin: string;
  returnDestination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDefineRoute: () => void;
}

export const RouteDefinition = ({
  returnOrigin,
  returnDestination,
  onOriginChange,
  onDestinationChange,
  onDefineRoute
}: RouteDefinitionProps) => {
  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium text-sm">Définir mon trajet retour</h4>
      <div className="grid grid-cols-2 gap-2">
        <input 
          type="text" 
          placeholder="Origine" 
          value={returnOrigin}
          onChange={(e) => onOriginChange(e.target.value)}
          className="border rounded p-2 text-sm"
        />
        <input 
          type="text" 
          placeholder="Destination" 
          value={returnDestination}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="border rounded p-2 text-sm"
        />
      </div>
      <Button 
        onClick={onDefineRoute}
        className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90 mt-2"
        type="button"
      >
        <Truck className="h-4 w-4 mr-2" />
        Enregistrer mon trajet retour
      </Button>
    </div>
  );
};
