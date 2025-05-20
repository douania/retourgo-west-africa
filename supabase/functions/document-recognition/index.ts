
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./cors.ts";
import { getMockData } from "./mockData.ts";
import { processWithHuggingFace } from "./ocrProcessor.ts";
import { processWithGoogleVision } from "./googleVisionProcessor.ts";

serve(async (req) => {
  console.log("Document recognition function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body");
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { documentBase64, documentType, userId, options = {} } = requestBody;
    
    console.log("Request options:", JSON.stringify(options));
    
    // Validate input with detailed logging
    if (!documentBase64) {
      console.error("Missing required field: documentBase64");
      return new Response(
        JSON.stringify({ error: 'Document data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!documentType) {
      console.error("Missing required field: documentType");
      return new Response(
        JSON.stringify({ error: 'Document type is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Allow demo mode without userId
    const effectiveUserId = userId || "demo-user";
    console.log(`Processing for user: ${effectiveUserId}`);
    console.log(`Request ID: ${options.requestId || "not provided"}`);
    console.log("Document base64 length:", documentBase64.length);
    
    // Check if the base64 string starts with the expected prefix
    const base64Prefix = documentBase64.substring(0, 20);
    console.log("Base64 prefix check:", base64Prefix);
    
    // Make sure we're dealing with a valid base64 image
    const validBase64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    let cleanedBase64 = documentBase64;
    
    // Clean up the base64 string if needed
    if (documentBase64.startsWith('data:')) {
      console.log("Cleaning base64 string to remove data URI prefix");
      cleanedBase64 = documentBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    
    // Basic validation of base64 format
    if (!validBase64Pattern.test(cleanedBase64.substring(0, 100))) {
      console.warn("Base64 data might not be in the correct format");
    }
    
    let extractedData = {};
    let ocrService = "unknown";
    let confidenceScore = 0;
    
    // Log API key availability (securely)
    const googleApiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    console.log("Google Cloud API Key available:", googleApiKey ? "Yes" : "No");
    if (googleApiKey) {
      console.log("Google Cloud API Key length:", googleApiKey.length);
      console.log("Google Cloud API Key first 5 chars:", googleApiKey.substring(0, 5) + "...");
    } else {
      console.error("CRITICAL ERROR: Google Cloud API Key is not configured!");
    }
    
    // Determine which OCR service to try first
    const preferredOcr = options?.preferredOcr || "googleVision"; // Default to Google Vision
    
    try {
      // Try Google Vision API first if specified or auto
      if (preferredOcr === "googleVision" || preferredOcr === "auto") {
        console.log("Using Google Cloud Vision API as primary OCR service");
        
        try {
          if (!googleApiKey) {
            console.error("Google Cloud API Key is not configured");
            throw new Error("Google Cloud API Key is not configured");
          }
          
          console.log("Calling Google Vision processor with options");
          const googleResult = await processWithGoogleVision(cleanedBase64, documentType, options);
          console.log("Google Vision API returned result");
          
          if (!googleResult || !googleResult.data) {
            console.error("Google Vision API returned empty result");
            throw new Error("Empty result from Google Vision API");
          }
          
          extractedData = googleResult.data;
          confidenceScore = googleResult.confidence || 0.8;
          ocrService = "google_vision";
          console.log("Successfully extracted data with Google Vision API");
          
          // If rawText is returned and options request it, include it in response
          if (googleResult.rawText && options.rawTextOutput) {
            console.log("Including full raw text in response");
            extractedData.raw_detected_text = googleResult.rawText;
          }
        } catch (googleError) {
          console.error("Google Vision API error:", googleError.message);
          console.error("Error details:", googleError);
          
          // Only throw if Google was explicitly requested
          if (preferredOcr === "googleVision") {
            throw googleError;
          }
          
          // Otherwise fall back to Hugging Face
          console.log("Falling back to Hugging Face");
          const huggingFaceResult = await processWithHuggingFace(cleanedBase64, options);
          extractedData = huggingFaceResult;
          ocrService = "huggingface";
          confidenceScore = 0.6;
        }
      } else {
        // Use Hugging Face as first choice
        console.log("Using Hugging Face OCR");
        extractedData = await processWithHuggingFace(cleanedBase64, options);
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
            ocr_service: "mock_data",
            error_reason: error.message
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
