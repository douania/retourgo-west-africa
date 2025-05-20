
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
  
  const { data, error } = await supabase.functions.invoke('document-recognition', {
    body: { documentBase64, documentType, userId }
  });
  
  if (error) {
    console.error("Document analysis error:", error);
    throw new Error(`Error analyzing document: ${error.message}`);
  }
  
  console.log("Document analysis completed successfully");
  return data as DocumentRecognitionResponse;
}
