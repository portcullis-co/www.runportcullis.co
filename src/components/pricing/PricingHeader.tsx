import { Tab } from "@/components/ui/tab";

interface PricingHeaderProps {
  title: string;
  subtitle: string;
  frequencies: readonly ["usage-based", "prepaid"];
  selectedFrequency: "usage-based" | "prepaid";
  onFrequencyChange: (frequency: "usage-based" | "prepaid") => void;
}

export const PricingHeader = ({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: PricingHeaderProps) => (
  <div className="space-y-7 text-center">
    <div className="space-y-4">
      <h1 className="text-4xl font-medium md:text-5xl">{title}</h1>
      <p>{subtitle}</p>
    </div>
    <div className="mx-auto flex w-fit rounded-full bg-[#F3F4F6] p-1 dark:bg-[#222]">
      {frequencies.map((freq) => (
        <Tab
          key={freq}
          text={freq}
          selected={selectedFrequency === freq}
          setSelected={onFrequencyChange}
          discount={freq === "prepaid"}
        />
      ))}
    </div>
  </div>
);