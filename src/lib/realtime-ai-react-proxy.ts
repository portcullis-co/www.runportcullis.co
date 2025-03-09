import React, { useEffect, useState } from 'react';

// Detect if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Mock implementation of media devices hook for development and SSR
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
      if (isBrowser && navigator.mediaDevices && !initialized) {
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

// Empty component to use as provider in SSR
const EmptyProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

// Create a base mock implementation
const mockImplementation = {
  useRTVIClient: () => null,
  useRTVIClientEvent: () => {},
  useRTVIClientTransportState: () => 'idle',
  useRTVIClientMediaDevices: createMockMediaDevicesHook(),
  RTVIClientProvider: EmptyProvider,
  RTVIClientAudio: () => null,
  VoiceVisualizer: () => null
};

// Create an object to hold our exports
let rtviPackage = { ...mockImplementation };

// Only try to load the real package in browser
if (isBrowser) {
  try {
    console.log("[Proxy] Attempting to dynamically import @pipecat-ai/client-react in browser...");
    
    // Using dynamic import would be better, but for now we'll use a safer approach
    const importModule = () => {
      try {
        // Access window.require if available - this is a simplified approach
        const windowWithRequire = window as unknown as { require?: (id: string) => any };
        const mod = windowWithRequire.require ? windowWithRequire.require('@pipecat-ai/client-react') : null;
        return mod;
      } catch (e) {
        console.warn("[Proxy] Cannot import @pipecat-ai/client-react:", e);
        return null;
      }
    };
    
    const importedModule = importModule();
    
    if (importedModule) {
      console.log("[Proxy] Successfully loaded @pipecat-ai/client-react");
      rtviPackage = {
        ...rtviPackage,
        ...(importedModule.default || importedModule)
      };
    }
  } catch (error) {
    console.warn("[Proxy] Package @pipecat-ai/client-react not available, using mock implementation");
    console.error("[Proxy] Error:", error);
  }
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