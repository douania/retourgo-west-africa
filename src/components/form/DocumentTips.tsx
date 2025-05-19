
import React from "react";

interface DocumentTipsProps {
  documentType: "vehicle_registration" | "driver_license" | "other";
}

const DocumentTips = ({ documentType }: DocumentTipsProps) => {
  if (documentType === "vehicle_registration") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la carte grise:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que toute la carte grise est visible dans l'image</li>
          <li>Vérifiez les données extraites automatiquement</li>
          <li>Complétez les informations manquantes si nécessaire</li>
        </ul>
      </div>
    );
  }

  if (documentType === "driver_license") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la photo du permis:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que toutes les informations sont lisibles</li>
          <li>Vérifiez les données extraites automatiquement</li>
          <li>Confirmez que la date d'expiration est correcte</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default DocumentTips;
