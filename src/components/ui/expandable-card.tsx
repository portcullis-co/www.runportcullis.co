"use client";

import React from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceFeature {
  title: string;
  included: boolean;
}

interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
  features: ServiceFeature[];
  supportedTools?: string[];
  priceSubtext?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function ServiceCard({
  title,
  price,
  description,
  features,
  supportedTools = [],
  priceSubtext = "",
  ctaText = "Talk with us ",
  ctaLink = "/talk",
}: ServiceCardProps) {
  return (
    <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-600">
              {title}
            </Badge>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">{price}</h3>
              {priceSubtext && (
                <p className="text-sm text-muted-foreground">{priceSubtext}</p>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Features</h4>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{feature.title}</span>
                {feature.included && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>

          {supportedTools.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Supported Tools</h4>
              <div className="flex flex-wrap gap-2">
                {supportedTools.map((tool, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" asChild>
          <a href={ctaLink}>
            {ctaText}
            <Calendar className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}