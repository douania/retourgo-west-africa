
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/document-utils";
import { useAIServices } from "@/services/ai"; 
import { fileToBase64, extractBase64Content } from "@/utils/file-utils";

interface UseDocumentAnalysisProps {
  onSuccess?: (extractedData: any) => void;
  onError?: (error: Error) => void;
}

export function useDocumentAnalysis({ onSuccess, onError }: UseDocumentAnalysisProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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

    // Clear previous errors
    setLastError(null);

    // For demonstration purposes, allow document analysis even without authentication
    if (!userId) {
      console.log("No userId provided, using demo mode");
      userId = "demo-user";
    }

    setIsProcessing(true);
    console.log("Started processing document");

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const error = new Error("Le fichier doit être une image (JPG, PNG)");
        setLastError(error);
        throw error;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const error = new Error("Le fichier est trop volumineux (max 5MB)");
        setLastError(error);
        throw error;
      }

      // Convert the file to Base64
      console.log("Converting file to base64");
      console.log("Converting file to base64:", file.name);
      const base64 = await fileToBase64(file);
      
      // Extract the Base64 content without the prefix
      console.log("Extracting base64 content from data URL");
      const base64Content = extractBase64Content(base64);
      console.log("Base64 conversion complete, content length:", base64Content.length);

      console.log("Sending document for OCR analysis to AI service");

      // Increment retry count to track attempts - can help with debugging
      setRetryCount(prev => prev + 1);

      // Call the Edge Function Supabase via the AI service
      const result = await analyzeDocument(base64Content, docType, userId);

      console.log('Document analysis result received:', result);
      
      if (result && result.extractedData) {
        const extractedData = result.extractedData;
        
        // Vérifier si des données utiles ont réellement été extraites
        const hasRealData = Object.keys(extractedData).some(
          key => !key.startsWith('possible_') && 
                 !['extraction_quality', 'source', 'confidence'].includes(key) &&
                 extractedData[key] !== null && 
                 extractedData[key] !== ''
        );
        
        const hasPartialData = Object.keys(extractedData).some(
          key => key.startsWith('possible_') && extractedData[key] !== null && extractedData[key] !== ''
        );
        
        if (hasRealData) {
          console.log("Data successfully extracted:", extractedData);
          
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
            console.log("Calling onSuccess callback with data:", extractedData);
            onSuccess(extractedData);
          }
          
          return extractedData;
        } else if (hasPartialData) {
          // Des données probables ont été extraites mais pas très fiables
          console.log("Only probable data could be extracted:", extractedData);
          
          toast({
            title: "Analyse partielle",
            description: "Certaines informations ont été détectées mais peuvent être imprécises. Veuillez vérifier et corriger si nécessaire.",
            variant: "default"
          });
          
          // Créer un nouvel objet sans les préfixes "possible_"
          const cleanData = Object.entries(extractedData).reduce((acc, [key, value]) => {
            if (key.startsWith('possible_')) {
              const cleanKey = key.replace('possible_', '');
              acc[cleanKey] = value;
            } else if (!['extraction_quality', 'source', 'confidence'].includes(key)) {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string>);
          
          if (onSuccess) {
            console.log("Calling onSuccess callback with partial data:", cleanData);
            onSuccess(cleanData);
          }
          
          return cleanData;
        } else {
          console.log("No useful data could be extracted:", extractedData);
          
          // Suggestions variables
          let suggestions = "";
          const quality = parseFloat(extractedData.extraction_quality || "0");
          
          if (quality < 20) {
            suggestions = "L'image est peut-être de mauvaise qualité. Essayez avec une photo plus claire et bien cadrée.";
          } else {
            suggestions = "L'image est peut-être tournée. Essayez de la faire pivoter pour que le texte soit bien droit, puis réessayez.";
          }
          
          const error = new Error(suggestions);
          setLastError(error);
          
          toast({
            title: "Extraction échouée",
            description: suggestions,
            variant: "destructive"
          });
          
          if (onError) {
            onError(error);
          }
          
          throw error;
        }
      } else {
        console.log("No data could be extracted or result is invalid:", result);
        
        const error = new Error("L'orientation ou la qualité de l'image peut être un problème. Essayez de prendre une photo en mode portrait avec un bon éclairage.");
        setLastError(error);
        
        toast({
          title: "Extraction limitée",
          description: "L'orientation ou la qualité de l'image peut être un problème. Essayez une photo plus claire et bien cadrée.",
          variant: "default"
        });
        
        if (onError) {
          onError(error);
        }
        
        throw error;
      }
    } catch (error) {
      console.error("Error during OCR extraction:", error);
      
      // Store the error for later reference
      const processedError = error instanceof Error ? error : new Error("Une erreur inconnue est survenue");
      setLastError(processedError);
      
      toast({
        title: "Erreur d'analyse",
        description: processedError.message || "Une erreur est survenue lors de l'analyse du document.",
        variant: "destructive"
      });
      
      if (onError) {
        console.log("Calling onError callback");
        onError(processedError);
      }
      
      return null;
    } finally {
      console.log("Document processing completed");
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    lastError,
    retryCount,
    extractDocumentData
  };
}
