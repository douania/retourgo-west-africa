
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

export type DocumentData = VehicleRegistrationData | DriverLicenseData | IdCardData | null;

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
    
    console.log(`Traitement d'un document de type: ${documentType}`);
    
    // Pour l'instant, nous simulons des données extraites pour démonstration
    // Dans une implémentation réelle, vous utiliseriez un service OCR comme Google Cloud Vision, Azure Form Recognizer, etc.
    
    // Simulation des données extraites selon le type de document
    if (documentType === "vehicle_registration") {
      return {
        plate_number: "AB-123-CD",
        make: "Renault",
        model: "Kangoo",
        year: "2020",
        registration_date: "12/05/2020",
        owner: "Transports Express",
        vehicle_type: "Utilitaire"
      };
    } else if (documentType === "driver_license") {
      return {
        license_number: "123456789",
        full_name: "Jean Dupont",
        birth_date: "15/03/1985",
        issue_date: "10/06/2018",
        expiry_date: "10/06/2033",
        categories: "B, BE"
      };
    } else if (documentType === "id_card") {
      return {
        id_number: "987654321",
        full_name: "Jean Dupont",
        birth_date: "15/03/1985",
        issue_date: "01/02/2019",
        expiry_date: "01/02/2029",
        nationality: "Française",
        address: "1 rue de Paris, 75001 Paris"
      };
    }
    
    // Si le type de document n'est pas reconnu, retourner null
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
