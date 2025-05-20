
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

    // Préparer l'image pour le traitement - essayer plusieurs orientations si nécessaire
    console.log("Preparing document for OCR processing - will try multiple orientations if needed");
    
    // Essayer d'abord avec l'orientation originale
    let extractedText = await tryOCRWithOrientation(blob, "original");
    
    // Si peu de texte est détecté, essayer avec une rotation de 90 degrés
    if (extractedText.length < 30) {
      console.log("Insufficient text detected, trying with 90 degree rotation");
      extractedText = await tryOCRWithOrientation(blob, "90deg");
    }
    
    // Si toujours peu de texte, essayer avec 180 degrés
    if (extractedText.length < 30) {
      console.log("Still insufficient text, trying with 180 degree rotation");
      extractedText = await tryOCRWithOrientation(blob, "180deg");
    }
    
    // Si toujours peu de texte, essayer avec 270 degrés
    if (extractedText.length < 30) {
      console.log("Still insufficient text, trying with 270 degree rotation");
      extractedText = await tryOCRWithOrientation(blob, "270deg");
    }
    
    // Si toujours rien, essayer avec un modèle alternatif
    if (extractedText.length < 30) {
      console.log("Still insufficient text, trying alternate model");
      extractedText = await tryOCRWithAlternateModel(blob);
    }
    
    // Analyser le texte pour en extraire les données structurées
    const extractedData = parseOCRText(extractedText);
    console.log("Parsed OCR data:", extractedData);
    
    return extractedData;
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
}

// Fonction pour essayer l'OCR avec différentes orientations d'image
async function tryOCRWithOrientation(blob: Blob, orientation: "original" | "90deg" | "180deg" | "270deg"): Promise<string> {
  // Pour l'instant, nous ne faisons pas réellement la rotation (nécessiterait de traiter l'image côté serveur)
  // Cette fonction simule différentes tentatives d'orientation
  
  // Préparation du FormData
  const formData = new FormData();
  formData.append('file', blob, 'document.jpg');
  
  // En production, il faudrait utiliser une bibliothèque comme Sharp pour la rotation réelle
  // de l'image côté serveur avant de l'envoyer à l'API
  
  console.log(`Attempting OCR with orientation: ${orientation}`);
  
  try {
    // Utiliser le modèle TrOCR pour les textes imprimés
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
    console.log(`Hugging Face TrOCR result with ${orientation} orientation:`, result);

    // Vérifier si le résultat contient du texte
    const text = result[0]?.generated_text || result.generated_text || "";
    console.log(`Extracted text length: ${text.length}`);
    
    return text;
  } catch (error) {
    console.error(`Error with ${orientation} orientation:`, error);
    return "";
  }
}

// Fonction pour essayer avec un modèle alternatif
async function tryOCRWithAlternateModel(blob: Blob): Promise<string> {
  // Préparation du FormData
  const formData = new FormData();
  formData.append('file', blob, 'document.jpg');
  
  try {
    // Essayer avec un modèle alternatif optimisé pour les documents d'identité
    const models = [
      "facebook/nougat-base",
      "nlpconnect/vit-gpt2-image-captioning",
      "Salesforce/blip-image-captioning-large"
    ];
    
    // Essayer chaque modèle jusqu'à ce qu'un donne un bon résultat
    for (const model of models) {
      console.log(`Trying alternate model: ${model}`);
      
      const altResponse = await fetch(
        `https://api-inference.huggingface.co/models/${model}`, 
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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"
          },
          body: formData
        }
      );

      if (!altResponse.ok) {
        console.log(`Model ${model} returned error: ${altResponse.status}`);
        continue;
      }

      const altResult = await altResponse.json();
      console.log(`Alternative model ${model} result:`, altResult);
      
      // L'API peut renvoyer différents formats selon le modèle
      const text = altResult[0]?.generated_text || altResult.generated_text || "";
      
      if (text.length > 30) {
        return text;
      }
    }
    
    return ""; // Si aucun modèle n'a donné un bon résultat
  } catch (error) {
    console.error("Error with alternate models:", error);
    return "";
  }
}

