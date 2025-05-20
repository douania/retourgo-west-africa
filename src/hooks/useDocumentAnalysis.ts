
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
  const extractDocumentData = async (file: File, docType: DocumentType, userId?: string): Promise<any> => {
    console.log("extractDocumentData called with:", file.name, docType, userId || "no userId");

    // For demonstration purposes, allow document analysis even without authentication
    // In production, you would want to enforce authentication
    if (!userId) {
      console.log("No userId provided, using demo mode");
      userId = "demo-user";
    }

    setIsProcessing(true);
    console.log("Started processing document");

    try {
      // Convert the file to Base64
      console.log("Converting file to base64");
      console.log("Converting file to base64:", file.name);
      const base64 = await fileToBase64(file);
      
      // Extract the Base64 content without the prefix
      console.log("Extracting base64 content from data URL");
      const base64Content = extractBase64Content(base64);
      console.log("Base64 conversion complete, content length:", base64Content.length);

      console.log("Sending document for OCR analysis to AI service");

      // Call the Edge Function Supabase via the AI service
      const result = await analyzeDocument(base64Content, docType, userId);

      console.log('Document analysis result received:', result);
      
      if (result && result.extractedData) {
        console.log("Data successfully extracted:", result.extractedData);
        
        // Check if the data is coming from mock source, safely accessing the source property
        if (result.source && result.source.includes('mock')) {
          console.log("Warning: Using mock data instead of real OCR results");
          toast({
            title: "Mode démo activé",
            description: "Des données fictives sont utilisées pour la démonstration. Pour utiliser la reconnaissance réelle, réessayez avec une image plus claire.",
            variant: "default"
          });
        } else {
          // Success with real data
          toast({
            title: "Document analysé",
            description: "Les informations ont été extraites avec succès du document.",
          });
        }
        
        if (onSuccess) {
          console.log("Calling onSuccess callback with data:", result.extractedData);
          onSuccess(result.extractedData);
        }
        
        return result.extractedData;
      } else {
        console.log("No data could be extracted or result is invalid:", result);
        
        toast({
          title: "Extraction limitée",
          description: "Veuillez essayer avec une image plus claire ou saisir les données manuellement.",
          variant: "default"
        });
      }
      
      console.log("No data could be extracted");
      return null;
    } catch (error) {
      console.error("Error during OCR extraction:", error);
      if (error instanceof Error) {
        toast({
          title: "Erreur d'analyse",
          description: error.message || "Une erreur est survenue lors de l'analyse du document.",
          variant: "destructive"
        });
        
        if (onError) {
          console.log("Calling onError callback");
          onError(error);
        }
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
