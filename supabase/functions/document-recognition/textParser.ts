
// Fonction améliorée pour analyser le texte OCR et extraire des informations structurées
export function parseOCRText(text: string) {
  console.log("Parsing OCR text:", text);
  const extractedData: Record<string, string> = {};
  
  // Normaliser le texte pour faciliter l'extraction
  // Convertir en minuscules et remplacer les caractères multiples
  const normalizedText = text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .trim();
  
  console.log("Normalized text:", normalizedText);
  
  // Patterns spécifiques pour les cartes d'identité sénégalaises
  
  // Format standard du numéro d'identité sénégalais (peut contenir des espaces)
  // Par exemple: 1 234 5678 9012
  const senegalIdMatch = text.match(/(\d{1,2}\s*\d{2,3}\s*\d{4}\s*\d{4})/i);
  if (senegalIdMatch && senegalIdMatch[1]) extractedData.id_number = senegalIdMatch[1].replace(/\s+/g, '').trim();
  
  // Format alternatif du numéro d'identité (juste une séquence de chiffres)
  if (!extractedData.id_number) {
    const altIdMatch = text.match(/(\d{9,14})/g);
    if (altIdMatch && altIdMatch.length > 0) {
      // Prendre la plus longue séquence de chiffres qui pourrait être un numéro d'identité
      extractedData.id_number = altIdMatch.reduce((a, b) => a.length > b.length ? a : b);
    }
  }
  
  // Recherche de patterns pour le nom complet
  // Après "nom", "nom et prénom", etc.
  const namePatterns = [
    /(?:nom|name|nom et pr[eé]nom|full[-\s]?name)s?\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i,
    /(?:pr[eé]nom|first name|first[-\s]?name)s?\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?=\s*\d|nom|last|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i,
    /(?:[iI]dentit[eé] de|[iI]dentity of)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i
  ];
  
  // Essayer chaque pattern pour trouver le nom
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3) {
      extractedData.full_name = match[1]
        .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')  // Enlever les caractères non alphabétiques
        .replace(/\s+/g, ' ')  // Standardiser les espaces
        .trim();
      break;
    }
  }
  
  // Si aucun nom trouvé, chercher des segments qui ressemblent à des noms (majuscule suivie de minuscules)
  if (!extractedData.full_name) {
    const nameSegments = text.match(/[A-Z][a-zÀ-ÖØ-öø-ÿ]+\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ\s]+/g);
    if (nameSegments && nameSegments.length > 0) {
      // Prendre le segment le plus long qui pourrait être un nom complet
      extractedData.full_name = nameSegments.reduce((a, b) => a.length > b.length ? a : b).trim();
    }
  }
  
  // Format spécifique pour les dates sénégalaises (JJ/MM/AAAA ou JJ-MM-AAAA)
  const datePatterns = [
    /(?:n[eé][e]? le|date de naissance|né|née|birth date|date of birth)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
    /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/g, // Format général de date
    /(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4})/i // Format avec mois textuel
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.birth_date = match[1].trim();
      break;
    }
  }
  
  // Détection du lieu de naissance - format sénégalais
  const birthPlacePatterns = [
    /(?:lieu de naissance|lieu|né à|née à|place of birth|born in|born at)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i,
    /(?:à|at)\s+([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i
  ];
  
  for (const pattern of birthPlacePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      extractedData.birth_place = match[1].trim();
      break;
    }
  }
  
  // Détection de l'adresse
  const addressPatterns = [
    /(?:adresse|domicil[e|ié]|r[eé]sid[e|ant]|address|residence)\s*:?\s*([^,\.]{3,}[^\n]*)/i,
    /(?:demeurant|residing at|living at)\s+([^,\.]{3,}[^\n]*)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 5) {
      extractedData.address = match[1].trim();
      break;
    }
  }
  
  // Détection de la nationalité 
  const nationalityPatterns = [
    /(?:nationalit[eé]|nationality)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i,
    /(?:de nationalit[eé]|of nationality)\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?=\s*\d|nom|pr[eé]nom|date|birth|né|née|lieu|adresse|nationality|sexe|sex|genre|gender|numéro|number)/i
  ];
  
  for (const pattern of nationalityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.nationality = match[1].trim();
      break;
    }
  }
  
  // Reconnaissance du sexe (M/F)
  const sexPatterns = [
    /(?:sexe|sex|genre|gender)\s*:?\s*([MF])/i,
    /(?:sexe|sex|genre|gender)\s*:?\s*(masculin|male|féminin|feminin|female)/i
  ];
  
  for (const pattern of sexPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const gender = match[1].toUpperCase().trim();
      if (gender === 'M' || gender === 'MASCULIN' || gender === 'MALE') {
        extractedData.gender = 'M';
      } else if (gender === 'F' || gender === 'FÉMININ' || gender === 'FEMININ' || gender === 'FEMALE') {
        extractedData.gender = 'F';
      }
      break;
    }
  }
  
  // Extraction de la taille
  const heightPatterns = [
    /(?:taille|height)\s*:?\s*(\d{2,3}(?:\.\d+)?)\s*cm/i,
    /(?:taille|height)\s*:?\s*(\d{2,3}(?:\.\d+)?)\s*m/i
  ];
  
  for (const pattern of heightPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.height = match[1].trim();
      break;
    }
  }
  
  // Extraction de la date d'expiration
  const expiryPatterns = [
    /(?:expir[eé]|valable jusqu[']au|date d['']expiration|expiry date|valid until|expires on)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
    /(?:valide jusqu[']au|valid until|expires on)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i
  ];
  
  for (const pattern of expiryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.expiry_date = match[1].trim();
      break;
    }
  }
  
  // Extraction pour les cartes bimétriques CEDEAO/ECOWAS
  const ecowasPatterns = [/(?:CEDEAO|ECOWAS|CEDAO)/i, /(?:carte d'identité biométrique|biometric id card)/i];
  
  for (const pattern of ecowasPatterns) {
    const match = text.match(pattern);
    if (match) {
      extractedData.card_type = 'CEDEAO/ECOWAS';
      break;
    }
  }
  
  // Détection de la langue de la carte (pour pouvoir adapter les patterns)
  if (text.match(/république du sénégal|republique du senegal/i)) {
    extractedData.country = 'Senegal';
  }
  
  console.log("Extracted data:", extractedData);
  
  // Si aucune information n'a été extraite ou très peu d'informations
  if (Object.keys(extractedData).length <= 1) {
    console.log("Very few data could be extracted from OCR text");
    
    // Approche de dernier recours: extraire des segments de texte qui semblent être des informations utiles
    // Extraire des segments qui ressemblent à des noms
    const nameSegments = text.match(/[A-Z][a-zÀ-ÖØ-öø-ÿ]+\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ\s]+/g);
    if (nameSegments && nameSegments.length > 0) {
      extractedData.possible_name = nameSegments[0].trim();
    }
    
    // Extraire des segments qui ressemblent à des numéros d'identification
    const idSegments = text.match(/\d{5,}/g);
    if (idSegments && idSegments.length > 0) {
      extractedData.possible_id = idSegments[0].trim();
    }
    
    // Extraire des segments qui ressemblent à des dates
    const dateSegments = text.match(/\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/g);
    if (dateSegments && dateSegments.length > 0) {
      if (dateSegments.length >= 1) extractedData.possible_date1 = dateSegments[0].trim();
      if (dateSegments.length >= 2) extractedData.possible_date2 = dateSegments[1].trim();
    }
    
    console.log("Extracted possible data as fallback:", extractedData);
  } else {
    console.log("Extracted structured data from OCR text:", extractedData);
  }
  
  return extractedData;
}
