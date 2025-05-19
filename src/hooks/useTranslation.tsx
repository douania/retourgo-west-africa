
import { useLocalStorage } from "./useLocalStorage";
import { Language } from "@/components/navigation/LanguageSelector";
import translations from "@/i18n";
import { useEffect, useState } from "react";

export function useTranslation() {
  const [language, setLanguage] = useLocalStorage<Language>("language", "fr");
  const [currentLang, setCurrentLang] = useState<Language>(language);
  
  useEffect(() => {
    // S'assurer que la langue est mise à jour lorsque le localStorage change
    setCurrentLang(language);
  }, [language]);
  
  const translate = (key: string): string => {
    if (!translations[currentLang]) {
      console.warn(`Translation for language "${currentLang}" not found, fallback to French`);
      return translations.fr[key] || key;
    }
    
    const translation = translations[currentLang][key];
    
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${currentLang}", fallback to key`);
      // Si la clé n'existe pas dans la langue actuelle, on essaie en français, puis on utilise la clé elle-même
      return translations.fr[key] || key;
    }
    
    return translation;
  };
  
  return { t: translate, language: currentLang, setLanguage };
}
