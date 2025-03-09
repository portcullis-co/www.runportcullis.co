import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const reactPkg = require('realtime-ai-react');

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