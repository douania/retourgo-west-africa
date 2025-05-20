
// Fonction améliorée pour analyser le texte OCR et extraire des informations structurées
export function parseOCRText(text: string) {
  console.log("Parsing OCR text:", text);
  const extractedData: Record<string, string> = {};
  
  // Recherche de patterns courants dans les documents d'identité
  const nameMatch = text.match(/(?:nom|name|pr[eé]nom|full[-\s]?name)(?:\s*et\s*pr[eé]nom)?s?\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nameMatch && nameMatch[1]) extractedData.full_name = nameMatch[1].trim();
  
  const idMatch = text.match(/(?:carte|num[eé]ro|n°)(?:\s*nationale)?(?:\s*d['']identit[eé])?\s*:?\s*(\w+)/i);
  if (idMatch && idMatch[1]) extractedData.id_number = idMatch[1].trim();
  
  const birthMatch = text.match(/(?:n[eé][e]? le|date de naissance)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}|\d{1,2}\s+[a-zÀ-ÖØ-öø-ÿ]+\s+\d{2,4})/i);
  if (birthMatch && birthMatch[1]) extractedData.birth_date = birthMatch[1].trim();
  
  const addressMatch = text.match(/(?:adresse|domicil[e|ié]|r[eé]sid[e|ant])\s*:?\s*([^,\.]{3,}[^\n]*)/i);
  if (addressMatch && addressMatch[1]) extractedData.address = addressMatch[1].trim();
  
  const nationalityMatch = text.match(/nationalit[eé]\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
  if (nationalityMatch && nationalityMatch[1]) extractedData.nationality = nationalityMatch[1].trim();
  
  // Recherche de patterns pour les permis de conduire
  const licenseNumMatch = text.match(/(?:permis|num[eé]ro|license)\s*:?\s*(\w+)/i);
  if (licenseNumMatch && licenseNumMatch[1]) extractedData.license_number = licenseNumMatch[1].trim();
  
  const categoryMatch = text.match(/(?:cat[eé]gories?|cat)\s*:?\s*([A-Z,\s]+)/i);
  if (categoryMatch && categoryMatch[1]) extractedData.categories = categoryMatch[1].trim();
  
  const expiryMatch = text.match(/(?:expir[eé]|valable jusqu[']au)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i);
  if (expiryMatch && expiryMatch[1]) extractedData.expiry_date = expiryMatch[1].trim();
  
  // Si aucune information n'a été extraite, renvoyer un objet vide
  if (Object.keys(extractedData).length === 0) {
    console.log("No data could be extracted from OCR text");
  } else {
    console.log("Extracted data from OCR text:", extractedData);
  }
  
  return extractedData;
}
