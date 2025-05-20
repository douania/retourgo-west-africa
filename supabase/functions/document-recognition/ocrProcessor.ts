
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
    console.log("Hugging Face result:", result);

    // L'API renvoie généralement un résultat sous forme de texte simple
    // Nous devons l'analyser pour extraire les informations structurées
    return parseOCRText(result[0].generated_text || result.generated_text || "");
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
}
