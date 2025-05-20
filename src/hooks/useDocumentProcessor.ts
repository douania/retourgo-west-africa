
import { useState } from "react";
import { useDocumentAnalysis } from "./useDocumentAnalysis";
import { useDocumentSides } from "./useDocumentSides";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentType } from "@/utils/document-utils";
import { useToast } from "@/hooks/use-toast";

interface UseDocumentProcessorProps {
  documentType: DocumentType;
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  showBothSides?: boolean;
}

export function useDocumentProcessor({
  documentType,
  onDocumentCaptured,
  showBothSides = true
}: UseDocumentProcessorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  const { currentSide, moveToBackSide: goToNextSide, resetToFrontSide: resetSides } = useDocumentSides({
    showBothSides
  });
  
  const { isProcessing, extractDocumentData } = useDocumentAnalysis({
    onSuccess: (extractedData) => {
      console.log("Document data extracted successfully:", extractedData);
      if (currentFile) {
        onDocumentCaptured(currentFile, extractedData);
        
        // If we're showing both sides and currently on the front, move to the back
        if (showBothSides && currentSide === 'front') {
          goToNextSide();
        }
        
        // Reset the current file after processing
        setCurrentFile(null);
      }
    },
    onError: (error) => {
      console.error("Document processing error:", error);
      setProcessingError(error.message);
      
      // Show error toast
      toast({
        title: "Erreur d'analyse",
        description: error.message || "Une erreur s'est produite lors de l'analyse du document",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
    setCurrentFile(file);
    // Clear any previous errors
    setProcessingError(null);
  };

  const processDocument = async () => {
    if (!currentFile) {
      console.error("No file to process");
      setProcessingError("Aucun fichier à traiter");
      return;
    }
    
    console.log("Processing document:", currentFile.name);
    console.log("Document type:", documentType);
    console.log("Current side:", currentSide);
    
    try {
      // Get the user ID if available
      const userId = user?.id;
      console.log("User authenticated:", userId ? "Yes" : "No");
      
      // Process the document with the current file
      await extractDocumentData(currentFile, documentType, userId);
    } catch (error) {
      console.error("Error in document processing:", error);
      if (error instanceof Error) {
        setProcessingError(error.message);
      } else {
        setProcessingError("Une erreur inconnue s'est produite");
      }
    }
  };

  const resetCapture = () => {
    setCurrentFile(null);
    setProcessingError(null);
    resetSides();
  };

  return {
    isProcessing,
    processingError,
    currentFile,
    currentSide,
    processDocument,
    handleFileUpload,
    resetCapture
  };
}
