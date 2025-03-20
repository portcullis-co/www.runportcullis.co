import { useState, useCallback, useEffect } from "react";
import { RTVIClient, RTVIEvent, LLMHelper, LLMContextMessage } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { 
  RTVIClientProvider, 
  RTVIClientAudio, 
  VoiceVisualizer,
  useRTVIClientEvent,
  useRTVIClientMediaDevices
} from "@pipecat-ai/client-react";
import { ExpandableVoice } from "@/components/ui/expandable-voice";
import React from "react";

interface PipecatStartResponse {
  dailyRoom: string;
  dailyToken: string;
}

interface LLMMessage {
  content: string;
}

interface RTVIWidgetProps {
  apiEndpoint?: string;
  apiToken?: string;
  position?: "bottom-right" | "bottom-left";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RTVIWidget = ({
  apiEndpoint = "https://api.pipecat.daily.co/v1/public/porticia/start",
  apiToken = "pk_8cf200e4-036e-42dc-8653-2a527aa65125",
  position = "bottom-right",
  size = "md",
  className = "",
}: RTVIWidgetProps) => {
  const [rtviClient, setRtviClient] = useState<RTVIClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<"initializing" | "connected" | "disconnected">("initializing");
  const [botIsTalking, setBotIsTalking] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Request audio permissions before initialization
  const requestAudioPermission = async () => {
    try {
      console.log("Requesting audio permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up the test stream
      setHasAudioPermission(true);
      console.log("Audio permission granted");
      return true;
    } catch (error) {
      console.error("Audio permission denied:", error);
      setError("Please allow microphone access to use the voice assistant.");
      return false;
    }
  };

  // Handle initial click
  const handleInitialClick = async () => {
    try {
      console.log("Initial click detected");
      
      // First request permission
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        console.log("Permission denied");
        return;
      }
      
      // Update permission state first
      setHasAudioPermission(true);
      
      // Then initialize client
      console.log("Starting client initialization...");
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createDailyRoom: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const dailyRoom: PipecatStartResponse = await response.json();
      console.log("Daily room created:", dailyRoom);
      
      const transport = new DailyTransport({
        dailyFactoryOptions: {
          url: dailyRoom.dailyRoom,
          token: dailyRoom.dailyToken,
        },
      });

      const client = new RTVIClient({ 
        transport,
        params: {
        }
      });

      // Initialize LLM helper
      const llm = new LLMHelper({
        callbacks: {
          onLLMMessage: (message: LLMContextMessage) => {
            console.log("Bot:", message.content);
            if (typeof message.content === 'string') {
              setLastMessage(message.content);
            }
          },
          onLLMJsonCompletion: (jsonString) => {
            try {
              const data = JSON.parse(jsonString);
              console.log("JSON Response:", data);
            } catch (e) {
              console.error("Failed to parse JSON response:", e);
            }
          },
          onLLMFunctionCall: (func) => {
            console.log("Function call:", func);
          },
          onLLMFunctionCallStart: (functionName) => {
            console.log("Starting function:", functionName);
          },
        },
      });

      await client.registerHelper("llm", llm);
      console.log("RTVI client initialized successfully");
      setRtviClient(client);
      setBotStatus("connected");
      
    } catch (error) {
      console.error("Setup failed:", error);
      setError("Failed to initialize voice assistant");
      setHasAudioPermission(false);
    }
  };

  // Audio output setup component
  const AudioSetup = () => {
    const { updateSpeaker } = useRTVIClientMediaDevices();
    
    useEffect(() => {
      const setupAudio = async () => {
        try {
          // Get default audio output device
          const devices = await navigator.mediaDevices.enumerateDevices();
          const defaultSpeaker = devices.find(d => d.kind === 'audiooutput');
          if (defaultSpeaker) {
            await updateSpeaker(defaultSpeaker.deviceId);
            console.log("Audio output set to:", defaultSpeaker.label);
          }
        } catch (error) {
          console.error("Failed to setup audio output:", error);
        }
      };
      
      setupAudio();
    }, [updateSpeaker]);
    
    return null;
  };

  // Event handlers component
  const AgentEventHandlers = () => {
    useRTVIClientEvent(RTVIEvent.BotConnected, useCallback(() => {
      setBotStatus("connected");
      console.log("Bot connected");
    }, []));
    
    useRTVIClientEvent(RTVIEvent.BotDisconnected, useCallback(() => {
      setBotStatus("disconnected");
      console.log("Bot disconnected");
    }, []));
    
    useRTVIClientEvent(RTVIEvent.BotStartedSpeaking, useCallback(() => {
      setBotIsTalking(true);
      console.log("Bot started speaking");
    }, []));
    
    useRTVIClientEvent(RTVIEvent.BotStoppedSpeaking, useCallback(() => {
      setBotIsTalking(false);
      console.log("Bot stopped speaking");
    }, []));
    
    return null;
  };

  if (error) {
    return (
      <div className="fixed bottom-5 right-5 p-4 bg-red-50 rounded-lg shadow-lg text-red-600">
        <p>{error}</p>
        <button 
          onClick={handleInitialClick}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ExpandableVoice
      position={position}
      size={size}
      isConnected={botStatus === "connected"}
      isTalking={botIsTalking}
      onClick={!rtviClient ? handleInitialClick : undefined}
    >
      {rtviClient ? (
        <RTVIClientProvider client={rtviClient}>
          <RTVIClientAudio />
          <AudioSetup />
          <AgentEventHandlers />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Outer visualizer */}
              <div className="absolute inset-0 flex items-center justify-center">
                <VoiceVisualizer 
                  participantType="bot"
                  barWidth={4}
                  backgroundColor="transparent"
                  barColor="rgba(59, 130, 246, 0.3)"
                  barGap={3}
                  barMaxHeight={120}
                />
              </div>
              {/* Inner visualizer */}
              <div className="absolute inset-0 flex items-center justify-center scale-75">
                <VoiceVisualizer 
                  participantType="bot"
                  barWidth={3}
                  backgroundColor="transparent"
                  barColor="rgba(59, 130, 246, 0.6)"
                  barGap={2}
                  barMaxHeight={80}
                />
              </div>
              {/* Message display */}
              {lastMessage && (
                <div className="absolute bottom-4 left-4 right-4 text-sm text-white bg-black/40 rounded-lg p-2 backdrop-blur-sm">
                  {lastMessage}
                </div>
              )}
            </div>
          </div>
        </RTVIClientProvider>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
    </ExpandableVoice>
  );
};

export default RTVIWidget; 