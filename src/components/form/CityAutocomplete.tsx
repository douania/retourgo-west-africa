
import React, { useEffect, useState } from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { getCityOptions, getCitiesByCountry } from "@/lib/location-data";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";

interface CityAutocompleteProps {
  value?: string;
  onChange: (city: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  countryFilter?: string;
  disabled?: boolean;
}

const CityAutocomplete = ({
  value,
  onChange,
  label = "Ville",
  description,
  required = false,
  countryFilter,
  disabled = false
}: CityAutocompleteProps) => {
  const [cityOptions, setCityOptions] = useState(getCityOptions());
  
  // Filter cities by country when countryFilter changes
  useEffect(() => {
    if (countryFilter) {
      setCityOptions(getCitiesByCountry(countryFilter).map(city => ({
        value: `${city.name}, ${countryFilter}`,
        label: `${city.name}, ${countryFilter}`
      })));
    } else {
      setCityOptions(getCityOptions());
    }
  }, [countryFilter]);
  
  // Enhanced filter function for better search experience
  const filterCityOptions = (option: { label: string; value: string }, query: string) => {
    if (!query) return true;
    
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedLabel = option.label.toLowerCase();
    
    // Check if the city name starts with the query (prioritize this)
    const cityName = normalizedLabel.split(',')[0].trim();
    if (cityName.startsWith(normalizedQuery)) {
      return true;
    }
    
    // Check for matches at the beginning of words
    const words = cityName.split(/\s+/);
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
        groupBy={countryFilter ? undefined : (option) => option.label.split(', ')[1]} // Group by country if not filtered
        disabled={disabled}
      />
      
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
};

export default CityAutocomplete;
