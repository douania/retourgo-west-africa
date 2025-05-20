
import { parseOCRText } from "./textParser.ts";

// Process text using Hugging Face Inference API
export async function processWithHuggingFace(base64Image: string) {
  console.log("Processing document with Hugging Face API");
  
  try {
    // Conversion de base64 en Blob pour l'envoi à Hugging Face
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Préparation du FormData
    const formData = new FormData();
    formData.append('file', blob, 'document.jpg');

    // Utiliser un modèle plus robuste de Hugging Face pour l'OCR
    // Tester avec plusieurs modèles pour améliorer la fiabilité
    try {
      // Essayer d'abord avec le modèle TrOCR pour les textes imprimés
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/trocr-large-printed", 
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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"
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Hugging Face TrOCR result:", result);

      // Vérifier si le résultat contient du texte
      const extractedText = result[0]?.generated_text || result.generated_text || "";
      
      if (extractedText.length < 10) {
        // Si trop peu de texte a été extrait, essayer avec un autre modèle
        throw new Error("Insufficient text detected with TrOCR model");
      }
      
      return parseOCRText(extractedText);
      
    } catch (error) {
      console.log("Trying with alternative model due to error:", error);
      
      // Essayer avec un modèle alternatif optimisé pour les documents d'identité
      const altResponse = await fetch(
        "https://api-inference.huggingface.co/models/facebook/nougat-base", 
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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"
          },
          body: formData
        }
      );

      if (!altResponse.ok) {
        throw new Error(`Alternative Hugging Face API error: ${altResponse.status}`);
      }

      const altResult = await altResponse.json();
      console.log("Alternative Hugging Face model result:", altResult);
      
      // L'API peut renvoyer différents formats selon le modèle
      const extractedText = altResult[0]?.generated_text || altResult.generated_text || "";
      
      return parseOCRText(extractedText);
    }
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
}
