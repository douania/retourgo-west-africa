
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
      // Extraire les données du document en utilisant notre fonction utilitaire
      const extractedData = await extractDocumentData(file, documentType);
      
      // Passer le fichier et les données extraites au composant parent
      onDocumentCaptured(file, extractedData);
      
      // Afficher un toast de succès adapté
      if (extractedData) {
        toast({
          title: "Document analysé avec succès",
          description: "Les informations ont été extraites automatiquement. Veuillez vérifier et compléter si nécessaire.",
        });
      } else {
        toast({
          title: "Document enregistré",
          description: "L'extraction automatique a échoué. Veuillez saisir manuellement les informations.",
        });
      }
      
      return extractedData;
    } catch (error) {
      console.error("Erreur de traitement du document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors de l'analyse du document. Veuillez saisir les informations manuellement.",
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
