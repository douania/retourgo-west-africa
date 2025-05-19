
import React from "react";

interface DocumentTipsProps {
  documentType: "vehicle_registration" | "driver_license" | "id_card" | "other";
}

const DocumentTips = ({ documentType }: DocumentTipsProps) => {
  if (documentType === "vehicle_registration") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la carte grise:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que toute la carte grise est visible et bien éclairée</li>
          <li>Photographiez le recto puis le verso de la carte grise</li>
          <li>Vérifiez que les informations extraites sont correctes</li>
        </ul>
      </div>
    );
  }

  if (documentType === "driver_license") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour le permis de conduire:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que toutes les informations sont lisibles et bien éclairées</li>
          <li>Photographiez le recto puis le verso du permis</li>
          <li>Vérifiez que le numéro de permis et les catégories sont bien visibles</li>
        </ul>
      </div>
    );
  }

  if (documentType === "id_card") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la carte d'identité:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que toutes les informations sont lisibles et bien éclairées</li>
          <li>Photographiez le recto puis le verso de la carte d'identité</li>
          <li>Vérifiez que les données extraites correspondent bien à vos informations</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default DocumentTips;
