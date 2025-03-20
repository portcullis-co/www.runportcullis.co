import React, { useRef, useState } from "react";
import { X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type VoicePosition = "bottom-right" | "bottom-left";
export type VoiceSize = "sm" | "md" | "lg";

const voiceConfig = {
  dimensions: {
    sm: "sm:w-32 sm:h-32",
    md: "sm:w-48 sm:h-48",
    lg: "sm:w-64 sm:h-64",
  },
  positions: {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
    closed: "pointer-events-none opacity-0 invisible scale-95 sm:translate-y-2",
  },
};

interface ExpandableVoiceProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: VoicePosition;
  size?: VoiceSize;
  isConnected?: boolean;
  isTalking?: boolean;
}

const ExpandableVoice = ({
  className,
  position = "bottom-right",
  size = "md",
  isConnected = false,
  isTalking = false,
  children,
  ...props
}: ExpandableVoiceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const voiceRef = useRef<HTMLDivElement>(null);

  const toggleVoice = () => setIsOpen(!isOpen);

  return (
    <div
      className={cn(`fixed ${voiceConfig.positions[position]} z-50`, className)}
      {...props}
    >
      <div
        ref={voiceRef}
        className={cn(
          "flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-full overflow-hidden transition-all duration-300 ease-out absolute",
          voiceConfig.dimensions[size],
          isOpen ? voiceConfig.states.open : voiceConfig.states.closed,
          "sm:bottom-[calc(100%+1rem)] sm:right-0"
        )}
        style={{
          width: isOpen ? "300px" : "0px",
          height: isOpen ? "300px" : "0px",
        }}
      >
        <div className="w-full h-full relative">
          {children}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/10 hover:bg-white/20"
          onClick={toggleVoice}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      </div>

      <Button
        variant="default"
        onClick={toggleVoice}
        className={cn(
          "w-14 h-14 rounded-full shadow-md flex items-center justify-center transition-all duration-300",
          isOpen ? "opacity-0 scale-90" : "opacity-100 scale-100",
          isConnected ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400",
          isTalking ? "ring-4 ring-blue-400 ring-opacity-50" : "",
        )}
      >
        <Mic className={cn(
          "h-6 w-6",
          isTalking ? "text-white animate-pulse" : "text-white"
        )} />
      </Button>
    </div>
  );
};

export { ExpandableVoice }; 