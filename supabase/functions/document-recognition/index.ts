
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Create a client for OpenAI
    const openAIKey = Deno.env.get("OPENAI_API_KEY") || "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";

    console.log("Sending document recognition request to OpenAI for document type:", documentType);

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
      const error = await response.json();
      console.error("OpenAI API error response:", JSON.stringify(error));
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI for document recognition");
    const extractedData = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        extractedData,
        documentType,
        confidenceScore: 0.95 // Simulated confidence score
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
