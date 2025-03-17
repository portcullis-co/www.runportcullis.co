import { getCountries } from "libphonenumber-js";
import i18nIsoCountries from "i18n-iso-countries";
import type { Country } from "react-phone-number-input";
import type { CountryCallingCode } from "libphonenumber-js";

export type CountryOption = {
  value: Country;
  label: string;
  indicatif: CountryCallingCode;
};

export function getCountriesOptions(): CountryOption[] {
  const countries = getCountries();

  const options = countries
    .map((country) => {
      const code = country.toLowerCase();
      const name = i18nIsoCountries.getName(code, "en");

      if (!name) return null;

      return {
        value: country as Country,
        label: name,
        indicatif: `+${require("libphonenumber-js/metadata.min.json").countries[country][0]}` as CountryCallingCode,
      };
    })
    .filter(Boolean) as CountryOption[];

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export function isoToEmoji(iso: string): string {
  // Convert ISO code to regional indicator symbols
  // This will be displayed as a flag emoji
  return Array.from(iso.toUpperCase())
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
}

export function replaceNumbersWithZeros(input: string): string {
  return input.replace(/\d/g, "0");
} 