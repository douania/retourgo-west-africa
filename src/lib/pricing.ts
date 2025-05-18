// Types pour le système de tarification
export type VehicleType = 'car' | 'van' | 'truck' | 'semi' | 'refrigerated';
export type AdditionalFeeType = 'manual_loading' | 'fragile' | 'urgent';

// Configuration de base des tarifs
export const BASE_FEE = 15000; // FCFA - Augmentation du frais de base

// Ajustement des tarifs par km selon le poids et le type de véhicule
// Basé sur les données réelles du marché sénégalais pour conteneurs
export const COST_PER_KM: Record<VehicleType, { 
  base: number,           // Pour poids légers < 5 tonnes
  medium: number,         // Pour poids moyens 5-22 tonnes
  heavy: number           // Pour poids lourds > 22 tonnes
}> = {
  car: { base: 250, medium: 0, heavy: 0 },              // Voiture: uniquement pour petits colis
  van: { base: 350, medium: 450, heavy: 0 },            // Camionnette: jusqu'à 3.5t environ
  truck: { base: 500, medium: 800, heavy: 1200 },       // Camion: pour charges moyennes et lourdes
  semi: { base: 0, medium: 1000, heavy: 1500 },          // Semi-remorque: uniquement pour charges lourdes
  refrigerated: { base: 700, medium: 1200, heavy: 1800 } // Réfrigéré: prix premium
};

export const ADDITIONAL_FEES: Record<AdditionalFeeType, number | string> = {
  manual_loading: 25000,   // Augmentation du coût de chargement manuel
  fragile: '15%',          // Augmentation du pourcentage pour cargaison fragile
  urgent: '25%'            // Augmentation du pourcentage pour urgence
};

export const EMPTY_RETURN_DISCOUNT = {
  min: 0.15, // 15%
  max: 0.30  // 30%
};

// Seuils de poids pour déterminer la catégorie de tarification
export const WEIGHT_THRESHOLDS = {
  MEDIUM: 5000, // 5 tonnes
  HEAVY: 22000  // 22 tonnes (basé sur la grille tarifaire fournie)
};

// Facteur d'ajustement pour les longues distances
export const LONG_DISTANCE_FACTORS = {
  ZIGUINCHOR_FACTOR: 1.2,  // Facteur spécial pour Ziguinchor (routes difficiles)
  TAMBACOUNDA_FACTOR: 1.1, // Facteur pour Tambacounda
  DEFAULT_FACTOR: 1.0      // Facteur par défaut
};

export interface PricingOptions {
  distance: number;
  vehicleType: VehicleType;
  weight?: number;          // Poids en kg, optionnel
  additionalFees?: AdditionalFeeType[];
  emptyReturn?: boolean;
  emptyReturnDiscount?: number; // Entre 0.25 et 0.50
}

// Fonction pour calculer le tarif estimé
export function calculatePrice(options: PricingOptions): {
  total: number;
  breakdown: {
    baseFee: number;
    distanceFee: number;
    additionalFees: { type: string; amount: number }[];
    emptyReturnDiscount: number;
  };
} {
  const { 
    distance, 
    vehicleType, 
    weight = 0, 
    additionalFees = [], 
    emptyReturn = false, 
    emptyReturnDiscount 
  } = options;
  
  // Déterminer la catégorie de tarification en fonction du poids
  let weightCategory: 'base' | 'medium' | 'heavy' = 'base';
  if (weight >= WEIGHT_THRESHOLDS.HEAVY) {
    weightCategory = 'heavy';
  } else if (weight >= WEIGHT_THRESHOLDS.MEDIUM) {
    weightCategory = 'medium';
  }
  
  // Vérifier si le véhicule peut transporter ce poids
  const ratePerKm = COST_PER_KM[vehicleType][weightCategory];
  if (ratePerKm === 0) {
    // Si le taux est 0, cela signifie que ce véhicule ne peut pas transporter cette catégorie de poids
    throw new Error(`Ce type de véhicule (${getVehicleTypeLabel(vehicleType)}) ne peut pas transporter ${weight}kg`);
  }
  
  // Calcul du prix de base
  const baseFee = BASE_FEE;
  
  // Appliquer le multiplicateur spécial pour certaines destinations
  let distanceFactor = LONG_DISTANCE_FACTORS.DEFAULT_FACTOR;
  
  // Vérifier si la destination est Ziguinchor (ajout d'un multiplicateur spécial)
  if (distance > 800) {
    distanceFactor = LONG_DISTANCE_FACTORS.ZIGUINCHOR_FACTOR;
  } else if (distance > 400) {
    distanceFactor = LONG_DISTANCE_FACTORS.TAMBACOUNDA_FACTOR;
  }
  
  // Calcul du prix kilométrique
  const distanceFee = distance * ratePerKm * distanceFactor;
  
  // Calcul des frais supplémentaires
  let totalAdditionalFees = 0;
  const additionalFeesBreakdown: { type: string; amount: number }[] = [];
  
  additionalFees.forEach(feeType => {
    const fee = ADDITIONAL_FEES[feeType];
    let feeAmount = 0;
    
    if (typeof fee === 'number') {
      feeAmount = fee;
    } else if (typeof fee === 'string' && fee.endsWith('%')) {
      // Calculer un pourcentage du sous-total (base + distance)
      const percentage = parseFloat(fee.replace('%', '')) / 100;
      feeAmount = (baseFee + distanceFee) * percentage;
    }
    
    totalAdditionalFees += feeAmount;
    additionalFeesBreakdown.push({ type: feeType, amount: feeAmount });
  });
  
  // Sous-total avant réduction
  const subtotal = baseFee + distanceFee + totalAdditionalFees;
  
  // Calcul de la réduction pour retour à vide
  let discount = 0;
  if (emptyReturn) {
    // Si un pourcentage spécifique est fourni, l'utiliser, sinon utiliser la valeur par défaut
    const discountRate = emptyReturnDiscount !== undefined 
      ? Math.max(EMPTY_RETURN_DISCOUNT.min, Math.min(EMPTY_RETURN_DISCOUNT.max, emptyReturnDiscount))
      : EMPTY_RETURN_DISCOUNT.min;
    
    discount = subtotal * discountRate;
  }
  
  // Calcul du total
  const total = Math.round(subtotal - discount);
  
  return {
    total,
    breakdown: {
      baseFee,
      distanceFee,
      additionalFees: additionalFeesBreakdown,
      emptyReturnDiscount: discount
    }
  };
}

