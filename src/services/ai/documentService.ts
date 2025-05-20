
import { supabase } from "@/integrations/supabase/client";
import { DocumentRecognitionResponse } from "./types";

export async function analyzeDocument(
  documentBase64: string, 
  documentType: string, 
  userId: string
): Promise<DocumentRecognitionResponse> {
  console.log(`Starting document analysis for ${documentType}`);
  
  if (!documentBase64) {
    console.error("Document base64 content is empty");
    throw new Error("Document data is missing");
  }
  
  // Ensure we're only passing the base64 content without the data:image prefix
  const cleanedBase64 = documentBase64.replace(/^data:image\/[a-z]+;base64,/, "");
  console.log("Base64 content length:", cleanedBase64.length);
  
  try {
    console.log(`Calling document recognition edge function for ${documentType}`);
    console.log(`Using userId: ${userId || "demo-user"}`);
    
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
          detectFormats: ["TEXT_DETECTION", "DOCUMENT_TEXT_DETECTION"] // Use both detection types
        }
      }
    });
    
    if (error) {
      console.error("Document analysis error:", error);
      throw new Error(`Error analyzing document: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data returned from document-recognition function");
      throw new Error("No data returned from document analysis");
    }
    
    console.log("Document analysis completed successfully");
    console.log("OCR service used:", data.source || "unknown");
    console.log("Confidence score:", data.confidenceScore || "unknown");
    console.log("Extracted data:", JSON.stringify(data.extractedData || {}));
    
    return data as DocumentRecognitionResponse;
  } catch (err) {
    console.error("Failed to analyze document:", err);
    throw err;
  }
}
