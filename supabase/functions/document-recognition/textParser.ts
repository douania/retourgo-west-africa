
// Type pour les options d'analyse OCR
interface ParseOCROptions {
  sourceLang?: string;
  documentType?: string;
  qualityScore?: number;
}

// Fonction améliorée pour analyser le texte OCR et extraire des informations structurées
export function parseOCRText(text: string, options: ParseOCROptions = {}) {
  console.log("Parsing OCR text with options:", options);
  console.log("Text to parse:", text.substring(0, 200) + (text.length > 200 ? "..." : ""));
  
  const extractedData: Record<string, string> = {};
  const { sourceLang = "fr", documentType = "id_card", qualityScore = 0 } = options;
  
  // Ajouter des métadonnées sur la qualité du texte extrait
  extractedData.extraction_quality = qualityScore.toString();
  
  // Normaliser le texte pour faciliter l'extraction
  const normalizedText = text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log("Normalized text:", normalizedText.substring(0, 200) + (normalizedText.length > 200 ? "..." : ""));
  
  // Patterns spécifiques pour les cartes d'identité sénégalaises
  
  // Format standard du numéro d'identité sénégalais (peut contenir des espaces)
  // Recherche plus agressive des numéros qui pourraient être des ID
  const idPatterns = [
    /(\d{1,2}\s*\d{2,3}\s*\d{4}\s*\d{4})/i, // Format avec espaces
    /(\d{9,14})/g, // Séquence de chiffres
    /(?:carte|card|id|n[o°]|numéro|number).{0,20}?(\d[\d\s]{8,16})/i, // Après "carte", "ID", etc.
    /(?:cin|cni).{0,10}?(\d[\d\s]{8,16})/i // Après CIN/CNI
  ];
  
  for (const pattern of idPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      // Nettoyer le numéro trouvé (enlever espaces)
      extractedData.id_number = matches[1].replace(/\s+/g, '').trim();
      break;
    }
  }
  
  // Si toujours pas trouvé, chercher toutes les séquences numériques
  if (!extractedData.id_number) {
    const allNumbers = text.match(/\b\d{7,14}\b/g);
    if (allNumbers && allNumbers.length > 0) {
      // Prendre le plus long numéro
      extractedData.id_number = allNumbers.reduce((a, b) => a.length > b.length ? a : b);
    }
  }
  
  // Recherche de patterns pour le nom complet - beaucoup plus agressif
  const namePatterns = [
    // Format "Nom: X", "Prénom: Y"
    /(?:nom|name|surname)\s*[:;.]?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-']{3,30})/i,
    /(?:prénom|first\s*name|given\s*name)\s*[:;.]?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-']{3,30})/i,
    
    // Format "Nom et Prénom: X Y"
    /(?:nom\s+et\s+prénom|full[-\s]?name|nom\s+complet)\s*[:;.]?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-']{5,50})/i,
    
    // Format "X" où X ressemble à un nom (majuscule suivie de minuscules)
    /\b([A-Z][a-zÀ-ÖØ-öø-ÿ]{2,15}\s+[A-Z][a-zÀ-ÖØ-öø-ÿ]{2,25}(?:\s+[A-Z][a-zÀ-ÖØ-öø-ÿ]{2,25})?)\b/g
  ];
  
  // Variables pour stocker le prénom et le nom s'ils sont trouvés séparément
  let firstName = "";
  let lastName = "";
  
  // Chercher le nom complet d'abord
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3) {
      // Nettoyer le nom trouvé
      const cleanName = match[1]
        .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s\-']/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleanName.length > 4) {
        extractedData.full_name = cleanName;
        break;
      }
    }
  }
  
  // Chercher le prénom séparément
  const firstNameMatch = text.match(/(?:prénom|first\s*name|given\s*name)\s*[:;.]?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,30})/i);
  if (firstNameMatch && firstNameMatch[1]) {
    firstName = firstNameMatch[1].trim();
  }
  
  // Chercher le nom séparément
  const lastNameMatch = text.match(/(?:nom|surname|last\s*name|family\s*name)\s*[:;.]?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-']{2,30})/i);
  if (lastNameMatch && lastNameMatch[1]) {
    lastName = lastNameMatch[1].trim();
  }
  
  // Si prénom et nom sont trouvés séparément mais pas le nom complet
  if (!extractedData.full_name && firstName && lastName) {
    extractedData.full_name = `${firstName} ${lastName}`.trim();
  } else if (!extractedData.full_name && (firstName || lastName)) {
    // Si seulement l'un des deux est trouvé
    extractedData.full_name = (firstName || lastName).trim();
  }
  
  // Si toujours pas de nom trouvé, chercher des segments qui ressemblent à des noms
  if (!extractedData.full_name) {
    // Recherche de segments en majuscule, typiques des noms sur les cartes d'identité
    const nameSegments = text.match(/\b[A-Z][A-Za-zÀ-ÖØ-öø-ÿ]{2,15}(?:\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ]{2,25})+\b/g);
    if (nameSegments && nameSegments.length > 0) {
      // Prendre le segment le plus long qui pourrait être un nom complet
      extractedData.full_name = nameSegments.reduce((a, b) => a.length > b.length ? a : b).trim();
    }
  }
  
  // Format pour les dates (beaucoup plus flexible)
  const datePatterns = [
    // Format standard JJ/MM/AAAA ou JJ-MM-AAAA
    /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/g,
    
    // Format avec mois textuel
    /(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|september|octobre|novembre|décembre|jan|fév|mar|avr|mai|juin|juil|août|sept|oct|nov|déc|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{2,4})/i,
    
    // Après "né le", "date de naissance", etc.
    /(?:n[ée][e]?\s+(?:à|le)|date\s+de\s+naissance|né|née|birth\s+date|date\s+of\s+birth|born\s+on)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i,
    
    // Après "expiration", "valable jusqu'au", etc.
    /(?:expir[ée]|valable\s+jusqu[']?au|date\s+d[']?expiration|expiry\s+date|valid\s+until|expires\s+on)\s*:?\s*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})/i
  ];
  
  // Chercher toutes les dates dans le texte
  const allDates: string[] = [];
  for (const pattern of datePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) allDates.push(match[1].trim());
    }
  }
  
  // Assigner les dates trouvées aux champs appropriés
  if (allDates.length > 0) {
    // Chercher des indices qui précisent le type de date
    const birthDateIndex = text.search(/(?:n[ée][e]?\s+(?:à|le)|date\s+de\s+naissance|né|née|birth|born)/i);
    const expiryDateIndex = text.search(/(?:expir[ée]|valable|valid|expiry)/i);
    const issueDateIndex = text.search(/(?:délivr[ée][e]?|issue[d]?|émis)/i);
    
    // Parcourir toutes les dates trouvées
    for (let i = 0; i < allDates.length; i++) {
      const dateStr = allDates[i];
      
      // Essayer de déterminer le type de date par son contexte
      const datePosition = text.indexOf(dateStr);
      
      if (birthDateIndex > -1 && Math.abs(datePosition - birthDateIndex) < 100) {
        extractedData.birth_date = dateStr;
      } else if (expiryDateIndex > -1 && Math.abs(datePosition - expiryDateIndex) < 100) {
        extractedData.expiry_date = dateStr;
      } else if (issueDateIndex > -1 && Math.abs(datePosition - issueDateIndex) < 100) {
        extractedData.issue_date = dateStr;
      } else if (!extractedData.birth_date) {
        // Par défaut, la première date est souvent la date de naissance
        extractedData.birth_date = dateStr;
      } else if (!extractedData.expiry_date) {
        // La deuxième date est souvent la date d'expiration
        extractedData.expiry_date = dateStr;
      }
    }
  }
  
  // Détection du lieu de naissance - format sénégalais
  const birthPlacePatterns = [
    /(?:lieu\s+de\s+naissance|lieu|né\s+à|née\s+à|place\s+of\s+birth|born\s+in|born\s+at)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+)/i,
    /(?:à|at)\s+([A-Za-zÀ-ÖØ-öø-ÿ\-\']{3,30})\s+(?:le|on|in)\s+\d{1,2}/i, // Format "à [lieu] le [date]"
    /(?:à|at)\s+([A-Za-zÀ-ÖØ-öø-ÿ\-\']{3,30})(?:\s|$)/i // Format simple "à [lieu]"
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
    /(?:adresse|domicil[eé]|r[eé]sid[eant]|address|residence)\s*:?\s*([^,\.]{3,}[^\n]*)/i,
    /(?:demeurant|residing\s+at|living\s+at)\s+([^,\.]{3,}[^\n]*)/i
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
    /(?:nationalit[eé]|nationality)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{3,30})/i,
    /(?:de\s+nationalit[eé]|of\s+nationality)\s+([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{3,30})/i,
    /(?:pays|country|nation)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{3,30})/i
  ];
  
  for (const pattern of nationalityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.nationality = match[1].trim();
      break;
    }
  }
  
  // Si aucune nationalité n'est trouvée mais "Sénégal" apparaît dans le texte
  if (!extractedData.nationality && 
      (text.match(/s[ée]n[ée]gal|r[ée]publique\s+du\s+s[ée]n[ée]gal/i))) {
    extractedData.nationality = "Sénégalaise";
  }
  
  // Reconnaissance du sexe (M/F)
  const sexPatterns = [
    /(?:sexe|sex|genre|gender)\s*:?\s*([MF])/i,
    /(?:sexe|sex|genre|gender)\s*:?\s*(masculin|male|féminin|feminin|female)/i,
    /(?:homme|femme|man|woman)\b/i // Simple présence du mot
  ];
  
  for (const pattern of sexPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const gender = match[1].toUpperCase().trim();
      if (gender === 'M' || gender === 'MASCULIN' || gender === 'MALE' || gender === 'HOMME' || gender === 'MAN') {
        extractedData.gender = 'M';
      } else if (gender === 'F' || gender === 'FÉMININ' || gender === 'FEMININ' || gender === 'FEMALE' || gender === 'FEMME' || gender === 'WOMAN') {
        extractedData.gender = 'F';
      }
      break;
    }
  }
  
  // Extraction de la profession
  const professionPatterns = [
    /(?:profession|occupation|métier|job)\s*:?\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-\']{3,50})/i
  ];
  
  for (const pattern of professionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData.profession = match[1].trim();
      break;
    }
  }
  
  // Détection pour les cartes bimétriques CEDEAO/ECOWAS
  if (text.match(/(?:CEDEAO|ECOWAS|CEDAO|biom[ée]trique)/i)) {
    extractedData.card_type = 'CEDEAO/ECOWAS';
  }
  
  // Détection de la langue de la carte
  if (text.match(/république\s+du\s+sénégal|republique\s+du\s+senegal/i)) {
    extractedData.country = 'Senegal';
  }
  
  console.log("Extracted data:", extractedData);
  
  // Si aucune information n'a été extraite ou très peu d'informations
  // ou si le score de qualité est très bas
  if (Object.keys(extractedData).length <= 2 || (qualityScore < 20 && Object.keys(extractedData).length < 5)) {
    console.log("Very few data could be extracted or low quality score");
    
    // Approche de dernier recours: extraire des segments de texte qui semblent être des informations utiles
    extractPossibleData(text, extractedData);
    
    console.log("Extracted possible data as fallback:", extractedData);
  } else {
    console.log("Extracted structured data from OCR text:", extractedData);
  }
  
  return extractedData;
}

