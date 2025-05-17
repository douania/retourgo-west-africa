
import React from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { getCityOptions } from "@/lib/location-data";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";

interface CityAutocompleteProps {
  value?: string;
  onChange: (city: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
}

const CityAutocomplete = ({
  value,
  onChange,
  label = "Ville",
  description,
  required = false
}: CityAutocompleteProps) => {
  const cityOptions = getCityOptions();
  
  // Enhanced filter function for better search experience
  const filterCityOptions = (option: { label: string; value: string }, query: string) => {
    if (!query) return true;
    
    const normalizedQuery = query.toLowerCase();
    const normalizedLabel = option.label.toLowerCase();
    
    // Start with exact matches at the beginning of words
    const words = normalizedLabel.split(/[, ]+/);
    for (const word of words) {
      if (word.startsWith(normalizedQuery)) {
        return true;
      }
    }
    
    // Then check for partial matches
    return normalizedLabel.includes(normalizedQuery);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="city" className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
        {label}
      </Label>
      
      <Autocomplete
        options={cityOptions}
        value={value}
        onChange={onChange}
        placeholder="Saisissez le nom de la ville..."
        emptyMessage="Aucune ville trouvée."
        filterFunction={filterCityOptions}
        groupBy={(option) => option.label.split(', ')[1]} // Group by country
      />
      
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
};

export default CityAutocomplete;
