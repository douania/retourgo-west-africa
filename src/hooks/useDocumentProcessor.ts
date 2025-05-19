
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType, extractDocumentData } from "@/utils/document-utils";

interface UseDocumentProcessorProps {
  documentType: DocumentType;
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  showBothSides?: boolean; // Nouveau paramètre pour indiquer si on doit afficher les deux faces
}

export function useDocumentProcessor({ 
  documentType, 
  onDocumentCaptured, 
  showBothSides = true 
}: UseDocumentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const { toast } = useToast();

  const processDocument = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Traitement différent selon si on attend les deux faces ou non
      if (showBothSides) {
        if (currentSide === 'front') {
          // Enregistrer le fichier du recto
          setFrontFile(file);
          
          // Message pour le recto
          toast({
            title: "Recto enregistré",
            description: "Veuillez maintenant photographier le verso du document.",
          });
          
          // Passer au verso
          setCurrentSide('back');
          setIsProcessing(false);
          return null;
        } else {
          // Nous avons maintenant les deux faces, extraire les données
          // Pour une implémentation complète, on pourrait combiner les deux fichiers
          const extractedData = await extractDocumentData(file, documentType);
          
          // Passer les deux fichiers + données extraites au composant parent
          // Dans un cas réel, on pourrait fusionner les données des deux faces
          if (frontFile) {
            onDocumentCaptured(file, extractedData);
          }
          
          // Réinitialiser pour la prochaine capture
          setCurrentSide('front');
          setFrontFile(null);
          
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
          
          setIsProcessing(false);
          return extractedData;
        }
      } else {
        // Comportement normal pour un seul côté
        const extractedData = await extractDocumentData(file, documentType);
        
        // Passer le fichier et les données extraites au composant parent
        onDocumentCaptured(file, extractedData);
        
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
        
        setIsProcessing(false);
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
      setCurrentSide('front');
      setFrontFile(null);
      
      setIsProcessing(false);
      return null;
    }
  };

  return {
    isProcessing,
    processDocument,
    currentSide,
    resetCapture: () => {
      setCurrentSide('front');
      setFrontFile(null);
    }
  };
}
