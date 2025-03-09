import { createRequire } from 'module';
import React, { useEffect, useState } from 'react';
const require = createRequire(import.meta.url);

// Mock implementation of media devices hook for development
const createMockMediaDevicesHook = () => {
  // Create a stateful hook for the mock implementation
  return () => {
    const [mockDevices, setMockDevices] = useState({
      availableMics: [] as MediaDeviceInfo[],
      selectedMic: null as MediaDeviceInfo | null,
      audioInputDevices: [] as MediaDeviceInfo[],
      audioOutputDevices: [] as MediaDeviceInfo[]
    });
    const [initialized, setInitialized] = useState(false);

    // Mock update function that actually updates the selected device
    const updateMic = (deviceId: string) => {
      console.log("[Proxy] updateMic called with deviceId:", deviceId);
      const device = mockDevices.availableMics.find(mic => mic.deviceId === deviceId);
      
      if (device) {
        console.log("[Proxy] Found device to select:", device);
        setMockDevices(prev => ({
          ...prev,
          selectedMic: device
        }));
      } else {
        console.warn("[Proxy] No device found with ID:", deviceId);
      }
    };

    // Initialize with real browser devices if available
    useEffect(() => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && !initialized) {
        console.log("[Proxy] Initializing media devices...");
        
        // First try to get permission which helps get device labels
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            console.log("[Proxy] Got microphone permission, stopping stream");
            stream.getTracks().forEach(track => track.stop());
            
            // Now enumerate devices after getting permission
            return navigator.mediaDevices.enumerateDevices();
          })
          .catch(err => {
            console.warn("[Proxy] Error getting permission:", err);
            // Still try to enumerate even if permission failed
            return navigator.mediaDevices.enumerateDevices();
          })
          .then(devices => {
            const mics = devices.filter(device => device.kind === 'audioinput');
            const speakers = devices.filter(device => device.kind === 'audiooutput');
            
            console.log("[Proxy] Enumerated devices:", { 
              mics: mics.length, 
              speakers: speakers.length 
            });
            
            setMockDevices({
              availableMics: mics,
              selectedMic: mics.length > 0 ? mics[0] : null,
              audioInputDevices: mics,
              audioOutputDevices: speakers
            });
            
            setInitialized(true);
            console.log("[Proxy] Media devices initialized");
          })
          .catch(err => {
            console.error("[Proxy] Error enumerating devices:", err);
          });
      }
    }, [initialized]);

    return {
      ...mockDevices,
      updateMic
    };
  };
};

// Create an object to hold our exports
let rtviPackage = {
  useRTVIClient: () => null,
  useRTVIClientEvent: () => {},
  useRTVIClientTransportState: () => 'idle',
  useRTVIClientMediaDevices: createMockMediaDevicesHook(),
  RTVIClientProvider: ({ children }: { children: React.ReactNode }) => children,
  RTVIClientAudio: () => null,
  VoiceVisualizer: () => null
};

// Try to load the real package if available
try {
  console.log("[Proxy] Attempting to load @pipecat-ai/client-react...");
  // First try named imports
  try {
    const imported = require('@pipecat-ai/client-react');
    if (imported) {
      console.log("[Proxy] Successfully loaded @pipecat-ai/client-react");
      // Use the imported package or fall back to our mock implementations
      rtviPackage = {
        ...rtviPackage,
        ...imported.default || imported
      };
    }
  } catch (namedError) {
    console.warn("[Proxy] Error with named imports:", namedError);
    // Try default import
    try {
      const defaultImported = require('@pipecat-ai/client-react').default;
      if (defaultImported) {
        console.log("[Proxy] Successfully loaded default export");
        rtviPackage = {
          ...rtviPackage,
          ...defaultImported
        };
      }
    } catch (defaultError) {
      console.warn("[Proxy] Error with default import:", defaultError);
      console.warn("[Proxy] Using mock implementation for @pipecat-ai/client-react");
    }
  }
} catch (error) {
  console.warn("[Proxy] Package @pipecat-ai/client-react not available, using mock implementation");
  console.error("[Proxy] Error:", error);
}

// Export everything from our package object
export const {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
  useRTVIClientMediaDevices,
  RTVIClientProvider,
  RTVIClientAudio,
  VoiceVisualizer
} = rtviPackage;

// Also export as default
export default rtviPackage;