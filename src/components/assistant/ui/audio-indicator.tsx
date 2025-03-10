import { useCallback, useRef } from "react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";
import React from "react";

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
    <div className="bg-gray-200 h-2 w-full rounded-full overflow-hidden">
      <div ref={volRef} className="bg-green-500 h-2 w-0 rounded-full transition-[width] duration-100 ease-in-out" />
    </div>
  );
};

export default AudioIndicatorBar;
