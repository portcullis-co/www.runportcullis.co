"use client";

import React from "react";
import { RTVIClient, Transport, LLMHelper } from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { AppProvider } from "@/components/assistant/context";
import App from "@/components/assistant/App";
import { BOT_READY_TIMEOUT, defaultConfig, defaultServices } from "@/rtvi.config";
import { Loader2 } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function AssistantIsland() {
  const [voiceClient, setVoiceClient] = React.useState<RTVIClient | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function initializeClient() {
      try {
        console.log("Initializing RTVI client...");
        const client = new RTVIClient({
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
        client.registerHelper("llm", llmHelper);

        console.log("RTVI client initialized successfully:", client);
        setVoiceClient(client);
      } catch (err) {
        console.error("Failed to initialize RTVI client:", err);
        setError("Failed to initialize voice client. Please try again later.");
      } finally {
        setIsInitializing(false);
      }
    }

    initializeClient();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-10 w-full min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Initializing voice client...</p>
      </div>
    );
  }

  if (error || !voiceClient) {
    return (
      <div className="flex flex-col items-center justify-center p-10 w-full min-h-[400px]">
        <p className="text-lg font-medium text-red-500">{error || "Failed to initialize voice client."}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RTVIClientProvider client={voiceClient}>
      <AppProvider>
        <TooltipProvider>
          <main className="flex flex-col items-center justify-center w-full">
            <div id="app" className="w-full max-w-md">
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