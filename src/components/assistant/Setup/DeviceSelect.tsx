import { useEffect, useState, useCallback } from "react";
import { Mic, RefreshCw } from "lucide-react";
import { useRTVIClientMediaDevices } from "@pipecat-ai/client-react";
import { useRTVIClient } from "@pipecat-ai/client-react";
import React from "react";

import { Field } from "@/components/ui/field";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from "@/components/ui/select";

import { AudioIndicatorBar } from "./AudioIndicator";
import { Button } from "@/components/ui/button";

interface DeviceSelectProps {
  hideMeter: boolean;
}

// Define a type for MediaDeviceInfo to use in our fallback
interface SimpleMicDevice {
  deviceId: string;
  label: string;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  const client = useRTVIClient();
  const { availableMics, selectedMic, updateMic } = useRTVIClientMediaDevices();
  
  // Add fallback for direct device detection
  const [fallbackMics, setFallbackMics] = useState<SimpleMicDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [localSelectedMic, setLocalSelectedMic] = useState<string>("");

  // Direct device detection for fallback
  const detectDevicesDirectly = useCallback(async () => {
    try {
      // First get permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Filter for audio input devices
      const mics = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone (${device.deviceId.slice(0, 5)}...)`
        }));
      
      console.log("Directly detected mics:", mics);
      setFallbackMics(mics);
      
      // Clean up stream
      stream.getTracks().forEach(track => track.stop());
      
      return mics.length > 0;
    } catch (error) {
      console.error("Direct device detection failed:", error);
      return false;
    }
  }, []);

  // Request microphone access explicitly
  useEffect(() => {
    const requestMicAccess = async () => {
      try {
        setIsLoading(true);
        // Try direct device detection
        const devicesFound = await detectDevicesDirectly();
        setPermissionDenied(!devicesFound);
        
        console.log("Microphone access granted, found devices:", devicesFound);
      } catch (error) {
        console.error("Microphone access denied:", error);
        setPermissionDenied(true);
      } finally {
        setIsLoading(false);
      }
    };

    requestMicAccess();
  }, [refreshCount, detectDevicesDirectly]);

  // Debug available devices
  useEffect(() => {
    console.log("Hook available mics:", availableMics);
    console.log("Hook selected mic:", selectedMic);
    console.log("Fallback mics:", fallbackMics);
    
    // If hook didn't find mics but we have fallback mics, use the first one
    if (availableMics.length === 0 && fallbackMics.length > 0 && client) {
      console.log("Using fallback mic:", fallbackMics[0].deviceId);
      updateMic(fallbackMics[0].deviceId);
    }
  }, [availableMics, selectedMic, fallbackMics, client, updateMic]);

  // Update selected mic when available
  useEffect(() => {
    if (availableMics.length > 0) {
      if (selectedMic?.deviceId) {
        console.log("Using selected mic:", selectedMic.deviceId);
        updateMic(selectedMic.deviceId);
      } else {
        // Auto-select first mic if none selected
        console.log("Auto-selecting first mic:", availableMics[0].deviceId);
        updateMic(availableMics[0].deviceId);
      }
      setIsLoading(false);
    }
  }, [updateMic, selectedMic, availableMics]);

  // Handle retry/refresh
  const handleRefreshDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      await detectDevicesDirectly();
      // Increment refresh counter to trigger the useEffect
      setRefreshCount(prev => prev + 1);
    } catch (error) {
      console.error("Device refresh failed:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000); // Give time for devices to populate
    }
  }, [detectDevicesDirectly]);

  // Handle microphone selection change
  const handleMicChange = useCallback((value: string) => {
    console.log("Microphone selected:", value);
    setLocalSelectedMic(value);
    updateMic(value);
  }, [updateMic]);

  // Update local state when selectedMic changes
  useEffect(() => {
    if (selectedMic?.deviceId && selectedMic.deviceId !== localSelectedMic) {
      setLocalSelectedMic(selectedMic.deviceId);
    }
  }, [selectedMic, localSelectedMic]);

  // Use either hook devices or fallback devices
  const displayMics = availableMics.length > 0 ? availableMics : fallbackMics;
  const hasDevices = displayMics.length > 0;

  return (
    <div className="flex flex-col flex-wrap gap-4 w-full">
      <Field label="Microphone" error={permissionDenied} className="w-full">
        {permissionDenied ? (
          <div className="text-red-500 text-sm mb-2">
            Microphone access denied. Please allow microphone access in your browser settings.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => setRefreshCount(prev => prev + 1)}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Select
                  onValueChange={handleMicChange}
                  value={localSelectedMic || selectedMic?.deviceId || "default"}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoading ? "Loading devices..." : "Select microphone"} />
                  </SelectTrigger>
                  <SelectContent className="min-w-[200px]">
                    {!hasDevices ? (
                      <SelectItem value="default">
                        {isLoading ? "Loading devices..." : "No devices found"}
                      </SelectItem>
                    ) : (
                      displayMics.map((mic) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefreshDevices}
                disabled={isLoading}
                title="Refresh device list"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {!hideMeter && <AudioIndicatorBar />}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {hasDevices ? `${displayMics.length} device(s) found` : "Searching for devices..."}
                {availableMics.length === 0 && fallbackMics.length > 0 && " (using fallback detection)"}
              </span>
              {isLoading && <span>Refreshing devices...</span>}
            </div>
          </>
        )}
      </Field>

      {/* uncomment this section to add speaker selection
      <Field label="Speakers:">
        <Select
          onValueChange={(value) => handleSpeakerChange(value)}
          value={currentSpeaker?.device.deviceId || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select speaker" />
          </SelectTrigger>
          <SelectContent>
            {speakers.length === 0 ? (
              <SelectItem value="default">Use system default</SelectItem>
            ) : (
              speakers.map((m) => (
                <SelectItem key={m.device.deviceId} value={m.device.deviceId}>
                  {m.device.label || "Speaker " + (m.device.deviceId.slice(0, 5))}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </Field>
      */}
    </div>
  );
};

export default DeviceSelect;
