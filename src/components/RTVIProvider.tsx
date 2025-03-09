import { RTVIClient } from 'realtime-ai';
import { DailyTransport } from 'realtime-ai-daily';
import { RTVIClientProvider } from 'realtime-ai-react';
import React, { ReactNode } from 'react';

const transport = new DailyTransport();
const rtviClient = new RTVIClient({
  transport: transport as any,
  params: {
    baseUrl: '/api/assistant',
    endpoints: {
      connect: 'connect',
    }
  },
  enableMic: true,
  enableCam: false,
  timeout: 15000,
});

export function RTVIProvider({ children }: { children: ReactNode }) {
  return (
    <RTVIClientProvider client={rtviClient}>
      {children}
    </RTVIClientProvider>
  );
} 