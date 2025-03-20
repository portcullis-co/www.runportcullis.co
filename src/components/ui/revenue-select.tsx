"use client"

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface RevenueSelectProps {
  id: string;
  name: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function RevenueSelect({ id, name, required, onChange }: RevenueSelectProps) {
  return (
    <Select name={name} required={required} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select annual revenue" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="under1m">Under $1 million</SelectItem>
        <SelectItem value="1m-5m">$1 - $5 million</SelectItem>
        <SelectItem value="5m-20m">$5 - $20 million</SelectItem>
        <SelectItem value="20m-50m">$20 - $50 million</SelectItem>
        <SelectItem value="over50m">Over $50 million</SelectItem>
      </SelectContent>
    </Select>
  );
} 