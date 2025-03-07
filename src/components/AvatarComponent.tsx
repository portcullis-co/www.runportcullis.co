// AvatarComponent.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarComponentProps {
  src: string;
  alt: string;
  fallbackText: string;
}

export const AvatarComponent: React.FC<AvatarComponentProps> = ({ src, alt, fallbackText }) => {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};