
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

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    window.location.reload(); // Recharger la page pour appliquer la nouvelle langue
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
