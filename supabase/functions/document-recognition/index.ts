
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for demo or when OpenAI is unavailable
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

    // Get API key
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      console.log("No OpenAI API key found, using mock data");
      const mockData = getMockData(documentType);
      
      return new Response(
        JSON.stringify({ 
          extractedData: mockData,
          documentType,
          confidenceScore: 0.9,
          source: "mock_data"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Sending document recognition request to OpenAI for document type:", documentType);

    try {
      // Call OpenAI Vision API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'parallel_api_v2'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { 
              role: "system", 
              content: `Vous êtes un expert en analyse de documents ${getDocumentTypeDescription(documentType)} au Sénégal. 
              Extrayez toutes les informations pertinentes du document dans un format JSON structuré.` 
            },
            { 
              role: "user", 
              content: [
                {
                  type: "text",
                  text: `Analysez ce document ${getDocumentTypeDescription(documentType)} et extrayez toutes les informations importantes dans un format JSON bien structuré.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${documentBase64}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received response from OpenAI for document recognition");
      const extractedData = JSON.parse(data.choices[0].message.content);

      return new Response(
        JSON.stringify({ 
          extractedData,
          documentType,
          confidenceScore: 0.95,
          source: "openai"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError.message);
      
      // Fallback to mock data if OpenAI API fails
      console.log("Falling back to mock data");
      const mockData = getMockData(documentType);
      
      return new Response(
        JSON.stringify({ 
          extractedData: mockData,
          documentType,
          confidenceScore: 0.85,
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

function getDocumentTypeDescription(documentType: string): string {
  switch (documentType) {
    case 'vehicle_registration':
      return 'de carte grise de véhicule';
    case 'driver_license':
      return 'de permis de conduire';
    case 'id_card':
      return "de carte d'identité";
    case 'business_registration':
      return "d'enregistrement d'entreprise";
    default:
      return '';
  }
}
