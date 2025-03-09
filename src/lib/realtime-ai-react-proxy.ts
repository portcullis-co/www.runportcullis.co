import { createRequire } from 'module';
import React from 'react';
const require = createRequire(import.meta.url);

let reactPkg;
try {
  reactPkg = require('realtime-ai-react');
} catch (error) {
  // Provide mock implementations for SSR/build
  reactPkg = {
    useRTVIClient: () => null,
    useRTVIClientEvent: () => {},
    useRTVIClientTransportState: () => 'idle',
    useRTVIClientMediaDevices: () => ({
      availableMics: [],
      selectedMic: null,
      updateMic: () => {},
      audioInputDevices: [], 
      audioOutputDevices: []
    }),
    RTVIClientProvider: ({ children }: { children: React.ReactNode }) => children,
    RTVIClientAudio: () => null,
    VoiceVisualizer: () => null
  };
  console.warn('realtime-ai-react package not available, using mock implementation');
}

// Re-export all properties as named exports
export const {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
  useRTVIClientMediaDevices,
  RTVIClientProvider,
  RTVIClientAudio,
  VoiceVisualizer
} = reactPkg;

// Export everything else as a default export
export default reactPkg; 