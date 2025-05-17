
import React from "react";

interface DocumentTipsProps {
  documentType: "vehicle_registration" | "driver_license" | "other";
}

const DocumentTips = ({ documentType }: DocumentTipsProps) => {
  if (documentType === "vehicle_registration") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la photo de carte grise:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que tout le document est visible et bien éclairé</li>
          <li>Évitez les reflets ou les ombres sur le document</li>
          <li>Placez le document sur une surface plane de couleur unie</li>
        </ul>
      </div>
    );
  }

  if (documentType === "driver_license") {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        <p className="font-medium mb-1">Conseils pour la photo du permis:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assurez-vous que les informations sont clairement lisibles</li>
          <li>Vérifiez que la date d'expiration est visible</li>
          <li>Prenez en photo le recto et le verso du permis</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default DocumentTips;
