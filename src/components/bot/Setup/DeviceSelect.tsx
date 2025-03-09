import React, { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { useRTVIClientMediaDevices } from "realtime-ai-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AudioIndicatorBar } from "./AudioIndicator";

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
  const [permissionState, setPermissionState] = useState<
    "initial" | "requesting" | "granted" | "denied"
  >("initial");
  
  // Use the hook to get device info
  const { availableMics = [], selectedMic, updateMic } = useRTVIClientMediaDevices() || {};

  // Request microphone permission on component mount
  useEffect(() => {
    async function requestPermission() {
      // Only request permission if we're in a browser and haven't already
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || permissionState !== "initial") {
        return;
      }

      setPermissionState("requesting");
      console.log("Requesting microphone permissions...");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted, found tracks:", stream.getTracks());
        
        // Stop the tracks after we've gotten permission
        stream.getTracks().forEach(track => track.stop());
        
        setPermissionState("granted");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setPermissionState("denied");
      }
    }

    requestPermission();
  }, [permissionState]);

  // Handle microphone selection
  const handleMicSelect = (deviceId: string) => {
    if (updateMic && deviceId) {
      console.log("Selecting microphone:", deviceId);
      updateMic(deviceId);
    }
  };

  // Debug log for devices
  useEffect(() => {
    console.log("Available microphones:", availableMics);
    console.log("Selected microphone:", selectedMic);
  }, [availableMics, selectedMic]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Microphone
        </label>
        {permissionState === "denied" && (
          <span className="text-xs text-red-500">Permission denied</span>
        )}
      </div>
      
      <Select 
        value={selectedMic?.deviceId} 
        onValueChange={handleMicSelect}
        disabled={permissionState !== "granted" || !availableMics.length}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a microphone" />
        </SelectTrigger>
        <SelectContent>
          {permissionState === "granted" && availableMics.length > 0 ? (
            availableMics.map((mic) => (
              <SelectItem key={mic.deviceId} value={mic.deviceId}>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>{mic.label || `Microphone (${mic.deviceId.slice(0, 5)}...)`}</span>
                </div>
              </SelectItem>
            ))
          ) : permissionState === "granted" ? (
            <SelectItem value="no-devices" disabled>
              No microphones detected
            </SelectItem>
          ) : (
            <SelectItem value="loading" disabled>
              {permissionState === "requesting" ? "Requesting access..." : "Needs microphone permission"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {!hideMeter && permissionState === "granted" && (
        <div className="mt-1">
          <AudioIndicatorBar />
        </div>
      )}
      
      {permissionState === "denied" && (
        <p className="text-xs text-red-500 mt-1">
          Please allow microphone access in your browser settings to continue
        </p>
      )}
    </div>
  );
};

export default DeviceSelect;
