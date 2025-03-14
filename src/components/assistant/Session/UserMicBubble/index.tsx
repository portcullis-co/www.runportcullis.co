import React, { useCallback, useRef } from "react";
import { Mic, MicOff, Pause } from "lucide-react";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

const AudioIndicatorBubble: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        const v = Number(volume) * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );

  return <div ref={volRef} className="absolute inset-0 bg-primary-400 rounded-full opacity-30 transform scale-0 transition-transform duration-75 ease-in-out origin-center" />;
};

interface Props {
  active: boolean;
  muted: boolean;
  handleMute: () => void;
}

export default function UserMicBubble({
  active,
  muted = false,
  handleMute,
}: Props) {
  const canTalk = !muted && active;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div 
        className={`
          relative flex items-center justify-center 
          rounded-full w-16 h-16 md:w-20 md:h-20 
          transition-all duration-150 shadow-md cursor-pointer
          ${muted && active ? 'bg-red-100 border-2 border-red-400' : ''}
          ${!active ? 'bg-gray-100 border-2 border-gray-300' : ''}
          ${canTalk ? 'bg-green-100 border-2 border-green-400' : ''}
        `}
        onClick={() => handleMute()}
      >
        <div className="relative z-10">
          {!active ? (
            <Pause size={42} className="h-8 w-8 md:h-10 md:w-10" />
          ) : canTalk ? (
            <Mic size={42} className="h-8 w-8 md:h-10 md:w-10" />
          ) : (
            <MicOff size={42} className="h-8 w-8 md:h-10 md:w-10" />
          )}
        </div>
        {canTalk && <AudioIndicatorBubble />}
      </div>
    </div>
  );
}
