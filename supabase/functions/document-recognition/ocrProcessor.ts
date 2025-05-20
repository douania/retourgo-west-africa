
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

    console.log("Preparing document for OCR processing - will try multiple orientations and models");
    
    // Liste des modèles à essayer, dans l'ordre de priorité
    const models = [
      // Modèle spécifique pour cartes d'identité
      "mindee/id_documents",
      // Modèle général pour documents avec bonne résolution
      "microsoft/trocr-large-printed",
      // Modèles alternatifs si les premiers échouent
      "nlpconnect/vit-gpt2-image-captioning",
      "facebook/nougat-base",
      "Salesforce/blip-image-captioning-large"
    ];

    // Orientations à essayer
    const orientations = ["original", "90deg", "180deg", "270deg"];
    
    let bestText = "";
    let bestScore = 0;

    console.log("Starting OCR processing with multiple models and orientations");
    
    // Essayer chaque modèle
    for (const model of models) {
      console.log(`Trying model: ${model}`);
      
      // Essayer chaque orientation
      for (const orientation of orientations) {
        console.log(`With orientation: ${orientation}`);
        
        // Traiter l'image avec le modèle et l'orientation actuels
        const extractedText = await tryOCRWithModelAndOrientation(blob, model, orientation);
        
        // Évaluer le résultat par un score simple basé sur la longueur du texte et la présence de mots clés
        const score = evaluateTextQuality(extractedText);
        console.log(`Text quality score: ${score}`);
        
        if (score > bestScore) {
          bestText = extractedText;
          bestScore = score;
          console.log("New best text found!");
        }
        
        // Si on obtient un score très élevé, on peut s'arrêter là
        if (bestScore > 100) {
          console.log("High quality text detected, stopping early");
          break;
        }
      }
      
      // Si on a déjà un résultat acceptable, on s'arrête
      if (bestScore > 50) {
        console.log("Acceptable text quality detected, not trying more models");
        break;
      }
    }
    
    // Si aucun résultat satisfaisant n'est trouvé, essayer des prétraitements d'image
    if (bestScore < 30 && bestText.length < 100) {
      console.log("Low quality results, trying with image preprocessing");
      const enhancedText = await tryWithImageEnhancement(blob);
      
      const enhancedScore = evaluateTextQuality(enhancedText);
      if (enhancedScore > bestScore) {
        bestText = enhancedText;
        bestScore = enhancedScore;
        console.log("Enhanced image produced better results");
      }
    }
    
    console.log(`Final text extraction completed. Text length: ${bestText.length}, Quality score: ${bestScore}`);
    
    // Analyser le texte pour en extraire les données structurées
    // Ajouter des infos sur le modèle et l'orientation qui ont donné les meilleurs résultats
    const extractedData = parseOCRText(bestText, { 
      sourceLang: detectLanguage(bestText),
      documentType: "id_card", 
      qualityScore: bestScore 
    });
    
    console.log("Parsed OCR data:", extractedData);
    
    return extractedData;
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
}

// Détection de langue pour améliorer l'extraction
function detectLanguage(text: string): string {
  // Recherche de mots ou phrases typiques en français
  const frenchPatterns = [
    /république/i, /sénégal/i, /identité/i, /naissance/i, 
    /délivré/i, /nationalité/i, /carte/i
  ];
  
  // Recherche de mots ou phrases typiques en anglais
  const englishPatterns = [
    /republic/i, /identity/i, /birth/i, /issued/i, 
    /nationality/i, /card/i
  ];
  
  let frenchScore = 0;
  let englishScore = 0;
  
  frenchPatterns.forEach(pattern => {
    if (pattern.test(text)) frenchScore++;
  });
  
  englishPatterns.forEach(pattern => {
    if (pattern.test(text)) englishScore++;
  });
  
  return frenchScore >= englishScore ? "fr" : "en";
}

