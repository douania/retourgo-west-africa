
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./cors.ts";
import { getMockData } from "./mockData.ts";
import { processWithHuggingFace } from "./ocrProcessor.ts";
import { processWithGoogleVision } from "./googleVisionProcessor.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentBase64, documentType, userId, options = {} } = await req.json();
    
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
    console.log("Processing options:", JSON.stringify(options));
    
    let extractedData = {};
    let ocrService = "unknown";
    let confidenceScore = 0;
    
    // Determine which OCR service to try first
    const preferredOcr = options?.preferredOcr || "googleVision"; // Default to Google Vision
    
    try {
      // Try Google Vision API first if specified or auto
      if (preferredOcr === "googleVision" || preferredOcr === "auto") {
        console.log("Using Google Cloud Vision API as primary OCR service");
        
        try {
          const googleResult = await processWithGoogleVision(documentBase64, documentType, options);
          extractedData = googleResult.data;
          confidenceScore = googleResult.confidence || 0.8;
          ocrService = "google_vision";
          console.log("Successfully extracted data with Google Vision API");
        } catch (googleError) {
          console.error("Google Vision API error:", googleError.message);
          
          // Only throw if Google was explicitly requested
          if (preferredOcr === "googleVision") {
            throw googleError;
          }
          
          // Otherwise fall back to Hugging Face
          console.log("Falling back to Hugging Face");
          const huggingFaceResult = await processWithHuggingFace(documentBase64, options);
          extractedData = huggingFaceResult;
          ocrService = "huggingface";
          confidenceScore = 0.6;
        }
      } else {
        // Use Hugging Face as first choice
        console.log("Using Hugging Face OCR");
        extractedData = await processWithHuggingFace(documentBase64, options);
        ocrService = "huggingface";
        confidenceScore = 0.6;
      }
      
      // Add OCR service information to the extracted data
      extractedData = {
        ...extractedData,
        ocr_service: ocrService
      };
      
      // If we got meaningful data, return it
      if (Object.keys(extractedData).length > 1) {
        console.log("Successfully extracted data with OCR");
        
        return new Response(
          JSON.stringify({ 
            extractedData,
            documentType,
            confidenceScore,
            source: ocrService
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If no data was extracted, fall back to mock data
      console.log("No data extracted from OCR services, falling back to mock data");
      throw new Error("OCR extraction failed");
      
    } catch (error) {
      console.error("OCR processing error:", error.message);
      
      // Fall back to mock data if all OCR services fail
      console.log("Falling back to mock data");
      const mockData = getMockData(documentType);
      
      return new Response(
        JSON.stringify({ 
          extractedData: {
            ...mockData,
            ocr_service: "mock_data"
          },
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
