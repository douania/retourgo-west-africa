
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType, extractDocumentData } from "@/utils/document-utils";

interface UseDocumentProcessorProps {
  documentType: DocumentType;
  onDocumentCaptured: (file: File, extractedData?: any) => void;
}

export function useDocumentProcessor({ documentType, onDocumentCaptured }: UseDocumentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processDocument = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Extract document data using our utility function
      const extractedData = await extractDocumentData(file, documentType);
      
      // Pass the file and extracted data to the parent component
      onDocumentCaptured(file, extractedData);
      
      // Show success toast
      toast({
        title: "Document traité",
        description: extractedData ? "Les informations ont été extraites avec succès." : "Le document a été enregistré.",
      });
      
      return extractedData;
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du document.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processDocument
  };
}
