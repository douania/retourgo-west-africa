
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/document-utils";
import { useAIServices } from "@/services/AIService";
import { fileToBase64, extractBase64Content } from "@/utils/file-utils";

interface UseDocumentAnalysisProps {
  onSuccess?: (extractedData: any) => void;
  onError?: (error: Error) => void;
}

export function useDocumentAnalysis({ onSuccess, onError }: UseDocumentAnalysisProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { analyzeDocument } = useAIServices();

  /**
   * Analyzes a document to extract data using OCR
   * @param file The document file to analyze
   * @param docType The type of document
   * @param userId The user ID for AI service authorization
   * @returns The extracted data or null if extraction failed
   */
  const extractDocumentData = async (file: File, docType: DocumentType, userId: string): Promise<any> => {
    console.log("extractDocumentData called with:", file.name, docType, userId);
    if (!userId) {
      console.log("No userId provided");
      toast({
        title: "Utilisateur non identifié",
        description: "Vous devez être connecté pour analyser des documents.",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    console.log("Started processing document");

    try {
      // Convert the file to Base64
      console.log("Converting file to base64");
      const base64 = await fileToBase64(file);
      
      // Extract the Base64 content without the prefix
      const base64Content = extractBase64Content(base64);
      console.log("Base64 conversion complete, content length:", base64Content.length);

      console.log("Sending document for OCR analysis to AI service");

      // Call the Edge Function Supabase via the AI service
      const result = await analyzeDocument(base64Content, docType, userId);

      console.log('Document analysis result received:', result);
      
      if (result && result.extractedData) {
        console.log("Data successfully extracted:", result.extractedData);
        onSuccess?.(result.extractedData);
        return result.extractedData;
      }
      
      console.log("No data could be extracted");
      return null;
    } catch (error) {
      console.error("Error during OCR extraction:", error);
      if (error instanceof Error) {
        onError?.(error);
      }
      return null;
    } finally {
      console.log("Document processing completed");
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    extractDocumentData
  };
}
