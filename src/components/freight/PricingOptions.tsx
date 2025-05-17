
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { VehicleType, AdditionalFeeType, getVehicleTypeLabel, getAdditionalFeeLabel } from "@/lib/pricing";

interface PricingOptionsProps {
  vehicleType: VehicleType;
  additionalFees: AdditionalFeeType[];
  emptyReturn: boolean;
  onVehicleTypeChange: (value: VehicleType) => void;
  onAdditionalFeesChange: (value: AdditionalFeeType[]) => void;
  onEmptyReturnChange: (value: boolean) => void;
}

export const PricingOptions = ({
  vehicleType,
  additionalFees,
  emptyReturn,
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
            <Label htmlFor="vehicle-type">Type de véhicule</Label>
            <Select 
              value={vehicleType} 
              onValueChange={(value) => onVehicleTypeChange(value as VehicleType)}
            >
              <SelectTrigger id="vehicle-type" className="w-full">
                <SelectValue placeholder="Sélectionner un type de véhicule" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(getVehicleTypeLabel({} as VehicleType)).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getVehicleTypeLabel(type as VehicleType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Frais supplémentaires</Label>
            
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
