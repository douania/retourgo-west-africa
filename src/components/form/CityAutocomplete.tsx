
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandInput } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cities } from '@/lib/location-data';

export interface CityAutocompleteProps {
  onChange: (value: string) => void;
  required?: boolean;
  countryFilter?: string;
  disabled?: boolean;
  value?: string;
}

const CityAutocomplete = ({
  onChange,
  value = '',
  required = false,
  countryFilter,
  disabled = false
}: CityAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      if (countryFilter && city.country !== countryFilter) {
        return false;
      }
      return city.name.toLowerCase().includes(inputValue.toLowerCase());
    }).slice(0, 10); // Limit to 10 results
  }, [inputValue, countryFilter]);

  const handleSelect = (currentValue: string) => {
    setInputValue(currentValue);
    onChange(currentValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex w-full relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className="w-full"
            required={required}
            disabled={disabled}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une ville..." />
          <CommandGroup>
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <CommandItem
                  key={`${city.name}-${city.country}`}
                  onSelect={() => handleSelect(city.name)}
                  className="flex items-center"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      inputValue === city.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>Aucune ville trouvée</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CityAutocomplete;