// Fonction pour extraire des données potentielles en dernier recours
function extractPossibleData(text: string, extractedData: Record<string, string>) {
  // Extraire des segments qui ressemblent à des noms (majuscule suivie de minuscules)
  const nameSegments = text.match(/[A-Z][a-zÀ-ÖØ-öø-ÿ]+\s+[A-Z][A-Za-zÀ-ÖØ-öø-ÿ\s]+/g);
  if (nameSegments && nameSegments.length > 0) {
    extractedData.possible_name = nameSegments[0].trim();
  }
  
  // Extraire des segments qui ressemblent à des numéros d'identification
  const idSegments = text.match(/\d{7,}/g);
  if (idSegments && idSegments.length > 0) {
    extractedData.possible_id = idSegments[0].trim();
  }
  
  // Extraire des segments qui ressemblent à des dates
  const dateSegments = text.match(/\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/g);
  if (dateSegments && dateSegments.length > 0) {
    if (dateSegments.length >= 1) extractedData.possible_date1 = dateSegments[0].trim();
    if (dateSegments.length >= 2) extractedData.possible_date2 = dateSegments[1].trim();
  }
  
  // Extraire des blocs de texte qui pourraient contenir l'adresse
  const addressBlocks = text.match(/([A-Z][a-zÀ-ÖØ-öø-ÿ]+,?\s+){2,5}/g);
  if (addressBlocks && addressBlocks.length > 0) {
    // Prendre le bloc le plus long comme adresse possible
    extractedData.possible_address = addressBlocks.reduce((a, b) => a.length > b.length ? a : b).trim();
  }
}
