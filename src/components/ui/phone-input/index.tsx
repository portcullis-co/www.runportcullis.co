import * as React from "react";
import "react-phone-number-input/style.css";
import { getCountriesOptions, replaceNumbersWithZeros } from "./helpers";
import { ComboboxCountryInput } from "./combobox-country-input";
import { AsYouType } from "libphonenumber-js";
import en from "i18n-iso-countries/langs/en.json";
import i18nIsoCountries from "i18n-iso-countries";
import PhoneNumberInput, {
  type Country,
  getCountryCallingCode,
} from "react-phone-number-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

i18nIsoCountries.registerLocale(en);

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: Country;
  disabled?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, defaultCountry = "US", disabled, ...props }, ref) => {
    const [countries] = React.useState(() => getCountriesOptions());
    const [country, setCountry] = React.useState<Country | undefined>(
      defaultCountry
    );
    const handleCountrySelect = (newCountry: Country) => {
      setCountry(newCountry);
    };

    const handleChange = React.useCallback(
      (value?: string) => {
        onChange(value || "");
      },
      [onChange]
    );

    // Format the phone number for display
    const displayValue = React.useMemo(() => {
      if (!value) return "";

      try {
        // This formats the phone number as the user types
        const formatter = new AsYouType(country as Country);
        return formatter.input(value);
      } catch (error) {
        return value;
      }
    }, [value, country]);

    // Generate placeholder based on country
    const placeholder = React.useMemo(() => {
      if (!country) return "";

      try {
        const code = getCountryCallingCode(country as Country);
        // Format a fake number to get the right format for the country
        const formatter = new AsYouType(country as Country);
        const formatted = formatter.input(`+${code}${replaceNumbersWithZeros("123456789")}`);
        return formatted;
      } catch (error) {
        return "";
      }
    }, [country]);

    return (
      <div className="flex w-full items-center space-x-2">
        <div className="grid gap-1 w-full">
          <div className="relative flex flex-row">
            <div className="flex flex-row">
              <ComboboxCountryInput
                countries={countries}
                selectedCountry={country}
                onSelect={handleCountrySelect}
                disabled={disabled}
              />
            </div>
            <div className="relative flex-1">
              <PhoneNumberInput
                international
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                defaultCountry={country}
                disabled={disabled}
                inputComponent={Input}
                {...props}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput }; 