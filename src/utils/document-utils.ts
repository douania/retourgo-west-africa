
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
 * Simulates extracting data from a document image
 * In a real implementation, this would call an OCR service
 */
export const extractDocumentData = async (file: File, documentType: DocumentType): Promise<DocumentData> => {
  // Simulate processing with timeout
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (documentType === "vehicle_registration") {
    return {
      plate_number: "1234 ABC 75",
      make: "TOYOTA",
      model: "HILUX",
      year: "2018",
      registration_date: "15/06/2018",
      owner: "NOM PRÉNOM",
      vehicle_type: "PICKUP"
    };
  } 
  
  if (documentType === "driver_license") {
    return {
      license_number: "12345678",
      full_name: "NOM PRÉNOM",
      birth_date: "01/01/1980",
      issue_date: "01/01/2020",
      expiry_date: "01/01/2025",
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
      return "Prenez en photo la carte grise pour enregistrer automatiquement les informations du véhicule";
    case "driver_license":
      return "Prenez en photo votre permis de conduire pour valider votre compte transporteur";
    default:
      return "Prenez en photo ou téléchargez votre document";
  }
};
