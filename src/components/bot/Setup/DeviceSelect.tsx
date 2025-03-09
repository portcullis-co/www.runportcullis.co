import React, { useEffect, useState } from "react";
import { Mic, AlertCircle } from "lucide-react";
import { useRTVIClientMediaDevices } from "realtime-ai-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AudioIndicatorBar } from "./AudioIndicator";
import { Button } from "@/components/ui/button";

interface DeviceSelectProps {
  hideMeter: boolean;
}

interface MicDevice {
  deviceId: string;
  label?: string;
  kind?: string;
  groupId?: string;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  // State for direct device detection
  const [directDevices, setDirectDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [permissionState, setPermissionState] = useState<
    "initial" | "requesting" | "granted" | "denied"
  >("initial");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get devices from the hook (may be using mock implementation)
  const hookResult = useRTVIClientMediaDevices();
  const { availableMics = [], selectedMic, updateMic } = hookResult || {};
  
  // Log hook result for debugging
  useEffect(() => {
    console.log("DeviceSelect: RTVI hook result:", hookResult);
    console.log("DeviceSelect: availableMics from hook:", availableMics);
    console.log("DeviceSelect: selectedMic from hook:", selectedMic);
  }, [hookResult, availableMics, selectedMic]);

  // Direct device detection using the browser's MediaDevices API
  const detectDevices = async () => {
    console.log("DeviceSelect: Starting direct device detection");
    setErrorMessage(null);
    
    try {
      if (!navigator.mediaDevices) {
        throw new Error("MediaDevices API not available in this browser");
      }

      setPermissionState("requesting");
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("DeviceSelect: Microphone permission granted, stream:", stream);
      
      // Get all devices after permission is granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("DeviceSelect: All devices:", devices);
      
      // Filter for audio input devices
      const microphones = devices.filter(device => device.kind === 'audioinput');
      console.log("DeviceSelect: Found microphones:", microphones);
      
      // Stop tracks from the permission request
      stream.getTracks().forEach(track => {
        console.log(`DeviceSelect: Stopping track: ${track.kind}`);
        track.stop();
      });
      
      setDirectDevices(microphones);
      setPermissionState("granted");
      
      // Select the first device if we have one and none is currently selected
      if (microphones.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(microphones[0].deviceId);
        
        // Update the RTVI client if the hook provides the function
        if (updateMic) {
          console.log("DeviceSelect: Auto-selecting first device:", microphones[0].deviceId);
          updateMic(microphones[0].deviceId);
        }
      }
    } catch (error) {
      console.error("DeviceSelect: Error detecting devices:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error detecting microphones");
      setPermissionState("denied");
    }
  };
  
  // Initial device detection
  useEffect(() => {
    if (permissionState === "initial") {
      detectDevices();
    }
  }, [permissionState]);
  
  // Handle device selection
  const handleDeviceSelect = (deviceId: string) => {
    console.log(`DeviceSelect: Device selected: ${deviceId}`);
    setSelectedDeviceId(deviceId);
    
    // Update the RTVI client if the hook provides the function
    if (updateMic) {
      updateMic(deviceId);
    }
  };
  
  // Effective devices: prefer direct devices if available, fall back to hook devices
  const effectiveDevices = directDevices.length > 0 ? directDevices : availableMics;
  const isLoading = permissionState === "requesting";
  const noDevices = permissionState === "granted" && effectiveDevices.length === 0;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none">
          Microphone
        </label>
        {permissionState === "denied" && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Permission denied
          </span>
        )}
      </div>
      
      <Select 
        value={selectedDeviceId || selectedMic?.deviceId || ''} 
        onValueChange={handleDeviceSelect}
        disabled={isLoading || noDevices}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            isLoading ? "Requesting access..." : 
            noDevices ? "No microphones detected" : 
            "Select a microphone"
          } />
        </SelectTrigger>
        <SelectContent>
          {effectiveDevices.length > 0 ? (
            effectiveDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>{device.label || `Microphone (${device.deviceId.slice(0, 5)}...)`}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-devices" disabled>
              {isLoading ? "Requesting access..." : "No microphones detected"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">
          Error: {errorMessage}
        </p>
      )}
      
      {permissionState === "denied" && (
        <p className="text-xs text-red-500 mt-1">
          Please allow microphone access in your browser settings to continue
        </p>
      )}
      
      {noDevices && (
        <p className="text-xs text-amber-500 mt-1">
          No microphones were detected. Please connect a microphone and try again.
        </p>
      )}
      
      {!hideMeter && permissionState === "granted" && (
        <div className="mt-2">
          <AudioIndicatorBar />
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={detectDevices} 
        disabled={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? "Detecting..." : "Refresh Microphones"}
      </Button>
    </div>
  );
};

export default DeviceSelect;
