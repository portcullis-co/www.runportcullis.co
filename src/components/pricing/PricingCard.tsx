// src/components/pricing/PricingCard.tsx
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import * as React from "react";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { SparklesText } from "@/components/ui/sparkle-text";

interface PricingCardProps {
  tier: any;
  paymentFrequency: "monthly" | "yearly";
}

export const PricingCard: React.FC<PricingCardProps> = ({ tier, paymentFrequency }) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  const paymentLink = tier.href[paymentFrequency];
  const buttonText = tier.buttonText || "Get Started";
  
  const fifteenBucksLittleMan = () => {
    console.log("Put that money in my hand!");
    navigate(paymentLink);
  }

  return (
    <div className={cn(
      "relative rounded-xl border p-6",
      isHighlighted ? "border-primary bg-primary/5" : "border-border"
    )}>
      {/* Background Decoration */}
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          {tier.name}
          {tier.name === "Portcullis" && (
            <SparklesText colors={{ first: "#FFD700", second: "#D4AF37" }} text="Gold" className="ml-1 text-yellow-500 text-xl font-bold" />
          )}
        </h3>
        {isPopular && (
          <Badge className="ml-2 bg-secondary text-secondary-foreground">
            🔥 Most Popular
          </Badge>
        )}
      </div>
      
      {/* Price Section - Fixed height container */}
      <div className="mb-6 min-h-20 flex flex-col justify-start">
        {typeof price === "number" ? (
          <>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$</span>
              <NumberFlow 
                value={price}
                duration={1000}
                className="text-3xl font-bold"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Per {tier.metric} | Billed {paymentFrequency}
            </p>
          </>
        ) : (
          <div className="text-2xl font-semibold">
            {price}
          </div>
        )}
      </div>

      {/* Features with fixed height */}
      <div className="mb-6 min-h-60">
        <ul className="space-y-3">
          {tier.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <span className="text-sm">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button 
        onClick={fifteenBucksLittleMan}
        className="w-full"
        variant={isHighlighted ? "default" : "outline"}
      >
        {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

// Highlighted Background Component
const HighlightedBackground = () => (
  <div className="absolute inset-0 rounded-xl bg-primary/5 -z-10" />
);

// Popular Background Component
const PopularBackground = () => (
  <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-secondary" />
);