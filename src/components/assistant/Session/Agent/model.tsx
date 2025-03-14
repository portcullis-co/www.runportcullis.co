import React, { useContext } from "react";
import { RTVIClientConfigOption, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";

import { AppContext } from "@/components/assistant/context";

const ModelBadge: React.FC = () => {
  const { clientParams } = useContext(AppContext);

  const [model, setModel] = React.useState<string | undefined>(
    clientParams.config
      .find((c) => c.service === "llm")
      ?.options.find((p) => p.name === "model")?.value as string
  );

  useRTVIClientEvent(
    RTVIEvent.Config,
    async (config: RTVIClientConfigOption[]) => {
      const m = config
        .find((c) => c.service === "llm")
        ?.options.find((p) => p.name === "model")?.value as string;

      setModel(m);
    }
  );

  return <div className="absolute top-2 right-2 py-1 px-2 text-xs bg-black/50 text-white rounded-md">{model}</div>;
};

export default ModelBadge;
