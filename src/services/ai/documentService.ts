
import { supabase } from "@/integrations/supabase/client";
import { DocumentRecognitionResponse } from "./types";

export async function analyzeDocument(
  documentBase64: string, 
  documentType: string, 
  userId: string
): Promise<DocumentRecognitionResponse> {
  console.log(`Starting document analysis for ${documentType}`);
  console.log("Using userId:", userId || "demo-user");
  
  if (!documentBase64) {
    console.error("Document base64 content is empty");
    throw new Error("Document data is missing");
  }
  
  // Ensure we're passing the base64 content correctly
  let cleanedBase64 = documentBase64;
  
  // Check if the base64 string includes a data:image prefix
  if (documentBase64.startsWith('data:image/')) {
    console.log("Removing data:image prefix from base64 content");
    cleanedBase64 = documentBase64.replace(/^data:image\/[a-z]+;base64,/, "");
  }
  
  console.log("Base64 content length:", cleanedBase64.length);
  console.log("Base64 format check (first 20 chars):", cleanedBase64.substring(0, 20));
  
  try {
    console.log("Calling document recognition edge function");
    
    // Add timestamp to help identify the request in logs
    const requestTimestamp = new Date().toISOString();
    console.log("Request timestamp:", requestTimestamp);
    
    // Send additional parameters to help with processing
    const { data, error } = await supabase.functions.invoke('document-recognition', {
      body: { 
        documentBase64: cleanedBase64, 
        documentType, 
        userId,
        options: {
          preferredOcr: "googleVision", // Force using Google Vision API
          tryAllOrientations: true,     // Try all possible orientations
          enhanceImage: true,           // Request image enhancement if needed
          documentCountry: "senegal",   // Specify the document's country
          useHighResolution: true,      // Request high resolution processing
          detectFormats: ["TEXT_DETECTION", "DOCUMENT_TEXT_DETECTION"], // Use both detection types
          debugMode: true,              // Enable additional debugging logs
          requestId: requestTimestamp   // Help trace this specific request
        }
      }
    });
    
    if (error) {
      console.error("Document analysis error from edge function:", error);
      // Try to get more details about what went wrong
      if (error.message?.includes("Google")) {
        console.error("Google Vision API error detected");
      }
      throw new Error(`Error analyzing document: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data returned from document-recognition function");
      throw new Error("No data returned from document analysis");
    }
    
    console.log("Document analysis completed successfully");
    console.log("OCR service used:", data.source || "unknown");
    console.log("Confidence score:", data.confidenceScore || "unknown");
    
    // Log a sample of extracted data
    const extractedDataSample = { ...data.extractedData };
    if (extractedDataSample.raw_detected_text) {
      extractedDataSample.raw_detected_text = 
        extractedDataSample.raw_detected_text.substring(0, 100) + "...";
    }
    console.log("Extracted data sample:", JSON.stringify(extractedDataSample || {}));
    
    return data as DocumentRecognitionResponse;
  } catch (err) {
    console.error("Failed to analyze document:", err);
    throw err;
  }
}
