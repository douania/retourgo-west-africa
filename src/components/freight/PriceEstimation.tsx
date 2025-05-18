
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, getVehicleTypeLabel, getAdditionalFeeLabel, VehicleType, AdditionalFeeType } from "@/lib/pricing";
import { Truck, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PriceEstimationProps {
  baseFee: number;
  distanceFee: number;
  distance: number;
  origin: string;
  destination: string;
  vehicleType: VehicleType;
  weight: number;
  additionalFees: { type: string; amount: number }[];
  emptyReturnDiscount: number;
  total: number;
  showDetails?: boolean;
}

export const PriceEstimation = ({
  baseFee,
  distanceFee,
  distance,
  origin,
  destination,
  vehicleType,
  weight,
  additionalFees,
  emptyReturnDiscount,
  total,
  showDetails = true
}: PriceEstimationProps) => {
  const originCity = origin.split(',')[0];
  const destinationCity = destination.split(',')[0];
  
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Tag className="h-5 w-5 text-retourgo-orange" />
          Estimation du prix
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showDetails ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tarif de base</span>
              <span className="font-medium">{formatPrice(baseFee)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Distance {originCity} → {destinationCity} ({distance} km)
              </span>
              <span className="font-medium">{formatPrice(distanceFee)}</span>
            </div>
            
            <div>
              <div className="flex justify-between">
                <span className="text-gray-600">Véhicule : {getVehicleTypeLabel(vehicleType)}</span>
                <span className="font-medium">{distanceFee > 0 && distance > 0 ? `${formatPrice(distanceFee / distance)} /km` : '-'}</span>
              </div>
              
              {weight > 0 && (
                <div className="flex justify-between pl-4 text-xs text-gray-500">
                  <span>Poids: {weight.toLocaleString('fr-SN')} kg</span>
                  {distanceFee > 0 && weight > 0 ? (
                    <span>{(distanceFee / (distance * weight)).toFixed(2)} FCFA/kg-km</span>
                  ) : null}
                </div>
              )}
            </div>
            
            {additionalFees.length > 0 ? (
              <div className="space-y-1 pt-1">
                <span className="text-gray-600">Frais supplémentaires :</span>
                {additionalFees.map((fee, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span className="text-gray-600">{getAdditionalFeeLabel(fee.type as AdditionalFeeType)}</span>
                    <span className="font-medium">{formatPrice(fee.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-600">Frais supplémentaires</span>
                <span>Aucun</span>
              </div>
            )}
            
            {emptyReturnDiscount > 0 && (
              <div className="flex justify-between text-retourgo-green font-medium">
                <span>Réduction retour à vide ({Math.round((emptyReturnDiscount / (total + emptyReturnDiscount)) * 100)}%)</span>
                <span>-{formatPrice(emptyReturnDiscount)}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total estimé</span>
              <span className="text-retourgo-orange">{formatPrice(total)}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-retourgo-orange mr-2" />
              <span className="text-sm text-gray-600">Tarif calculé</span>
            </div>
            <span className="text-lg font-bold text-retourgo-orange">{formatPrice(total)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceEstimation;
