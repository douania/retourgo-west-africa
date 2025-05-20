
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/utils/document-utils";
import { useAIServices } from "@/services/AIService";
import { useAuth } from "@/contexts/AuthContext";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { analyzeDocument } = useAIServices();
  const { user } = useAuth();

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
          // Nous avons maintenant les deux faces, réaliser l'OCR avec la face arrière
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
        // Comportement normal pour un seul côté - appliquer l'OCR
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

  // Fonction pour extraire les données du document via OCR
  const extractDocumentData = async (file: File, docType: DocumentType) => {
    if (!user) return null;

    try {
      // Convertir le fichier en Base64
      const base64 = await fileToBase64(file);

      // Extraire le contenu Base64 sans le préfixe data:image/...
      const base64Content = base64.split(',')[1];

      // Appeler l'Edge Function Supabase via le service AI
      const result = await analyzeDocument(base64Content, docType, user.id);

      console.log('Document analysis result:', result);
      
      if (result && result.extractedData) {
        return result.extractedData;
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de l'extraction OCR:", error);
      return null;
    }
  };

  // Fonction utilitaire pour convertir un fichier en Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
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
