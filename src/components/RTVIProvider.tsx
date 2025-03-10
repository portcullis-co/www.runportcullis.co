import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';
import { RTVIClientProvider, RTVIClientAudio } from '@pipecat-ai/client-react';
import React, { ReactNode, useState, useEffect } from 'react';

// Create transport with proper configuration
const transport = new DailyTransport({
  dailyFactoryOptions: {
    audioSource: true,
    videoSource: false,
    subscribeToTracksAutomatically: true,
  }
});

// Create RTVI client with proper configuration
const rtviClient = new RTVIClient({
  transport: transport as any,
  enableMic: true,
  enableCam: false,
  timeout: 15000,
  params: {
    baseUrl: '/api/assistant',
    endpoints: {
      connect: 'connect',
    },
    // Add TTS configuration
    config: [
      {
        service: "tts",
        options: [
          { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
          { name: "model", value: "eleven_turbo_v2" },
          { name: "output_format", value: "pcm_24000" },
          { name: "optimize_streaming_latency", value: 4 },
          { name: "stability", value: 0.75 },
          { name: "similarity_boost", value: 0.75 },
          { name: "latency", value: 1 }
        ],
      }
    ],
  },
});

export function RTVIProvider({ children }: { children: ReactNode }) {
  const [transportState, setTransportState] = useState<string>('initializing');
  
  useEffect(() => {
    const handleTransportStateChanged = (state: string) => {
      console.log('Transport state changed:', state);
      setTransportState(state);
    };
    
    rtviClient.on('transportStateChanged', handleTransportStateChanged);
    
    return () => {
      rtviClient.off('transportStateChanged', handleTransportStateChanged);
    };
  }, []);
  
  return (
    <RTVIClientProvider client={rtviClient}>
      {children}
      <RTVIClientAudio />
      
      {/* Simple debug panel */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          maxWidth: '300px',
          zIndex: 1000,
        }}
      >
        RTVI Audio Status: Active<br />
        TTS: ElevenLabs (PCM)<br />
        Transport: {transportState}
      </div>
    </RTVIClientProvider>
  );
} 