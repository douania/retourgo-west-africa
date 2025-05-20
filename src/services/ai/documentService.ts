
import { supabase } from "@/integrations/supabase/client";
import { DocumentRecognitionResponse } from "./types";

export async function analyzeDocument(
  documentBase64: string, 
  documentType: string, 
  userId: string
): Promise<DocumentRecognitionResponse> {
  console.log("Calling document analysis with userId:", userId);
  console.log("Document content length:", documentBase64.length);
  console.log("Document type:", documentType);
  
  // Send additional parameters to help with processing
  const { data, error } = await supabase.functions.invoke('document-recognition', {
    body: { 
      documentBase64, 
      documentType, 
      userId,
      options: {
        preferredOcr: "googleVision", // Request Google Vision API as preferred OCR
        tryAllOrientations: true,     // Try all possible orientations
        enhanceImage: true,           // Request image enhancement if needed
        documentCountry: "senegal"    // Specify the document's country
      }
    }
  });
  
  if (error) {
    console.error("Document analysis error:", error);
    throw new Error(`Error analyzing document: ${error.message}`);
  }
  
  console.log("Document analysis completed successfully");
  return data as DocumentRecognitionResponse;
}
