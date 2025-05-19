
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DriverInfo {
  full_name: string;
  license_number: string;
  license_categories: string;
  license_expiry: string;
  id_number: string;
  birth_date: string;
}

interface DriverInfoFormProps {
  driverInfo: DriverInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DriverInfoForm = ({ driverInfo, handleInputChange }: DriverInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations du conducteur</h3>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Nom complet</Label>
          <Input
            id="full_name"
            name="full_name"
            value={driverInfo.full_name}
            onChange={handleInputChange}
            placeholder="Nom complet du conducteur"
          />
        </div>
        
        <div>
          <Label htmlFor="birth_date">Date de naissance</Label>
          <Input
            id="birth_date"
            name="birth_date"
            value={driverInfo.birth_date}
            onChange={handleInputChange}
            placeholder="JJ/MM/AAAA"
          />
        </div>
        
        <div>
          <Label htmlFor="id_number">Numéro de carte d'identité</Label>
          <Input
            id="id_number"
            name="id_number"
            value={driverInfo.id_number}
            onChange={handleInputChange}
            placeholder="Numéro de la carte d'identité"
          />
        </div>
                
        <div>
          <Label htmlFor="license_number">Numéro de permis</Label>
          <Input
            id="license_number"
            name="license_number"
            value={driverInfo.license_number}
            onChange={handleInputChange}
            placeholder="Numéro du permis de conduire"
          />
        </div>

        <div>
          <Label htmlFor="license_categories">Catégories</Label>
          <Input
            id="license_categories"
            name="license_categories"
            value={driverInfo.license_categories}
            onChange={handleInputChange}
            placeholder="Ex: B, BE, C, CE"
          />
        </div>
        
        <div>
          <Label htmlFor="license_expiry">Date d'expiration</Label>
          <Input
            id="license_expiry"
            name="license_expiry"
            value={driverInfo.license_expiry}
            onChange={handleInputChange}
            placeholder="JJ/MM/AAAA"
          />
        </div>
      </div>
    </div>
  );
};

export default DriverInfoForm;
