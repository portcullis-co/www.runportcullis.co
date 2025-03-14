import React, { useCallback, useRef } from "react";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

export const AudioIndicatorBar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current)
        volRef.current.style.width = Math.max(2, volume * 100) + "%";
    }, [])
  );

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
      <div 
        ref={volRef} 
        className="h-full bg-primary-500 transition-all duration-75 ease-in-out" 
        style={{ width: "2%" }}
      />
    </div>
  );
};

// Export for usage in Astro
export default AudioIndicatorBar;
