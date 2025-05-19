
import { useLocalStorage } from "./useLocalStorage";
import { Language } from "@/components/navigation/LanguageSelector";

// Définition des traductions
const translations = {
  fr: {
    // Navbar
    "marketplace.shipper": "Transporteurs disponibles",
    "marketplace.transporter": "Marchandises à proximité",
    "language.change": "Changer de langue",
    
    // FreightOfferHeader
    "offer.for": "Offres pour",
    "status.available": "Disponible",
    "status.assigned": "Attribuée",
    
    // FreightOfferForm
    "price.asked": "Prix demandé:",
    "price.your_offer": "Votre offre (FCFA)",
    "price.enter_offer": "Saisir votre offre",
    "offer.sending": "Envoi en cours...",
    "offer.update": "Mettre à jour mon offre",
    "offer.make": "Faire une offre",
    "offer.already_made": "Vous avez déjà fait une offre de",
    "offer.for_this_merchandise": "pour cette marchandise.",
    "offer.status": "Statut:",
    "offer.status.accepted": "Acceptée",
    "offer.status.rejected": "Refusée",
    "offer.view_transport": "Voir les offres de transport"
  },
  en: {
    // Navbar
    "marketplace.shipper": "Available Transporters",
    "marketplace.transporter": "Nearby Merchandise",
    "language.change": "Change language",
    
    // FreightOfferHeader
    "offer.for": "Offers for",
    "status.available": "Available",
    "status.assigned": "Assigned",
    
    // FreightOfferForm
    "price.asked": "Requested price:",
    "price.your_offer": "Your offer (FCFA)",
    "price.enter_offer": "Enter your offer",
    "offer.sending": "Sending...",
    "offer.update": "Update my offer",
    "offer.make": "Make an offer",
    "offer.already_made": "You have already made an offer of",
    "offer.for_this_merchandise": "for this merchandise.",
    "offer.status": "Status:",
    "offer.status.accepted": "Accepted",
    "offer.status.rejected": "Rejected",
    "offer.view_transport": "View transport offers"
  },
  wo: {
    // Navbar
    "marketplace.shipper": "Transport yu jàpp",
    "marketplace.transporter": "Yépp yi jege",
    "language.change": "Soppi làkk",
    
    // FreightOfferHeader
    "offer.for": "Ndax yi ngir",
    "status.available": "Jàpp na",
    "status.assigned": "Jox na",
    
    // FreightOfferForm
    "price.asked": "Njëg li ñu laaj:",
    "price.your_offer": "Sa ndax (FCFA)",
    "price.enter_offer": "Dugal sa ndax",
    "offer.sending": "Yónne...",
    "offer.update": "Yeesalaat sama ndax",
    "offer.make": "Def ndax",
    "offer.already_made": "Def nga xéet ndax bu",
    "offer.for_this_merchandise": "ngir yépp yii.",
    "offer.status": "Taxaw:",
    "offer.status.accepted": "Nangu na",
    "offer.status.rejected": "Bañ na",
    "offer.view_transport": "Xool ndax yi transport"
  }
};

export function useTranslation() {
  const [language] = useLocalStorage<Language>("language", "fr");
  
  const translate = (key: string): string => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };
  
  return { t: translate, language };
}
