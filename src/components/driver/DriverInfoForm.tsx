
import React, { useEffect } from "react";
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
  extractedData?: Record<string, any>;
}

const DriverInfoForm = ({ driverInfo, handleInputChange, extractedData }: DriverInfoFormProps) => {
  // Utiliser les données extraites pour pré-remplir le formulaire si disponibles
  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Using extracted data to populate driver form:", extractedData);
      
      // Créer un événement artificiel pour chaque champ que nous voulons mettre à jour
      const fields = [
        { name: 'full_name', value: extractedData.full_name || extractedData.nom_complet || extractedData.nom },
        { name: 'license_number', value: extractedData.license_number || extractedData.numero_permis },
        { name: 'license_categories', value: extractedData.categories || extractedData.license_categories },
        { name: 'license_expiry', value: extractedData.expiry_date || extractedData.license_expiry || extractedData.date_expiration },
        { name: 'id_number', value: extractedData.id_number || extractedData.numero_identification },
        { name: 'birth_date', value: extractedData.birth_date || extractedData.date_naissance }
      ];
      
      fields.forEach(field => {
        if (field.value) {
          const event = {
            target: {
              name: field.name,
              value: field.value
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleInputChange(event);
        }
      });
    }
  }, [extractedData, handleInputChange]);

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
      
      {extractedData && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm mt-2">
          Les données ont été extraites automatiquement du document. Veuillez vérifier et corriger si nécessaire.
        </div>
      )}
    </div>
  );
};

export default DriverInfoForm;
