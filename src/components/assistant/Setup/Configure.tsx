import React, { useCallback, useContext } from "react";

import HelpTip from "@/components/ui/helptip";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { RTVIClientConfigOption } from "@pipecat-ai/client-js";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { AppContext } from "@/components/assistant/context";
import ConfigSelect from "@/components/assistant/Setup/ConfigSelect";
import DeviceSelect from "@/components/assistant/Setup/DeviceSelect";

interface ConfigureProps {
  state: string;
  startAudioOff?: boolean;
  inSession?: boolean;
  handleStartAudioOff?: () => void;
}

export const Configure: React.FC<ConfigureProps> = React.memo(
  ({ startAudioOff, state, inSession = false, handleStartAudioOff }) => {
    const { clientParams, setClientParams } = useContext(AppContext);
    const voiceClient = useRTVIClient();

    const handleServiceUpdate = useCallback(
      (newService: { [key: string]: string }) => {
        setClientParams({ services: newService });
      },
      [setClientParams]
    );

    const handleConfigOptionUpdate = useCallback(
      async (newConfigOptions: RTVIClientConfigOption[]) => {
        if (!voiceClient) {
          console.error("Voice client not available for config update");
          return;
        }
        
        try {
          const newConfig = await voiceClient.setConfigOptions(
            newConfigOptions,
            clientParams.config
          );
          setClientParams({ config: newConfig });
        } catch (error) {
          console.error("Error updating config options:", error);
        }
      },
      [voiceClient, clientParams.config, setClientParams]
    );

    return (
      <>
        <section className="flex flex-col flex-wrap gap-3 lg:gap-4">
          <DeviceSelect hideMeter={false} />
          <ConfigSelect
            state={state}
            onConfigUpdate={handleConfigOptionUpdate}
            onServiceUpdate={handleServiceUpdate}
            inSession={inSession}
          />
        </section>

        {!inSession && (
          <section className="flex flex-col gap-4 border-y border-primary-hairline py-4">
            <div className="flex flex-row justify-between items-center">
              <Label className="flex flex-row gap-1 items-center">
                Join with mic muted{" "}
                <HelpTip text="Start with microphone muted (click to unmute)" />
              </Label>
              <Switch
                checked={startAudioOff}
                onCheckedChange={handleStartAudioOff}
              />
            </div>
          </section>
        )}
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.startAudioOff === nextProps.startAudioOff &&
    prevProps.state === nextProps.state
);

Configure.displayName = "Configure";
