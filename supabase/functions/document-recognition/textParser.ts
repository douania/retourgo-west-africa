
// Fonction améliorée pour analyser le texte OCR et extraire des informations structurées
export function parseOCRText(text: string) {
  console.log("Parsing OCR text:", text);
  const extractedData: Record<string, string> = {};
  
  // Recherche de patterns courants dans les documents d'identité
  const nameMatch = text.match(/(?:nom|name|pr[eé]nom|full[-\s]?name)(?:\s*et\s*pr[eé]nom)?s?\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nameMatch && nameMatch[1]) extractedData.full_name = nameMatch[1].trim();
  
  // Format spécifique pour les cartes d'identité sénégalaises
  const senegalIdMatch = text.match(/(\d{1,2}\s*\d{2}\s*\d{4}\s*\d{5})/i);
  if (senegalIdMatch && senegalIdMatch[1]) extractedData.id_number = senegalIdMatch[1].replace(/\s+/g, '').trim();
  
  // Formats génériques d'identité
  const idMatch = text.match(/(?:carte|num[eé]ro|n°|n[o°])(?:\s*nationale)?(?:\s*d['']identit[eé])?\s*:?\s*(\w+)/i);
  if (!extractedData.id_number && idMatch && idMatch[1]) extractedData.id_number = idMatch[1].trim();
  
  // Format spécifique pour les dates sénégalaises (JJ/MM/AAAA)
  const senegalDateMatch = text.match(/(?:n[eé][e]? le|date de naissance|né|née)\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})/i);
  if (senegalDateMatch && senegalDateMatch[1]) extractedData.birth_date = senegalDateMatch[1].trim();
  
  // Format alternatif pour les dates (avec mois textuel)
  const birthMatch = text.match(/(?:n[eé][e]? le|date de naissance)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{1,2}\s+[a-zÀ-ÖØ-öø-ÿ]+\s+\d{2,4})/i);
  if (!extractedData.birth_date && birthMatch && birthMatch[1]) extractedData.birth_date = birthMatch[1].trim();
  
  // Détection du lieu de naissance - format sénégalais
  const birthPlaceMatch = text.match(/(?:lieu de naissance|lieu|né à|née à)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (birthPlaceMatch && birthPlaceMatch[1]) extractedData.birth_place = birthPlaceMatch[1].trim();
  
  // Détection de l'adresse
  const addressMatch = text.match(/(?:adresse|domicil[e|ié]|r[eé]sid[e|ant])\s*:?\s*([^,\.]{3,}[^\n]*)/i);
  if (addressMatch && addressMatch[1]) extractedData.address = addressMatch[1].trim();
  
  // Détection de la nationalité 
  const nationalityMatch = text.match(/nationalit[eé]\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nationalityMatch && nationalityMatch[1]) extractedData.nationality = nationalityMatch[1].trim();
  
  // Reconnaissance du sexe (M/F)
  const sexeMatch = text.match(/(?:sexe|sex)\s*:?\s*([MF])/i);
  if (sexeMatch && sexeMatch[1]) extractedData.gender = sexeMatch[1].toUpperCase().trim();
  
  // Extraction de la taille
  const heightMatch = text.match(/(?:taille|height)\s*:?\s*(\d{2,3}(?:\.\d+)?)\s*cm/i);
  if (heightMatch && heightMatch[1]) extractedData.height = heightMatch[1].trim();
  
  // Extraction de la date d'expiration
  const expiryMatch = text.match(/(?:expir[eé]|valable jusqu[']au|date d['']expiration)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i);
  if (expiryMatch && expiryMatch[1]) extractedData.expiry_date = expiryMatch[1].trim();
  
  // Extraction pour les cartes bimétriques CEDEAO/ECOWAS
  const ecowasMatch = text.match(/(?:CEDEAO|ECOWAS|CEDAO)/i);
  if (ecowasMatch) extractedData.card_type = 'CEDEAO/ECOWAS';
  
  // Si aucune information n'a été extraite, renvoyer un objet vide
  if (Object.keys(extractedData).length === 0) {
    console.log("No data could be extracted from OCR text");
    
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
