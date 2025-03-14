"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";
import { LLMHelper, RTVIClient, Transport } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import React from "react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { Loader2 } from "lucide-react";
import Splash from "@/components/assistant/Splash";
import App from "@/components/assistant/App";
import { AppProvider } from "@/components/assistant/context";
import {
  BOT_READY_TIMEOUT,
  defaultConfig,
  defaultServices,
} from "@/rtvi.config";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const voiceClientRef = useRef<RTVIClient | null>(null);
  const [isClientInitialized, setIsClientInitialized] = useState(false);

  useEffect(() => {
    if (!showSplash || voiceClientRef.current) {
      return;
    }

    console.log("Initializing RTVI client...");
    try {
      const voiceClient = new RTVIClient({
        transport: new DailyTransport(),
        params: {
          baseUrl: import.meta.env.PIPECAT_API_URL || "/api/assistant",
          endpoints: {
            connect: "/connect",
          },
          requestData: {
            services: defaultServices,
            config: defaultConfig,
          },
        },
        timeout: BOT_READY_TIMEOUT,
      });

      const llmHelper = new LLMHelper({});
      voiceClient.registerHelper("llm", llmHelper);

      voiceClientRef.current = voiceClient;
      console.log("RTVI client initialized successfully:", voiceClient);
      setIsClientInitialized(true);
    } catch (error) {
      console.error("Failed to initialize RTVI client:", error);
    }
  }, [showSplash]);

  // Show loading state while client initializes
  if (!isClientInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Initializing voice client...</p>
      </div>
    );
  }

  return (
    <RTVIClientProvider client={voiceClientRef.current!}>
      <AppProvider>
        <TooltipProvider>
          <main>
            <div id="app">
              <App />
            </div>
          </main>
          <aside id="tray" />
        </TooltipProvider>
      </AppProvider>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}