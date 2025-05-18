
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, HelpCircle, TruckIcon } from "lucide-react";
import { 
  VehicleType, 
  AdditionalFeeType, 
  getVehicleTypeLabel, 
  getAdditionalFeeLabel,
  getVehicleWeightCapacity
} from "@/lib/pricing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingOptionsProps {
  vehicleType: VehicleType;
  additionalFees: AdditionalFeeType[];
  emptyReturn: boolean;
  weight: number;
  onVehicleTypeChange: (value: VehicleType) => void;
  onAdditionalFeesChange: (value: AdditionalFeeType[]) => void;
  onEmptyReturnChange: (value: boolean) => void;
}

export const PricingOptions = ({
  vehicleType,
  additionalFees,
  emptyReturn,
  weight,
  onVehicleTypeChange,
  onAdditionalFeesChange,
  onEmptyReturnChange
}: PricingOptionsProps) => {
  const handleAdditionalFeeToggle = (value: AdditionalFeeType) => {
    if (additionalFees.includes(value)) {
      onAdditionalFeesChange(additionalFees.filter(fee => fee !== value));
    } else {
      onAdditionalFeesChange([...additionalFees, value]);
    }
  };
  
  const vehicleCapacity = getVehicleWeightCapacity(vehicleType);
  const isWeightCompatible = weight >= vehicleCapacity.minWeight && weight <= vehicleCapacity.maxWeight;
  
  // Define available vehicle types
  const availableVehicleTypes: VehicleType[] = ['car', 'van', 'truck', 'semi', 'refrigerated'];
  
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Coins className="h-5 w-5 text-retourgo-orange" />
          Options de tarification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vehicle-type">Type de véhicule</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2 p-1">
                      <p className="font-semibold">Capacités de chargement:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Voiture: jusqu'à 500 kg</li>
                        <li>• Camionnette: jusqu'à 3.5 tonnes</li>
                        <li>• Camion: jusqu'à 30 tonnes</li>
                        <li>• Semi-remorque: 5 à 40 tonnes</li>
                        <li>• Réfrigéré: jusqu'à 25 tonnes</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select 
              value={vehicleType} 
              onValueChange={(value) => onVehicleTypeChange(value as VehicleType)}
            >
              <SelectTrigger id="vehicle-type" className="w-full">
                <SelectValue placeholder="Sélectionner un type de véhicule" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicleTypes.map((type) => {
                  const capacity = getVehicleWeightCapacity(type);
                  const isCompatible = weight >= capacity.minWeight && weight <= capacity.maxWeight;
                  
                  return (
                    <SelectItem key={type} value={type} disabled={weight > 0 && !isCompatible}>
                      <div className="flex items-center gap-2">
                        <span>{getVehicleTypeLabel(type)}</span>
                        {weight > 0 && !isCompatible && (
                          <span className="text-xs text-red-500">(incompatible)</span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {weight > 0 && vehicleCapacity && (
              <div className={`text-xs mt-1 ${isWeightCompatible ? 'text-green-600' : 'text-red-500'}`}>
                <div className="flex items-center gap-1">
                  <TruckIcon className="h-3 w-3" />
                  <span>
                    {isWeightCompatible 
                      ? `Compatible avec ${weight.toLocaleString('fr-SN')} kg` 
                      : `Incompatible avec ${weight.toLocaleString('fr-SN')} kg`}
                  </span>
                </div>
                <div className="ml-4">
                  (Capacité: {vehicleCapacity.minWeight > 0 ? vehicleCapacity.minWeight.toLocaleString('fr-SN') + ' - ' : ''}
                  {vehicleCapacity.maxWeight.toLocaleString('fr-SN')} kg)
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Frais supplémentaires</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Ces options augmentent le prix en fonction du service supplémentaire requis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {(["manual_loading", "fragile", "urgent"] as AdditionalFeeType[]).map((fee) => (
              <div key={fee} className="flex items-center space-x-2">
                <Checkbox 
                  id={`fee-${fee}`}
                  checked={additionalFees.includes(fee)}
                  onCheckedChange={() => handleAdditionalFeeToggle(fee)}
                />
                <Label htmlFor={`fee-${fee}`} className="font-normal">
                  {getAdditionalFeeLabel(fee)}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="empty-return"
                checked={emptyReturn}
                onCheckedChange={(checked) => onEmptyReturnChange(checked === true)}
              />
              <Label htmlFor="empty-return" className="font-semibold text-retourgo-green">
                Trajet retour à vide (-25% à -50%)
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Appliquez cette réduction si le transporteur revient à vide sur ce trajet
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingOptions;