// Fonction pour essayer l'OCR avec différents modèles et orientations
async function tryOCRWithModelAndOrientation(
  blob: Blob, 
  model: string, 
  orientation: "original" | "90deg" | "180deg" | "270deg"
): Promise<string> {
  // Préparation du FormData
  const formData = new FormData();
  formData.append('file', blob, 'document.jpg');
  
  // Dans un environnement serveur réel, nous pourrions traiter l'image pour
  // la rotation en utilisant une bibliothèque comme Sharp
  console.log(`Attempting OCR with model ${model} and orientation: ${orientation}`);
  
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`, 
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
    
    // La structure de la réponse peut varier selon le modèle
    let text = "";
    
    if (model.includes("mindee")) {
      // Format spécifique pour les modèles Mindee ID
      text = extractMindeeIdData(result);
    } else if (model.includes("trocr")) {
      // Format TrOCR
      text = result[0]?.generated_text || result.generated_text || "";
    } else if (model.includes("vit-gpt2") || model.includes("blip") || model.includes("nougat")) {
      // Formats de modèles de caption
      text = result[0]?.generated_text || result.generated_text || "";
    } else {
      // Format par défaut
      text = result[0]?.generated_text || result.generated_text || "";
    }
    
    console.log(`Extracted text length with ${model} (${orientation}): ${text.length}`);
    return text;
  } catch (error) {
    console.error(`Error with ${model} (${orientation}):`, error);
    return "";
  }
}

// Extraction de données spécifique au format Mindee pour les documents d'identité
function extractMindeeIdData(result: any): string {
  try {
    let combinedText = "";
    
    // Extraction des champs courants pour les cartes d'identité
    if (result.prediction) {
      const fields = [
        'given_names', 'surname', 'document_number', 'nationality', 
        'birth_date', 'birth_place', 'expiry_date', 'issue_date', 'address'
      ];
      
      fields.forEach(field => {
        if (result.prediction[field] && result.prediction[field].value) {
          combinedText += `${field}: ${result.prediction[field].value}\n`;
        }
      });
      
      // Ajouter tous les textes bruts détectés
      if (result.prediction.raw_text && Array.isArray(result.prediction.raw_text)) {
        combinedText += "\n\nRaw Text:\n";
        result.prediction.raw_text.forEach((text: string) => {
          combinedText += text + "\n";
        });
      }
    } else if (result.document && result.document.inference && result.document.inference.prediction) {
      // Format alternatif
      const pred = result.document.inference.prediction;
      
      Object.keys(pred).forEach(key => {
        if (pred[key] && pred[key].value) {
          combinedText += `${key}: ${pred[key].value}\n`;
        }
      });
    }
    
    return combinedText;
  } catch (error) {
    console.error("Error extracting Mindee ID data:", error);
    return "";
  }
}

// Fonction pour essayer avec un prétraitement d'image
async function tryWithImageEnhancement(blob: Blob): Promise<string> {
  // Note: Dans un environnement serveur réel avec des bibliothèques comme Sharp,
  // nous pourrions appliquer des améliorations comme:
  // - Augmentation du contraste
  // - Binarisation (noir et blanc)
  // - Correction de la luminosité
  
  // Ici, nous simulons simplement l'appel à un autre modèle
  console.log("Trying OCR with image enhancement simulation");
  
  try {
    // Utiliser un modèle différent avec le même blob
    const formData = new FormData();
    formData.append('file', blob, 'document.jpg');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten", 
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
    const text = result[0]?.generated_text || result.generated_text || "";
    
    console.log(`Enhanced image extraction text length: ${text.length}`);
    return text;
  } catch (error) {
    console.error("Error with image enhancement:", error);
    return "";
  }
}

// Fonction pour évaluer la qualité du texte extrait
function evaluateTextQuality(text: string): number {
  if (!text) return 0;
  
  let score = 0;
  
  // Points pour la longueur du texte
  score += Math.min(text.length / 10, 30); // Max 30 points pour la longueur
  
  // Points pour les motifs spécifiques aux cartes d'identité
  const patterns = [
    /\d{1,2}[\s./-]?\d{1,2}[\s./-]?\d{2,4}/i, // Dates
    /\d{5,15}/i, // Numéros de cartes
    /identité|identity|carte|card/i,
    /république|republic|sénégal|senegal/i,
    /nationalité|nationality/i,
    /né\s?(?:le|à)|né|born|birth/i,
    /prénom|nom|name|surname/i,
    /expir|valid/i
  ];
  
  patterns.forEach(pattern => {
    if (pattern.test(text)) {
      score += 10; // 10 points par motif trouvé
    }
  });
  
  // Bonus pour les séquences de chiffres qui ressemblent à des numéros de carte
  const idMatches = text.match(/\b\d{5,15}\b/g);
  if (idMatches) {
    score += Math.min(idMatches.length * 5, 20); // Max 20 points bonus
  }
  
  return score;
}
