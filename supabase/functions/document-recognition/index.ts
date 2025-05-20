
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for demo or when APIs are unavailable
const getMockData = (documentType: string) => {
  switch (documentType) {
    case 'id_card':
      return {
        full_name: "Moustapha Diop",
        id_number: "123456789",
        birth_date: "15/04/1985",
        nationality: "Sénégalaise",
        address: "123 Rue de Dakar, Sénégal"
      };
    case 'driver_license':
      return {
        full_name: "Amadou Sow",
        license_number: "SN45678901",
        categories: "B, BE",
        expiry_date: "25/06/2025",
        issue_date: "25/06/2020"
      };
    case 'vehicle_registration':
      return {
        plate_number: "DK-234-AB",
        make: "Toyota",
        model: "Hilux",
        year: "2020",
        owner: "Samba Ndiaye",
        vehicle_type: "Pickup"
      };
    case 'business_registration':
      return {
        company_name: "Transport Sénégal SARL",
        ninea: "SN98765432",
        rc: "RC-DAK-2018-B-12345",
        address: "45 Avenue de la République, Dakar"
      };
    default:
      return {};
  }
};

// Process text using Hugging Face Inference API
async function processWithHuggingFace(base64Image: string) {
  console.log("Processing document with Hugging Face API");
  
  try {
    // Conversion de base64 en Blob pour l'envoi à Hugging Face
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Préparation du FormData
    const formData = new FormData();
    formData.append('file', blob, 'document.jpg');

    // Utiliser un modèle plus robuste de Hugging Face pour l'OCR
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/trocr-large-printed", 
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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"
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Hugging Face result:", result);

    // L'API renvoie généralement un résultat sous forme de texte simple
    // Nous devons l'analyser pour extraire les informations structurées
    return parseOCRText(result[0].generated_text || result.generated_text || "");
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
}

// Fonction améliorée pour analyser le texte OCR et extraire des informations structurées
function parseOCRText(text: string) {
  console.log("Parsing OCR text:", text);
  const extractedData: Record<string, string> = {};
  
  // Recherche de patterns courants dans les documents d'identité
  const nameMatch = text.match(/(?:nom|name|pr[eé]nom|full[-\s]?name)(?:\s*et\s*pr[eé]nom)?s?\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nameMatch && nameMatch[1]) extractedData.full_name = nameMatch[1].trim();
  
  const idMatch = text.match(/(?:carte|num[eé]ro|n°)(?:\s*nationale)?(?:\s*d['']identit[eé])?\s*:?\s*(\w+)/i);
  if (idMatch && idMatch[1]) extractedData.id_number = idMatch[1].trim();
  
  const birthMatch = text.match(/(?:n[eé][e]? le|date de naissance)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{1,2}\s+[a-zÀ-ÖØ-öø-ÿ]+\s+\d{2,4})/i);
  if (birthMatch && birthMatch[1]) extractedData.birth_date = birthMatch[1].trim();
  
  const addressMatch = text.match(/(?:adresse|domicil[e|ié]|r[eé]sid[e|ant])\s*:?\s*([^,\.]{3,}[^\n]*)/i);
  if (addressMatch && addressMatch[1]) extractedData.address = addressMatch[1].trim();
  
  const nationalityMatch = text.match(/nationalit[eé]\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nationalityMatch && nationalityMatch[1]) extractedData.nationality = nationalityMatch[1].trim();
  
  // Recherche de patterns pour les permis de conduire
  const licenseNumMatch = text.match(/(?:permis|num[eé]ro|license)\s*:?\s*(\w+)/i);
  if (licenseNumMatch && licenseNumMatch[1]) extractedData.license_number = licenseNumMatch[1].trim();
  
  const categoryMatch = text.match(/(?:cat[eé]gories?|cat)\s*:?\s*([A-Z,\s]+)/i);
  if (categoryMatch && categoryMatch[1]) extractedData.categories = categoryMatch[1].trim();
  
  const expiryMatch = text.match(/(?:expir[eé]|valable jusqu[']au)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i);
  if (expiryMatch && expiryMatch[1]) extractedData.expiry_date = expiryMatch[1].trim();
  
  // Si aucune information n'a été extraite, renvoyer un objet vide
  if (Object.keys(extractedData).length === 0) {
    console.log("No data could be extracted from OCR text");
  } else {
    console.log("Extracted data from OCR text:", extractedData);
  }
  
  return extractedData;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentBase64, documentType, userId } = await req.json();
    
    // Validate input
    if (!documentBase64) {
      throw new Error('Document data is required');
    }
    
    if (!documentType) {
      throw new Error('Document type is required');
    }

    // Allow demo mode without userId
    if (!userId) {
      console.log("No userId provided, using demo mode");
    }

    console.log("Processing document:", documentType);

    try {
      // First try with Hugging Face API
      const extractedData = await processWithHuggingFace(documentBase64);
      
      // If empty result, fall back to mock data
      if (Object.keys(extractedData).length === 0) {
        console.log("No data extracted from Hugging Face, falling back to mock data");
        const mockData = getMockData(documentType);
        
        return new Response(
          JSON.stringify({ 
            extractedData: mockData,
            documentType,
            confidenceScore: 0.5,
            source: "mock_data"
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("Successfully extracted data with Hugging Face:", extractedData);
      
      return new Response(
        JSON.stringify({ 
          extractedData,
          documentType,
          confidenceScore: 0.8,
          source: "huggingface_ocr"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (error) {
      console.error("Hugging Face API error:", error.message);
      
      // Fall back to mock data if Hugging Face fails
      console.log("Falling back to mock data");
      const mockData = getMockData(documentType);
      
      return new Response(
        JSON.stringify({ 
          extractedData: mockData,
          documentType,
          confidenceScore: 0.5,
          source: "mock_data_fallback"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
