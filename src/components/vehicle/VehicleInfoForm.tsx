
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleInfo {
  plate_number: string;
  make: string;
  model: string;
  year: string;
  type: string;
  capacity: string;
}

interface VehicleInfoFormProps {
  vehicleInfo: VehicleInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehicleInfoForm = ({ vehicleInfo, handleInputChange }: VehicleInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="plate_number">Numéro d'immatriculation*</Label>
        <Input
          id="plate_number"
          name="plate_number"
          value={vehicleInfo.plate_number}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="make">Marque*</Label>
        <Input
          id="make"
          name="make"
          value={vehicleInfo.make}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">Modèle*</Label>
        <Input
          id="model"
          name="model"
          value={vehicleInfo.model}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Année</Label>
        <Input
          id="year"
          name="year"
          value={vehicleInfo.year}
          onChange={handleInputChange}
          type="number"
          min="1900"
          max={new Date().getFullYear().toString()}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Type de véhicule*</Label>
        <Input
          id="type"
          name="type"
          value={vehicleInfo.type}
          onChange={handleInputChange}
          placeholder="Ex: Camion, Van, Pickup..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacité de charge (kg)*</Label>
        <Input
          id="capacity"
          name="capacity"
          value={vehicleInfo.capacity}
          onChange={handleInputChange}
          type="number"
          min="1"
          required
        />
      </div>
    </div>
  );
};

export default VehicleInfoForm;
