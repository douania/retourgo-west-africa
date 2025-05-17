
import React from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { getCountryOptions } from "@/lib/location-data";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";

interface CountryAutocompleteProps {
  value?: string;
  onChange: (country: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

const CountryAutocomplete = ({
  value,
  onChange,
  label = "Pays",
  description,
  required = false,
  disabled = false
}: CountryAutocompleteProps) => {
  const countryOptions = getCountryOptions();
  
  // Enhanced filtering for countries
  const filterCountryOptions = (option: { label: string; value: string }, query: string) => {
    if (!query) return true;
    
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedLabel = option.label.toLowerCase();
    
    // Prioritize exact matches at the beginning of the name
    if (normalizedLabel.startsWith(normalizedQuery)) {
      return true;
    }
    
    // Match parts of the name (improved for diacritics and partial matches)
    const words = normalizedLabel.split(/\s+/);
    for (const word of words) {
      if (word.startsWith(normalizedQuery)) {
        return true;
      }
    }
    
    // Finally check for partial matches anywhere
    return normalizedLabel.includes(normalizedQuery);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="country" className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
        {label}
      </Label>
      
      <Autocomplete
        options={countryOptions}
        value={value}
        onChange={onChange}
        placeholder="Sélectionnez un pays..."
        emptyMessage="Aucun pays trouvé."
        filterFunction={filterCountryOptions}
        disabled={disabled}
      />
      
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
};

export default CountryAutocomplete;
