import { TIERS } from "@/config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { MultiStepForm } from "@/components/MultiStepForm";
import * as React from "react";


interface PricingCardProps {
  tier: typeof TIERS[number];
  paymentFrequency: "usage-based" | "prepaid";
}

export const PricingCard = ({ tier, paymentFrequency }: PricingCardProps) => {
  const [isFormOpen, setFormOpen] = React.useState(false);
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
        isPopular && "outline outline-[rgba(120,119,198)]",
      )}
    >
      {/* Background Decoration */}
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      {/* Card Header */}
      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
        {isPopular && (
          <Badge className="mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900">
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      {/* Price Section */}
      <div className="relative h-12">
        {typeof price === "number" ? (
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              value={price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs font-medium">Per {tier.metric} | Monthly invoices</p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      {/* Features */}
      <div className="flex flex-col gap-4">
        {tier.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <BadgeCheck className="size-5 shrink-0" />
            <p className="text-sm">{feature}</p>
          </div>
        ))}
      </div>

      {/* Add the CTA Button */}
      <Button
        variant="default"
        Icon={ArrowRight}
        iconPlacement="right"
        className={cn(
          "mt-auto w-full cursor-pointer",
          isHighlighted && "bg-background text-foreground hover:bg-background/90"
        )}
        onClick={() => setFormOpen(true)} // Open the form on click
      >
        {tier.cta}
      </Button>
      {/* Multi-Step Form Dialog */}
      <MultiStepForm isOpen={isFormOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};

// Highlighted Background Component
const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] opacity-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:opacity-30" />
);

// Popular Background Component
const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
);