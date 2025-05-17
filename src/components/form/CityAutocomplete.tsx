
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CityAutocompleteProps {
  onCitySelect: (city: { value: string; label: string }) => void;
  selectedCity?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function CityAutocomplete({
  onCitySelect,
  selectedCity = "",
  label = "Ville",
  placeholder = "Sélectionner une ville...",
  required = false
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  
  // This is a simplified list of cities for demonstration
  const cities = [
    { value: "paris", label: "Paris" },
    { value: "marseille", label: "Marseille" },
    { value: "lyon", label: "Lyon" },
    { value: "toulouse", label: "Toulouse" },
    { value: "nice", label: "Nice" },
    { value: "nantes", label: "Nantes" },
    { value: "strasbourg", label: "Strasbourg" },
    { value: "montpellier", label: "Montpellier" },
    { value: "bordeaux", label: "Bordeaux" },
    { value: "lille", label: "Lille" }
  ];

  const selectedCityName = selectedCity 
    ? cities.find(city => city.value === selectedCity)?.label || selectedCity
    : "";

  return (
    <div className="w-full space-y-2">
      {label && <Label htmlFor="city-select">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            id="city-select"
          >
            {selectedCityName || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une ville..." />
            <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.value}
                  value={city.value}
                  onSelect={() => {
                    onCitySelect(city);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCity === city.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
