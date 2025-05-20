
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
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { analyzeDocument } = useAIServices();
  const { user } = useAuth();

  // Fonction pour gérer le téléchargement initial du document
  const handleFileUpload = (file: File) => {
    if (showBothSides && currentSide === 'front') {
      setFrontFile(file);
      setCurrentFile(file);
      
      toast({
        title: "Recto enregistré",
        description: "Cliquez sur 'Analyser' pour extraire les informations ou photographiez le verso.",
        variant: "default"
      });
      
      return null;
    } else if (showBothSides && currentSide === 'back') {
      setCurrentFile(file);
      
      toast({
        title: "Verso enregistré",
        description: "Cliquez sur 'Analyser' pour extraire les informations des deux faces du document.",
        variant: "default"
      });
      
      return null;
    } else {
      setCurrentFile(file);
      
      toast({
        title: "Document enregistré",
        description: "Cliquez sur 'Analyser' pour extraire les informations automatiquement.",
        variant: "default"
      });
      
      return null;
    }
  };

  // Fonction pour traiter le document via OCR
  const processDocument = async () => {
    if (!currentFile) {
      toast({
        title: "Aucun document",
        description: "Veuillez d'abord télécharger un document.",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      if (showBothSides) {
        if (currentSide === 'front') {
          // Traiter le recto
          const extractedData = await extractDocumentData(currentFile, documentType);
          
          // Passer au verso après analyse du recto
          setCurrentSide('back');
          
          toast({
            title: "Recto analysé",
            description: extractedData 
              ? "Informations extraites. Veuillez maintenant photographier le verso."
              : "L'extraction automatique n'a pas fonctionné. Veuillez photographier le verso.",
          });
          
          setIsProcessing(false);
          return extractedData;
        } else {
          // Analyser le verso
          const extractedData = await extractDocumentData(currentFile, documentType);
          
          // Passer les deux fichiers + données extraites au composant parent
          if (frontFile) {
            onDocumentCaptured(frontFile, extractedData);
          }
          
          // Réinitialiser pour la prochaine capture
          setCurrentSide('front');
          setFrontFile(null);
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
          
          setIsProcessing(false);
          return extractedData;
        }
      } else {
        // Analyser un seul côté
        const extractedData = await extractDocumentData(currentFile, documentType);
        
        // Passer le fichier et les données extraites au composant parent
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
      setCurrentFile(null);
      
      if (showBothSides) {
        setCurrentSide('front');
        setFrontFile(null);
      }
      
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

      console.log("Envoi du document pour analyse OCR...");

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
    handleFileUpload,
    currentSide,
    currentFile,
    resetCapture: () => {
      setCurrentSide('front');
      setFrontFile(null);
      setCurrentFile(null);
    }
  };
}
