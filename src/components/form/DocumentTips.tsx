
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
          <li>L'extraction automatique des données est en cours de développement</li>
          <li>Veuillez vérifier et compléter les informations du véhicule manuellement</li>
          <li>Assurez-vous que les informations saisies correspondent à la carte grise</li>
        </ul>
      </div>
    );
  }

  if (documentType === "driver_license") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la photo du permis:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>L'extraction automatique des données est en cours de développement</li>
          <li>Veuillez vérifier et compléter les informations du permis manuellement</li>
          <li>Assurez-vous que la date d'expiration est visible</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default DocumentTips;
