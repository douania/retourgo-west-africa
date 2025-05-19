
export type DocumentType = "vehicle_registration" | "driver_license" | "other";

export interface VehicleRegistrationData {
  plate_number: string;
  make: string;
  model: string;
  year: string;
  registration_date: string;
  owner: string;
  vehicle_type: string;
}

export interface DriverLicenseData {
  license_number: string;
  full_name: string;
  birth_date: string;
  issue_date: string;
  expiry_date: string;
  categories: string;
}

export type DocumentData = VehicleRegistrationData | DriverLicenseData | null;

/**
 * Extrait les données à partir d'une image de document
 * Actuellement implémenté comme une fonction simulée avec validation basique
 */
export const extractDocumentData = async (file: File, documentType: DocumentType): Promise<DocumentData> => {
  // Simuler le traitement avec délai
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Vérifier si le fichier est bien une image
  if (!file.type.startsWith('image/')) {
    console.error("Le fichier n'est pas une image");
    return null;
  }
  
  // Dans une implémentation réelle, nous appellerions ici un service d'OCR
  
  // Pour l'instant, indiquer clairement qu'il s'agit de données d'exemple
  if (documentType === "vehicle_registration") {
    // Retourner null pour forcer l'utilisateur à saisir les informations manuellement
    return null;
  } 
  
  if (documentType === "driver_license") {
    // Données d'exemple pour le permis de conduire
    return {
      license_number: "[Numéro à saisir]",
      full_name: "[Nom à saisir]",
      birth_date: "[Date à saisir]",
      issue_date: "[Date à saisir]",
      expiry_date: "[Date à saisir]",
      categories: "[Catégories à saisir]"
    };
  }
  
  return null;
};

export const getDocumentTitle = (documentType: DocumentType, customTitle?: string): string => {
  if (customTitle) return customTitle;
  
  switch (documentType) {
    case "vehicle_registration":
      return "Carte grise du véhicule";
    case "driver_license":
      return "Permis de conduire";
    default:
      return "Document";
  }
};

export const getDocumentDescription = (documentType: DocumentType, customDescription?: string): string => {
  if (customDescription) return customDescription;
  
  switch (documentType) {
    case "vehicle_registration":
      return "Prenez en photo la carte grise ou saisissez manuellement les informations du véhicule";
    case "driver_license":
      return "Prenez en photo votre permis de conduire pour valider votre compte transporteur";
    default:
      return "Prenez en photo ou téléchargez votre document";
  }
};
