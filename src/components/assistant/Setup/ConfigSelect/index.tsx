import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Languages } from "lucide-react";
import { RTVIClientConfigOption } from "@pipecat-ai/client-js";

import { AppContext } from "@/components/assistant/context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  defaultLLMPrompt,
  LANGUAGES,
  PRESET_CHARACTERS,
} from "@/rtvi.config";
import { cn } from "@/lib/utils";

import Prompt from "../Prompt";
import StopSecs from "../StopSecs";

type CharacterData = {
  name: string;
  prompt: string;
  voice: string;
};

interface ConfigSelectProps {
  state: string;
  onServiceUpdate: (service: { [key: string]: string }) => void;
  onConfigUpdate: (configOption: RTVIClientConfigOption[]) => void;
  inSession?: boolean;
}

export const ConfigSelect: React.FC<ConfigSelectProps> = ({
  onConfigUpdate,
  onServiceUpdate,
  state,
  inSession = false,
}) => {
  const { language, setLanguage, clientParams } =
    useContext(AppContext);

  const [vadStopSecs, setVadStopSecs] = useState<number>(
    (
      clientParams.config
        .find((c) => c.service === "vad")
        ?.options.find((p) => p.name === "params")?.value as {
        stop_secs: number;
      }
    )?.stop_secs
  );
  const [showPrompt, setshowPrompt] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Modal effect
    const current = modalRef.current;

    if (current && showPrompt) {
      current.inert = true;
      current.showModal();
      current.inert = false;
    }
    return () => current?.close();
  }, [showPrompt]);

  const composeConfig = useCallback(
    (language: number) => {
      // Always use default character (index 0)
      const characterData = PRESET_CHARACTERS[0] as CharacterData;

      // Compose new config object
      const updatedConfig: RTVIClientConfigOption[] = [
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value:
                language !== 0
                  ? LANGUAGES[language].default_voice
                  : characterData.voice,
            },
            {
              name: "model",
              value: LANGUAGES[language].tts_model,
            },
            {
              name: "language",
              value: LANGUAGES[language].value,
            },
          ],
        },
        {
          service: "llm",
          options: [
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content:
                    language !== 0
                      ? defaultLLMPrompt +
                        `\nRespond only in ${LANGUAGES[language].label} please.`
                          .split("\n")
                          .map((line) => line.trim())
                          .join("\n")
                      : characterData.prompt
                          .split("\n")
                          .map((line) => line.trim())
                          .join("\n"),
                },
              ],
            },
          ],
        },
        {
          service: "stt",
          options: [
            {
              name: "model",
              value: LANGUAGES[language].stt_model,
            },
            {
              name: "language",
              value: LANGUAGES[language].value,
            },
          ],
        },
      ];

      onConfigUpdate(updatedConfig);
    },
    [onConfigUpdate]
  );

  return (
    <>
      <dialog ref={modalRef} className="p-0 rounded-lg shadow-lg bg-white">
        <Prompt
          characterPrompt={PRESET_CHARACTERS[0].prompt}
          handleUpdate={(prompt) => {
            onConfigUpdate([
              {
                service: "llm",
                options: [{ name: "initial_messages", value: prompt }],
              },
            ]);
          }}
          handleClose={() => setshowPrompt(false)}
        />
      </dialog>
      <div className="flex flex-col flex-wrap gap-4">
        <Field label="Language" error={false}>
          <Select
            value={language.toString()}
            onValueChange={(value) => {
              composeConfig(parseInt(value));
              setLanguage(parseInt(value));
            }}
          >
            <SelectTrigger className="w-full">
              <Languages className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang, i) => (
                <SelectItem key={lang.label} value={i.toString()}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Accordion type="single" collapsible>
          <AccordionItem value="voice">
            <AccordionTrigger>Voice config</AccordionTrigger>
            <AccordionContent>
              <StopSecs
                vadStopSecs={vadStopSecs}
                handleChange={(v) => {
                  setVadStopSecs(v);

                  onConfigUpdate([
                    {
                      service: "vad",
                      options: [{ name: "params", value: { stop_secs: v } }],
                    },
                  ]);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

// Export for usage in Astro
export default ConfigSelect;
