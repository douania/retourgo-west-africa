
export type DocumentType = "vehicle_registration" | "driver_license" | "id_card" | "other";

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

export interface IdCardData {
  id_number: string;
  full_name: string;
  birth_date: string;
  issue_date: string;
  expiry_date: string;
  nationality: string;
  address: string;
}

export interface BusinessRegistrationData {
  company_name: string;
  ninea: string;
  rc: string;
  address: string;
}

export type DocumentData = VehicleRegistrationData | DriverLicenseData | IdCardData | BusinessRegistrationData | null;

/**
 * Cette fonction est maintenant obsolète car nous utilisons directement 
 * l'OCR via l'Edge Function Supabase dans useDocumentProcessor.ts
 * Elle est conservée pour compatibilité avec l'API existante.
 */
export const extractDocumentData = async (file: File, documentType: DocumentType): Promise<DocumentData> => {
  console.warn("La fonction extractDocumentData est obsolète. Utilisez useDocumentProcessor à la place.");
  return null;
};

export const getDocumentTitle = (documentType: DocumentType, customTitle?: string): string => {
  if (customTitle) return customTitle;
  
  switch (documentType) {
    case "vehicle_registration":
      return "Carte grise du véhicule";
    case "driver_license":
      return "Permis de conduire";
    case "id_card":
      return "Carte d'identité";
    default:
      return "Document";
  }
};

export const getDocumentDescription = (documentType: DocumentType, customDescription?: string): string => {
  if (customDescription) return customDescription;
  
  switch (documentType) {
    case "vehicle_registration":
      return "Prenez en photo le recto et le verso de la carte grise";
    case "driver_license":
      return "Prenez en photo le recto et le verso du permis de conduire";
    case "id_card":
      return "Prenez en photo le recto et le verso de la carte d'identité";
    default:
      return "Prenez en photo ou téléchargez votre document";
  }
};
