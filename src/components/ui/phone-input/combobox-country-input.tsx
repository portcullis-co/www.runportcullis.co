import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { isoToEmoji, type CountryOption } from "./helpers";
import type { Country } from "react-phone-number-input";

type ComboboxCountryInputProps = {
  countries: CountryOption[];
  selectedCountry: Country | null | undefined;
  onSelect: (country: Country) => void;
  disabled?: boolean;
};

export function ComboboxCountryInput({
  countries,
  selectedCountry,
  onSelect,
  disabled,
}: ComboboxCountryInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const currentCountry = React.useMemo(() => {
    return countries.find((country) => country.value === selectedCountry);
  }, [countries, selectedCountry]);

  const handleSelect = React.useCallback(
    (country: CountryOption) => {
      onSelect(country.value);
      setOpen(false);
    },
    [onSelect]
  );

  const resetSearch = React.useCallback(() => {
    setSearchTerm("");
  }, []);

  React.useEffect(() => {
    if (!open) {
      resetSearch();
    }
  }, [open, resetSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="flex w-[80px] justify-between px-3"
        >
          {currentCountry ? (
            <span className="mr-1">{isoToEmoji(currentCountry.value)}</span>
          ) : (
            <span>🌍</span>
          )}
          <span className="ml-1 text-xs text-muted-foreground">
            {currentCountry?.indicatif}
          </span>
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                value={`${country.label} ${country.value}`}
                onSelect={() => handleSelect(country)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentCountry?.value === country.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span className="mr-2">{isoToEmoji(country.value)}</span>
                <span>
                  {country.label} ({country.indicatif})
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 