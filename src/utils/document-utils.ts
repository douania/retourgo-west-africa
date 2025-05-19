
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
 * Actuellement implémenté comme une fonction simulée
 */
export const extractDocumentData = async (file: File, documentType: DocumentType): Promise<DocumentData> => {
  // Simuler le traitement avec délai
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Vérifier si le fichier est bien une image
  if (!file.type.startsWith('image/')) {
    console.error("Le fichier n'est pas une image");
    return null;
  }
  
  // Simulation d'extraction de données OCR par type de document
  if (documentType === "vehicle_registration") {
    // Renvoyer des données simulées pour la carte grise
    return {
      plate_number: "AA-123-BB",
      make: "Renault",
      model: "Kangoo",
      year: "2020",
      registration_date: "15/06/2020",
      owner: "RetourGo Transport",
      vehicle_type: "Utilitaire"
    };
  } 
  
  if (documentType === "driver_license") {
    // Données simulées pour le permis de conduire
    return {
      license_number: "12AB3456789",
      full_name: "Jean Dupont",
      birth_date: "01/01/1985",
      issue_date: "01/01/2018",
      expiry_date: "01/01/2033",
      categories: "B, C"
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
