
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  groupBy?: (option: AutocompleteOption) => string;
  filterFunction?: (option: AutocompleteOption, searchQuery: string) => boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  emptyMessage = "Aucun résultat trouvé.",
  className,
  disabled = false,
  name,
  groupBy,
  filterFunction
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = options.find(option => option.value === value);

  // Default filter function that checks if label or value includes search query
  const defaultFilterFunction = (option: AutocompleteOption, query: string) => {
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    return (
      option.label.toLowerCase().includes(normalizedQuery) || 
      option.value.toLowerCase().includes(normalizedQuery)
    );
  };

  // Use custom filter function if provided, otherwise use default
  const filterOptions = (options: AutocompleteOption[], query: string) => {
    return options.filter(option => 
      filterFunction ? filterFunction(option, query) : defaultFilterFunction(option, query)
    );
  };

  // Group options if groupBy function is provided
  const groupedOptions = React.useMemo(() => {
    const filteredOptions = filterOptions(options, searchQuery);
    
    if (!groupBy) {
      return { ungrouped: filteredOptions };
    }

    return filteredOptions.reduce<Record<string, AutocompleteOption[]>>((groups, option) => {
      const groupKey = groupBy(option);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(option);
      return groups;
    }, {});
  }, [options, searchQuery, groupBy, filterFunction]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={placeholder} 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <React.Fragment key={group}>
                {group !== 'ungrouped' && groupOptions.length > 0 && (
                  <CommandGroup heading={group}>
                    {groupOptions.map(option => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {group === 'ungrouped' && groupOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
