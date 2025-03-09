import React, { useEffect } from "react";
import { Mic } from "lucide-react";
import { useRTVIClientMediaDevices } from "realtime-ai-react";

import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/assistant-select";

import { AudioIndicatorBar } from "./AudioIndicator";

interface DeviceSelectProps {
  hideMeter: boolean;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false,
}) => {
  const { availableMics = [], selectedMic, updateMic } = useRTVIClientMediaDevices() || {};

  useEffect(() => {
    if (updateMic && selectedMic?.deviceId) {
      updateMic(selectedMic.deviceId);
    }
  }, [updateMic, selectedMic]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <Field label="Microphone" error={false}>
        <Select
          onChange={(e) => updateMic && updateMic(e.currentTarget.value)}
          value={selectedMic?.deviceId || ""}
          icon={<Mic size={24} />}
        >
          {!availableMics || availableMics.length === 0 ? (
            <option value="">Loading devices...</option>
          ) : (
            availableMics.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label || `Microphone ${mic.deviceId}`}
              </option>
            ))
          )}
        </Select>
        {!hideMeter && <AudioIndicatorBar />}
      </Field>

      {/* uncomment this section to add speaker selection
      <Field label="Speakers:">
        <Select
          icon={<Speaker size={24} />}
          onChange={(e) => handleSpeakerChange(e.target.value)}
          defaultValue={currentSpeaker?.device.deviceId}
        >
          {speakers.length === 0 ? (
            <option value="default">Use system default</option>
          ) : (
            speakers.map((m) => (
              <option key={m.device.deviceId} value={m.device.deviceId}>
                {m.device.label}
              </option>
            ))
          )}
        </Select>
      </Field>
      */}
    </div>
  );
};

export default DeviceSelect;
