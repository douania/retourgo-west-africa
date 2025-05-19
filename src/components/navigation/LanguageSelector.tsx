
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "@/components/ui/use-toast";

export type Language = "fr" | "en" | "wo";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "wo", name: "Wolof", nativeName: "Wolof" }
];

export function LanguageSelector() {
  const [language, setLanguage] = useLocalStorage<Language>("language", "fr");
  const { t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setLanguage(newLanguage);
    toast({
      title: t("language.change"),
      description: `${currentLanguage.nativeName} → ${languages.find(l => l.code === newLanguage)?.nativeName}`,
      duration: 2000,
    });
    
    // Utilisation de setTimeout pour s'assurer que le changement est enregistré avant le rechargement
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline-block">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "cursor-pointer",
              language === lang.code && "font-bold bg-accent"
            )}
          >
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
