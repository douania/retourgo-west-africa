
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./cors.ts";
import { getMockData } from "./mockData.ts";
import { processWithHuggingFace } from "./ocrProcessor.ts";

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
