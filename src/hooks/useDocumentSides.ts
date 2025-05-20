
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseDocumentSidesProps {
  showBothSides?: boolean;
}

export function useDocumentSides({ showBothSides = true }: UseDocumentSidesProps = {}) {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const { toast } = useToast();

  /**
   * Transitions to the back side after successfully processing the front
   */
  const moveToBackSide = () => {
    if (showBothSides) {
      setCurrentSide('back');
      toast({
        title: "Recto analysé",
        description: "Veuillez maintenant photographier le verso.",
      });
    }
  };

  /**
   * Transitions back to the front side and resets the front file
   */
  const resetToFrontSide = () => {
    setCurrentSide('front');
    setFrontFile(null);
  };

  /**
   * Handles a front side document
   * @param file The front side document file
   */
  const handleFrontFile = (file: File) => {
    setFrontFile(file);
    
    toast({
      title: "Recto enregistré",
      description: "Cliquez sur 'Analyser' pour extraire les informations ou photographiez le verso.",
      variant: "default"
    });
  };

  return {
    currentSide,
    frontFile,
    setFrontFile,
    moveToBackSide,
    resetToFrontSide,
    handleFrontFile,
    isShowingFront: currentSide === 'front',
    isShowingBack: currentSide === 'back'
  };
}
