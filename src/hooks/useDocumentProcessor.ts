
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
    onSuccess: (data) => {
      console.log("Document analysis successful:", data);
    },
    onError: (error) => {
      console.error("Document analysis error:", error);
    }
  });

  // Fonction pour gérer le téléchargement initial du document
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

  // Fonction pour traiter le document via OCR
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

    // Check for authentication
    if (!user || !user.id) {
      console.log("No authenticated user found");
      toast({
        title: "Utilisateur non identifié",
        description: "Vous devez être connecté pour analyser des documents.",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log("Starting document processing...");
      if (showBothSides) {
        if (isShowingFront) {
          console.log("Processing front side");
          // Traiter le recto
          const extractedData = await extractDocumentData(currentFile, documentType, user.id);
          
          // Passer au verso après analyse du recto
          moveToBackSide();
          
          toast({
            title: "Recto analysé",
            description: "Veuillez maintenant photographier le verso.",
          });
          
          return extractedData;
        } else {
          console.log("Processing back side");
          // Analyser le verso
          const extractedData = await extractDocumentData(currentFile, documentType, user.id);
          
          // Passer les deux fichiers + données extraites au composant parent
          if (frontFile) {
            console.log("Calling onDocumentCaptured with front file and data");
            onDocumentCaptured(frontFile, extractedData);
          }
          
          // Réinitialiser pour la prochaine capture
          resetToFrontSide();
          setCurrentFile(null);
          
          // Afficher le toast de succès
          if (extractedData) {
            toast({
              title: "Document analysé avec succès",
              description: "Les informations ont été extraites automatiquement. Veuillez vérifier et compléter si nécessaire.",
            });
          } else {
            toast({
              title: "Document enregistré",
              description: "L'extraction automatique n'a pas fonctionné. Veuillez saisir manuellement les informations.",
              variant: "default"
            });
          }
          
          return extractedData;
        }
      } else {
        console.log("Processing single-sided document");
        // Analyser un seul côté
        const extractedData = await extractDocumentData(currentFile, documentType, user.id);
        
        // Passer le fichier et les données extraites au composant parent
        console.log("Calling onDocumentCaptured with file and data for single-sided doc");
        onDocumentCaptured(currentFile, extractedData);
        
        // Réinitialiser le fichier courant
        setCurrentFile(null);
        
        // Afficher un toast adapté au résultat de l'extraction
        if (extractedData) {
          toast({
            title: "Document analysé avec succès",
            description: "Les informations ont été extraites automatiquement. Veuillez vérifier et compléter si nécessaire.",
          });
        } else {
          toast({
            title: "Document enregistré",
            description: "L'extraction automatique n'a pas fonctionné. Veuillez saisir manuellement les informations.",
            variant: "default"
          });
        }
        
        return extractedData;
      }
    } catch (error) {
      console.error("Erreur de traitement du document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors de l'analyse du document. Veuillez saisir les informations manuellement.",
        variant: "destructive"
      });
      
      // Réinitialiser l'état
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
