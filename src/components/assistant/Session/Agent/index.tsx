import React, { memo, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent, VoiceVisualizer } from "@pipecat-ai/client-react";

import ModelBadge from "./model";
import StatsAggregator from "@/pages/utils/stats_aggregator";

export const Agent: React.FC<{
  isReady: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ isReady, statsAggregator }) => {
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");
    const [botIsTalking, setBotIsTalking] = useState<boolean>(false);

    useEffect(() => {
      // Update the started state when the transport enters the ready state
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    useRTVIClientEvent(
      RTVIEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStartedSpeaking,
      useCallback(() => {
        setBotIsTalking(true);
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        setBotIsTalking(false);
      }, [])
    );

    // Cleanup
    useEffect(() => () => setHasStarted(false), []);

    const agentWindowClasses = `
      relative w-full aspect-square rounded-full bg-primary overflow-hidden
      flex items-center justify-center
      ${hasStarted ? 'opacity-100' : 'opacity-75'}
      ${botIsTalking ? 'ring-4 ring-green-400 ring-opacity-50' : ''}
    `;

    return (
      <div className="w-full flex items-center justify-center p-4">
        <div className={agentWindowClasses}>
          {!hasStarted ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <VoiceVisualizer participantType="bot" barWidth={6} backgroundColor="black" barColor="#faff69" />
          )}
        </div>
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);
Agent.displayName = "Agent";

export default Agent;
