
import { useLocalStorage } from "./useLocalStorage";
import { Language } from "@/components/navigation/LanguageSelector";

// Définition des traductions
const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.how_it_works": "Comment ça marche",
    "nav.pricing": "Tarifs",
    "nav.contact": "Contact",
    "nav.dashboard": "Tableau de bord",
    "nav.publish_merchandise": "Publier une marchandise",
    "nav.manage_vehicles": "Gérer mes véhicules",
    "nav.my_profile": "Mon profil",
    "nav.history": "Historique",
    "nav.logout": "Se déconnecter",
    
    // Navbar
    "marketplace.shipper": "Transporteurs disponibles",
    "marketplace.transporter": "Marchandises à proximité",
    "language.title": "Langue",
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
    "offer.view_transport": "Voir les offres de transport",
    
    // Contact page
    "contact.title": "Contactez-nous",
    "contact.subtitle": "Vous avez des questions ou des suggestions? N'hésitez pas à nous contacter.",
    "contact.form.name": "Nom complet",
    "contact.form.email": "Adresse email",
    "contact.form.subject": "Sujet",
    "contact.form.message": "Message",
    "contact.form.submit": "Envoyer le message",
    "contact.form.submitting": "Envoi en cours...",
    "contact.offices.title": "Nos bureaux",
    "contact.regional.title": "Bureaux régionaux"
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.how_it_works": "How it works",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "nav.publish_merchandise": "Publish merchandise",
    "nav.manage_vehicles": "Manage my vehicles",
    "nav.my_profile": "My profile",
    "nav.history": "History",
    "nav.logout": "Log out",
    
    // Navbar
    "marketplace.shipper": "Available Transporters",
    "marketplace.transporter": "Nearby Merchandise",
    "language.title": "Language",
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
    "offer.view_transport": "View transport offers",
    
    // Contact page
    "contact.title": "Contact us",
    "contact.subtitle": "Do you have questions or suggestions? Feel free to contact us.",
    "contact.form.name": "Full name",
    "contact.form.email": "Email address",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.form.submitting": "Sending...",
    "contact.offices.title": "Our offices",
    "contact.regional.title": "Regional offices"
  },
  wo: {
    // Navigation
    "nav.home": "Kër gi",
    "nav.how_it_works": "Naka lay doxe",
    "nav.pricing": "Njëg yi",
    "nav.contact": "Jokkoo",
    "nav.dashboard": "Taabul bu mag",
    "nav.publish_merchandise": "Yeesal marchandise bi",
    "nav.manage_vehicles": "Saytu samay woto",
    "nav.my_profile": "Sama profil",
    "nav.history": "Jaar-jaar",
    "nav.logout": "Génn",
    
    // Navbar
    "marketplace.shipper": "Transport yu jàpp",
    "marketplace.transporter": "Yépp yi jege",
    "language.title": "Làkk",
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
    "offer.view_transport": "Xool ndax yi transport",
    
    // Contact page
    "contact.title": "Jokkoo ak nun",
    "contact.subtitle": "Ndax am nga laaj walla xalaat? Bul tiit jokkoo ak nun.",
    "contact.form.name": "Sa tur bu mat",
    "contact.form.email": "Sa màkkaanu email",
    "contact.form.subject": "Mbirum laaj bi",
    "contact.form.message": "Bataaxal",
    "contact.form.submit": "Yonnee bataaxal",
    "contact.form.submitting": "Yónne...",
    "contact.offices.title": "Sunu bureaux",
    "contact.regional.title": "Bureaux ci regions yi"
  }
};

export function useTranslation() {
  const [language] = useLocalStorage<Language>("language", "fr");
  
  const translate = (key: string): string => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };
  
  return { t: translate, language };
}
