
// Types pour le système de tarification
export type VehicleType = 'car' | 'van' | 'truck' | 'semi' | 'refrigerated';
export type AdditionalFeeType = 'manual_loading' | 'fragile' | 'urgent';

// Configuration de base des tarifs
export const BASE_FEE = 2000; // FCFA

export const COST_PER_KM: Record<VehicleType, number> = {
  car: 100,
  van: 150,
  truck: 200,
  semi: 250,
  refrigerated: 300
};

export const ADDITIONAL_FEES: Record<AdditionalFeeType, number | string> = {
  manual_loading: 3000,
  fragile: '10%',
  urgent: '20%'
};

export const EMPTY_RETURN_DISCOUNT = {
  min: 0.25, // 25%
  max: 0.50  // 50%
};

export interface PricingOptions {
  distance: number;
  vehicleType: VehicleType;
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
  const { distance, vehicleType, additionalFees = [], emptyReturn = false, emptyReturnDiscount } = options;
  
  // Calcul du prix de base + distance
  const baseFee = BASE_FEE;
  const distanceFee = distance * COST_PER_KM[vehicleType];
  
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
  // Pour l'instant, nous retournons des distances approximatives pour certaines villes au Sénégal
  
  const routes: Record<string, Record<string, number>> = {
    'Dakar': {
      'Kaolack': 200,
      'Saint-Louis': 260,
      'Touba': 190,
      'Thiès': 70,
      'Mbour': 80,
      'Ziguinchor': 450,
      'Tambacounda': 470
    },
    'Kaolack': {
      'Dakar': 200,
      'Saint-Louis': 300,
      'Touba': 120,
      'Thiès': 130,
      'Mbour': 150,
      'Ziguinchor': 250,
      'Tambacounda': 270
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
