
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
 * Utilise un service OCR pour extraire les données réelles
 */
export const extractDocumentData = async (file: File, documentType: DocumentType): Promise<DocumentData> => {
  try {
    // Vérifier si le fichier est une image
    if (!file.type.startsWith('image/')) {
      console.error("Le fichier n'est pas une image");
      return null;
    }

    // Pour une implémentation réelle, on utiliserait un service OCR comme Tesseract.js,
    // Google Cloud Vision, Azure Computer Vision, etc.
    
    // Exemple d'utilisation d'un service OCR externe via une API
    const formData = new FormData();
    formData.append('image', file);
    formData.append('documentType', documentType);
    
    // Note: Dans une implémentation réelle, vous remplaceriez cette URL par celle de votre API OCR
    // const response = await fetch('https://api.votreservice.com/ocr', {
    //   method: 'POST',
    //   body: formData
    // });
    
    // const result = await response.json();
    // return result.data;
    
    // Comme nous n'avons pas de service OCR réel connecté, nous allons simuler une
    // extraction basée sur l'analyse de l'image avec un message d'information
    console.log("En mode réel, l'image serait envoyée à un service OCR pour extraction");
    
    // Pour l'instant, nous retournons null pour indiquer que l'extraction automatique a échoué
    // et que l'utilisateur doit saisir les informations manuellement
    return null;
    
  } catch (error) {
    console.error("Erreur lors de l'extraction des données du document:", error);
    return null;
  }
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
