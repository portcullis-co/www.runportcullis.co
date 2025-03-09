import React, { useEffect, useState } from "react";
import { Mic, AlertCircle, RefreshCw } from "lucide-react";
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
  // State for microphone devices
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [permissionState, setPermissionState] = useState<
    "initial" | "requesting" | "granted" | "denied"
  >("initial");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to detect and enumerate microphones
  const detectMicrophones = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    console.log("DeviceSelect: Starting microphone detection");
    
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        throw new Error("MediaDevices API not available in this browser");
      }

      setPermissionState("requesting");
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("DeviceSelect: Microphone permission granted");
      
      // Enumerate all devices
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      console.log("DeviceSelect: All devices:", allDevices);
      
      // Filter for microphones only
      const microphones = allDevices.filter(device => device.kind === 'audioinput');
      console.log("DeviceSelect: Found microphones:", microphones);
      
      // Stop the stream tracks
      stream.getTracks().forEach(track => {
        console.log(`DeviceSelect: Stopping track: ${track.kind}`);
        track.stop();
      });
      
      // Update state with devices
      setDevices(microphones);
      setPermissionState("granted");
      
      // Auto-select first device if available
      if (microphones.length > 0 && !selectedDeviceId) {
        console.log("DeviceSelect: Auto-selecting first device:", microphones[0].deviceId);
        setSelectedDeviceId(microphones[0].deviceId);
      }
    } catch (error) {
      console.error("DeviceSelect: Error detecting microphones:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      setPermissionState("denied");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize microphone detection on component mount
  useEffect(() => {
    detectMicrophones();
  }, []);
  
  // Handle microphone selection
  const handleDeviceSelect = (deviceId: string) => {
    console.log("DeviceSelect: Selected device:", deviceId);
    setSelectedDeviceId(deviceId);
    
    // You would normally call updateMic here, but we're avoiding the RTVI hook
    // Instead, we'll store the selection in state and let the parent handle it if needed
  };
  
  const noDevices = permissionState === "granted" && devices.length === 0;
  
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
        value={selectedDeviceId} 
        onValueChange={handleDeviceSelect}
        disabled={isLoading || noDevices}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            isLoading ? "Detecting microphones..." : 
            noDevices ? "No microphones found" : 
            "Select a microphone"
          } />
        </SelectTrigger>
        <SelectContent>
          {devices.length > 0 ? (
            devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span>{device.label || `Microphone (${device.deviceId.slice(0, 5)}...)`}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-devices" disabled>
              {isLoading ? "Detecting microphones..." : "No microphones found"}
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
      
      {!hideMeter && permissionState === "granted" && selectedDeviceId && (
        <div className="mt-2">
          <AudioIndicatorBar />
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={detectMicrophones} 
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Detecting...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Refresh Microphones
          </>
        )}
      </Button>
    </div>
  );
};

export default DeviceSelect;
