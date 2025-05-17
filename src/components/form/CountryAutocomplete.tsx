
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
}

const CountryAutocomplete = ({
  value,
  onChange,
  label = "Pays",
  description,
  required = false
}: CountryAutocompleteProps) => {
  const countryOptions = getCountryOptions();
  
  // Improved filtering for countries
  const filterCountryOptions = (option: { label: string; value: string }, query: string) => {
    if (!query) return true;
    
    const normalizedQuery = query.toLowerCase();
    const normalizedLabel = option.label.toLowerCase();
    
    // Prioritize matches at the beginning of the country name
    if (normalizedLabel.startsWith(normalizedQuery)) {
      return true;
    }
    
    // Then check for partial matches anywhere in the name
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
      />
      
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
};

export default CountryAutocomplete;
