
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/document-utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentAnalysis } from "./useDocumentAnalysis";
import { useDocumentSides } from "./useDocumentSides";

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
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use the smaller, focused hooks
  const { 
    currentSide, 
    frontFile, 
    handleFrontFile, 
    moveToBackSide, 
    resetToFrontSide, 
    isShowingFront, 
    isShowingBack 
  } = useDocumentSides({ showBothSides });
  
  const { 
    isProcessing, 
    extractDocumentData 
  } = useDocumentAnalysis({
    // Always call onDocumentCaptured with the extracted data
    onSuccess: (data) => {
      console.log("Document analysis successful with data:", data);
      if (currentFile) {
        // Pass the extracted data to the parent component
        onDocumentCaptured(currentFile, data);
        
        toast({
          title: "Document analysé avec succès",
          description: "Les informations ont été extraites et les champs du formulaire ont été remplis automatiquement.",
        });
      }
    },
    onError: (error) => {
      console.error("Document analysis error:", error);
      // We'll still capture the document even if analysis failed
      if (currentFile) {
        onDocumentCaptured(currentFile, null);
        
        toast({
          title: "Erreur d'analyse",
          description: "Les informations n'ont pas pu être extraites automatiquement. Veuillez remplir les champs manuellement.",
          variant: "destructive"
        });
      }
    }
  });

  // Handle file upload
  const handleFileUpload = (file: File) => {
    console.log("File uploaded to useDocumentProcessor:", file.name);
    if (showBothSides && isShowingFront) {
      handleFrontFile(file);
      setCurrentFile(file);
    } else if (showBothSides && isShowingBack) {
      setCurrentFile(file);
      
      toast({
        title: "Verso enregistré",
        description: "Cliquez sur 'Analyser' pour extraire les informations des deux faces du document.",
        variant: "default"
      });
    } else {
      setCurrentFile(file);
      
      toast({
        title: "Document enregistré",
        description: "Cliquez sur 'Analyser' pour extraire les informations automatiquement.",
        variant: "default"
      });
    }
  };

  // Process document via OCR
  const processDocument = async () => {
    console.log("processDocument called in useDocumentProcessor, currentFile:", currentFile?.name || "null");
    console.log("Current user:", user?.id || "not authenticated");
    
    if (!currentFile) {
      console.log("No document file found");
      toast({
        title: "Aucun document",
        description: "Veuillez d'abord télécharger un document.",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log("Starting document processing...");
      if (showBothSides) {
        if (isShowingFront) {
          console.log("Processing front side");
          // Process the front side
          const extractedData = await extractDocumentData(currentFile, documentType, user?.id);
          console.log("Front side data extracted:", extractedData);
          
          // Move to back side after front side analysis
          moveToBackSide();
          
          toast({
            title: "Recto analysé",
            description: "Veuillez maintenant photographier le verso.",
          });
          
          return extractedData;
        } else {
          console.log("Processing back side");
          // Analyze the back side
          const extractedData = await extractDocumentData(currentFile, documentType, user?.id);
          console.log("Back side data extracted, combined data:", extractedData);
          
          // Pass both files + extracted data to parent component
          if (frontFile) {
            console.log("Calling onDocumentCaptured with front file and data");
            onDocumentCaptured(frontFile, extractedData);
          }
          
          // Reset for next capture
          resetToFrontSide();
          setCurrentFile(null);
          
          return extractedData;
        }
      } else {
        console.log("Processing single-sided document");
        // Analyze a single side
        const extractedData = await extractDocumentData(currentFile, documentType, user?.id);
        console.log("Single-sided document data extracted:", extractedData);
        
        // Pass the file and extracted data to parent component
        console.log("Calling onDocumentCaptured with file and data for single-sided doc");
        onDocumentCaptured(currentFile, extractedData);
        
        // Reset the current file
        setCurrentFile(null);
        
        return extractedData;
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors de l'analyse du document. Veuillez saisir les informations manuellement.",
        variant: "destructive"
      });
      
      // Reset state
      setCurrentFile(null);
      
      if (showBothSides) {
        resetToFrontSide();
      }
      
      return null;
    }
  };

  return {
    isProcessing,
    processDocument,
    handleFileUpload,
    currentSide,
    currentFile,
    resetCapture: () => {
      resetToFrontSide();
      setCurrentFile(null);
    }
  };
}
