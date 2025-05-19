
import { useLocalStorage } from "./useLocalStorage";
import { Language } from "@/components/navigation/LanguageSelector";
import translations from "@/i18n";

export function useTranslation() {
  const [language] = useLocalStorage<Language>("language", "fr");
  
  const translate = (key: string): string => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };
  
  return { t: translate, language };
}