// Fonction pour calculer la distance entre deux points (à remplacer par une API de calcul d'itinéraire)
export function estimateDistance(origin: string, destination: string): number {
  // Cette fonction est un placeholder et devrait être remplacée par une vraie API de calcul d'itinéraire
  // Mise à jour avec des distances plus réalistes basées sur la grille tarifaire fournie
  
  const routes: Record<string, Record<string, number>> = {
    'Dakar': {
      'Kaolack': 189,
      'Saint-Louis': 268,
      'Touba': 186,
      'Thiès': 71,
      'Mbour': 83,
      'Ziguinchor': 881,
      'Tambacounda': 467,
      'Kébémer': 155,
      'Louga': 194,
      'Mbacké': 186,
      'Diourbel': 146,
      'Tivaouane': 95,
      'Richard Toll': 376
    },
    'Kaolack': {
      'Dakar': 189,
      'Saint-Louis': 320,
      'Touba': 130,
      'Thiès': 140,
      'Mbour': 160,
      'Ziguinchor': 650,
      'Tambacounda': 290
    },
    // Ajouter plus de routes au besoin
  };
  
  // Extraire les noms de villes des chaînes (qui peuvent contenir pays, région, etc.)
  const extractCity = (location: string): string => {
    return location.split(',')[0].trim();
  };
  
  const originCity = extractCity(origin);
  const destinationCity = extractCity(destination);
  
  // Vérifier si nous avons des données pour ces villes
  if (routes[originCity] && routes[originCity][destinationCity]) {
    return routes[originCity][destinationCity];
  }
  
  if (routes[destinationCity] && routes[destinationCity][originCity]) {
    return routes[destinationCity][originCity]; // Distance symétrique
  }
  
  // Si nous n'avons pas de données pour ces villes, faire une approximation
  // En utilisant des coordonnées approximatives (idéalement à remplacer par une API)
  return 100; // Distance par défaut de 100km
}

// Fonction utilitaire pour formater les prix en FCFA
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-SN').format(price) + ' FCFA';
}

// Obtenir les libellés des types de véhicules
export function getVehicleTypeLabel(type: VehicleType): string {
  const labels: Record<VehicleType, string> = {
    car: 'Voiture',
    van: 'Camionnette',
    truck: 'Camion plateau ou benne',
    semi: 'Semi-remorque / gros porteur',
    refrigerated: 'Réfrigéré'
  };
  
  return labels[type] || type;
}

// Obtenir les libellés des frais supplémentaires
export function getAdditionalFeeLabel(type: AdditionalFeeType): string {
  const labels: Record<AdditionalFeeType, string> = {
    manual_loading: 'Chargement manuel',
    fragile: 'Cargaison fragile',
    urgent: 'Cargaison urgente (livrée le jour-même)'
  };
  
  return labels[type] || type;
}

// Fonction pour obtenir la compatibilité des véhicules avec différentes catégories de poids
export function getVehicleWeightCapacity(vehicleType: VehicleType): {
  minWeight: number;
  maxWeight: number;
} {
  const capacities: Record<VehicleType, {minWeight: number; maxWeight: number}> = {
    car: { minWeight: 0, maxWeight: 500 },          // Jusqu'à 500kg
    van: { minWeight: 0, maxWeight: 3500 },         // Jusqu'à 3.5 tonnes
    truck: { minWeight: 0, maxWeight: 30000 },      // Jusqu'à 30 tonnes
    semi: { minWeight: 5000, maxWeight: 40000 },    // De 5 à 40 tonnes
    refrigerated: { minWeight: 0, maxWeight: 25000 } // Jusqu'à 25 tonnes
  };
  
  return capacities[vehicleType];
}

// Fonction pour obtenir un prix estimé par kg-km selon la distance et le poids
export function calculatePricePerKgKm(distance: number, weight: number): number {
  if (distance <= 0 || weight <= 0) return 0;
  
  // Plus la distance est grande, plus le prix par kg-km diminue (économies d'échelle)
  let scaleFactor = 1.0;
  
  if (distance > 800) scaleFactor = 0.7;
  else if (distance > 500) scaleFactor = 0.75;
  else if (distance > 300) scaleFactor = 0.8;
  else if (distance > 200) scaleFactor = 0.85;
  else if (distance > 100) scaleFactor = 0.9;
  
  // Plus le poids est important, plus le prix par kg-km diminue (économies d'échelle)
  if (weight > 25000) scaleFactor *= 0.7;
  else if (weight > 15000) scaleFactor *= 0.8;
  else if (weight > 5000) scaleFactor *= 0.9;
  
  // Prix de base par kg-km en FCFA
  const basePricePerKgKm = 0.15;
  
  return basePricePerKgKm * scaleFactor;
}
