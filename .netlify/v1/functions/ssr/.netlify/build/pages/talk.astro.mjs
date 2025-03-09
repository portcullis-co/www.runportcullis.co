import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { a as cn, d as Button, $ as $$MainLayout } from "../chunks/main-layout_BsXR2W6X.mjs";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { CircleHelp, ChevronDown, Languages, Mic, Loader2, X, Pause, MicOff, StopCircle, LineChart, Settings, LogOut, CircleAlert, Ear } from "lucide-react";
import * as React from "react";
import React__default, { createContext, useState, useEffect, useContext, useRef, useCallback, memo } from "react";
import { createRequire } from "module";
import { d as defaultServices, a as defaultConfig, L as LLM_MODEL_CHOICES, e as LANGUAGES, P as PRESET_CHARACTERS, f as defaultLLMPrompt } from "../chunks/rtvi.config_DBD_TWde.mjs";
import { createPortal } from "react-dom";
import { S as StatsAggregator } from "../chunks/stats_aggregator_B-k-k6Vo.mjs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, cx } from "class-variance-authority";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import Image from "next/image.js";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useDebounce } from "@uidotdev/usehooks";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { s as styles, a as styles$1, b as styles$2, c as styles$3 } from "../chunks/talk.d3c53532_AHQwKC51.mjs";
import clsx from "clsx";
import { Sparklines, SparklinesBars, SparklinesLine, SparklinesReferenceLine } from "react-sparklines";
import { renderers } from "../renderers.mjs";
const require$1 = createRequire(import.meta.url);
const rtviPkg = require$1("realtime-ai");
const { RTVIClient, RTVIError, RTVIEvent, RTVIMessage } = rtviPkg;
const require2 = createRequire(import.meta.url);
const reactPkg = require2("realtime-ai-react");
const {
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientTransportState,
  useRTVIClientMediaDevices,
  RTVIClientProvider,
  RTVIClientAudio,
  VoiceVisualizer
} = reactPkg;
const AppContext = createContext({
  character: 0,
  setCharacter: () => {
    throw new Error("setCharacter function must be overridden");
  },
  language: 0,
  setLanguage: () => {
    throw new Error("setLanguage function must be overridden");
  },
  clientParams: {
    config: defaultConfig,
    services: defaultServices
  },
  setClientParams: () => {
    throw new Error("updateVoiceClientParams function must be overridden");
  }
});
AppContext.displayName = "AppContext";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const HelpTip = ({ text, className }) => {
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { children: /* @__PURE__ */ jsx(
      CircleHelp,
      {
        size: 16,
        className: cn("text-primary-400 hidden md:block", className)
      }
    ) }),
    /* @__PURE__ */ jsx(TooltipContent, { asChild: true, children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: text }) })
  ] });
};
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "pb-4 pt-0", children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const Field = ({
  className,
  label,
  error,
  children
}) => /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col items-start gap-2 w-full", className), children: [
  label && /* @__PURE__ */ jsx(Label, { className: "font-medium text-sm", children: label }),
  children,
  error && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-red-500", children: error })
] });
Field.displayName = "Field";
const selectVariants = cva(
  "appearance-none bg-none bg-white bg-selectArrow bg-no-repeat bg-selectArrow flex h-12 px-3 pr-10 w-full rounded-xl border border-primary-200 text-sm ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        danger: "border-red-500 text-red-500 focus-visible:ring-red-500 placeholder:text-red-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Select = React.forwardRef(
  ({
    variant,
    className,
    children,
    icon,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      icon && /* @__PURE__ */ jsx("div", { className: "absolute size-9 left-0 top-0 flex items-center justify-center", children: icon }),
      /* @__PURE__ */ jsx(
        "select",
        {
          ref,
          className: cn(
            selectVariants({ variant }),
            icon && "pl-9",
            className
          ),
          ...props,
          children
        }
      )
    ] });
  }
);
Select.displayName = "Select";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const Prompt = ({
  handleUpdate,
  handleClose,
  characterPrompt
}) => {
  const voiceClient = useRTVIClient();
  const [prompt, setPrompt] = useState(
    void 0
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    if (!characterPrompt) return;
    setPrompt([
      {
        role: "system",
        content: characterPrompt.split("\n").map((line) => line.trim()).join("\n")
      }
    ]);
  }, [characterPrompt]);
  function save() {
    if (!voiceClient || !prompt) return;
    handleUpdate(prompt);
    setHasUnsavedChanges(false);
  }
  const updateContextMessage = (index, content) => {
    setPrompt((prev) => {
      if (!prev) return prev;
      const newPrompt = [...prev];
      newPrompt[index].content = content;
      return newPrompt;
    });
    setHasUnsavedChanges(true);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-svw max-w-full md:max-w-md lg:max-w-lg", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "LLM Prompt" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: prompt?.map((message, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 items-start", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-sm", children: message.role }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          value: message.content,
          rows: prompt?.length <= 1 ? 10 : 5,
          onChange: (e) => updateContextMessage(i, e.currentTarget.value),
          className: "text-sm w-full whitespace-pre-wrap"
        }
      )
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs(CardFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: handleClose, children: "Close" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: hasUnsavedChanges ? "default" : "outline",
          onClick: () => {
            save();
            handleClose();
          },
          disabled: !hasUnsavedChanges,
          children: "Update"
        }
      )
    ] })
  ] });
};
const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-primary-200", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 bg-white rounded-full border-2 border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
const StopSecs = ({
  vadStopSecs = 0.3,
  handleChange
}) => {
  const [stopSecs, setStopSecs] = useState(vadStopSecs);
  const debouncedUpdate = useDebounce(stopSecs, 500);
  const handleValueChange = (value) => {
    if (value[0] === stopSecs) return;
    setStopSecs(value[0]);
  };
  useEffect(() => {
    if (debouncedUpdate !== vadStopSecs) {
      handleChange(debouncedUpdate);
    }
  }, [debouncedUpdate, handleChange, vadStopSecs]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-2", children: [
    /* @__PURE__ */ jsxs(Label, { className: "flex flex-row gap-1 items-center shrink-0", children: [
      "Speech stop timeout",
      /* @__PURE__ */ jsx(HelpTip, { text: "Timeout (seconds) voice activity detection waits after you stop speaking" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
      /* @__PURE__ */ jsx(
        Slider,
        {
          value: [stopSecs],
          min: 0.1,
          max: 2,
          step: 0.1,
          onValueChange: handleValueChange
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "w-24", children: [
        stopSecs,
        "s"
      ] })
    ] })
  ] });
};
const llmProviders = LLM_MODEL_CHOICES.map((choice) => ({
  label: choice.label,
  value: choice.value,
  models: choice.models
}));
const tileCX = cx(
  "*:opacity-50 cursor-pointer rounded-xl px-4 py-3 bg-white border border-primary-200 bg-white select-none ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);
const tileActiveCX = cx("*:opacity-100 bg-primary-100/70 border-transparent");
const ConfigSelect = ({
  onConfigUpdate,
  onServiceUpdate,
  state,
  inSession = false
}) => {
  const { character, setCharacter, language, setLanguage, clientParams } = useContext(AppContext);
  const [llmProvider, setLlmProvider] = useState(
    clientParams.services.llm
  );
  const [llmModel, setLlmModel] = useState(
    clientParams.config.find((c) => c.service === "llm")?.options.find((p) => p.name === "model")?.value
  );
  const [vadStopSecs, setVadStopSecs] = useState(
    clientParams.config.find((c) => c.service === "vad")?.options.find((p) => p.name === "params")?.value?.stop_secs
  );
  const [showPrompt, setshowPrompt] = useState(false);
  const modalRef = useRef(null);
  useEffect(() => {
    const current = modalRef.current;
    if (current && showPrompt) {
      current.inert = true;
      current.showModal();
      current.inert = false;
    }
    return () => current?.close();
  }, [showPrompt]);
  const composeConfig = useCallback(
    (character2, language2) => {
      const characterData = PRESET_CHARACTERS[character2];
      const updatedConfig = [
        {
          service: "tts",
          options: [
            {
              name: "voice",
              value: language2 !== 0 ? LANGUAGES[language2].default_voice : characterData.voice
            },
            {
              name: "model",
              value: LANGUAGES[language2].tts_model
            },
            {
              name: "language",
              value: LANGUAGES[language2].value
            }
          ]
        },
        {
          service: "llm",
          options: [
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content: language2 !== 0 ? defaultLLMPrompt + `
Respond only in ${LANGUAGES[language2].label} please.`.split("\n").map((line) => line.trim()).join("\n") : characterData.prompt.split("\n").map((line) => line.trim()).join("\n")
                }
              ]
            }
          ]
        },
        {
          service: "stt",
          options: [
            {
              name: "model",
              value: LANGUAGES[language2].stt_model
            },
            {
              name: "language",
              value: LANGUAGES[language2].value
            }
          ]
        }
      ];
      onConfigUpdate(updatedConfig);
    },
    [onConfigUpdate]
  );
  const availableModels = LLM_MODEL_CHOICES.find(
    (choice) => choice.value === llmProvider
  )?.models;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("dialog", { ref: modalRef, children: /* @__PURE__ */ jsx(
      Prompt,
      {
        characterPrompt: PRESET_CHARACTERS[character].prompt,
        handleUpdate: (prompt) => {
          onConfigUpdate([
            {
              service: "llm",
              options: [{ name: "initial_messages", value: prompt }]
            }
          ]);
        },
        handleClose: () => setshowPrompt(false)
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Language", error: false, children: /* @__PURE__ */ jsx(
        Select,
        {
          onChange: (e) => {
            composeConfig(character, parseInt(e.currentTarget.value));
            setLanguage(parseInt(e.currentTarget.value));
          },
          value: language,
          icon: /* @__PURE__ */ jsx(Languages, { size: 24 }),
          children: LANGUAGES.map((lang, i) => /* @__PURE__ */ jsx("option", { value: i, children: lang.label }, lang.label))
        }
      ) }),
      /* @__PURE__ */ jsxs(Accordion, { type: "single", collapsible: true, children: [
        language === 0 && /* @__PURE__ */ jsxs(AccordionItem, { value: "character", children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { children: "Character" }),
          /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx(Field, { error: false, children: /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col md:flex-row gap-2", children: [
            /* @__PURE__ */ jsx(
              Select,
              {
                disabled: inSession && !["ready", "idle"].includes(state),
                className: "flex-1",
                value: character,
                onChange: (e) => {
                  setCharacter(parseInt(e.currentTarget.value));
                  composeConfig(
                    parseInt(e.currentTarget.value),
                    language
                  );
                },
                children: PRESET_CHARACTERS.map(({ name }, i) => /* @__PURE__ */ jsx("option", { value: i, children: name }, `char-${i}`))
              }
            ),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setshowPrompt(true), children: "Customize" })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs(AccordionItem, { value: "llm", children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { children: "LLM options" }),
          /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs(Field, { error: false, children: [
            !inSession && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Label, { children: "Provider" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: llmProviders.map(({ value, label }) => /* @__PURE__ */ jsx(
                "div",
                {
                  tabIndex: 0,
                  className: cn(
                    tileCX,
                    value === llmProvider && tileActiveCX
                  ),
                  onClick: () => {
                    if (value === llmProvider) return;
                    setLlmProvider(value);
                    const defaultProviderModel = llmProviders.find(
                      (p) => p.value === value
                    )?.models[0].value;
                    setLlmModel(defaultProviderModel);
                    onServiceUpdate({ llm: value });
                    onConfigUpdate([
                      {
                        service: "llm",
                        options: [
                          {
                            name: "model",
                            value: defaultProviderModel
                          }
                        ]
                      }
                    ]);
                  },
                  children: /* @__PURE__ */ jsx(
                    Image,
                    {
                      src: `/logo-${value}.svg`,
                      alt: label,
                      width: "200",
                      height: "60",
                      className: "user-select-none pointer-events-none"
                    }
                  )
                },
                value
              )) })
            ] }),
            /* @__PURE__ */ jsx(Label, { children: "Model" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                onChange: (e) => {
                  setLlmModel(e.currentTarget.value);
                  onConfigUpdate([
                    {
                      service: "llm",
                      options: [
                        { name: "model", value: e.currentTarget.value }
                      ]
                    }
                  ]);
                },
                value: llmModel,
                children: availableModels?.map(({ value, label }) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(AccordionItem, { value: "voice", children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { children: "Voice config" }),
          /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsx(
            StopSecs,
            {
              vadStopSecs,
              handleChange: (v) => {
                setVadStopSecs(v);
                onConfigUpdate([
                  {
                    service: "vad",
                    options: [{ name: "params", value: { stop_secs: v } }]
                  }
                ]);
              }
            }
          ) })
        ] })
      ] })
    ] })
  ] });
};
const AudioIndicatorBar = () => {
  const volRef = useRef(null);
  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume) => {
      if (volRef.current)
        volRef.current.style.width = Math.max(2, volume * 100) + "%";
    }, [])
  );
  return /* @__PURE__ */ jsx("div", { className: styles.bar, children: /* @__PURE__ */ jsx("div", { ref: volRef }) });
};
const DeviceSelect = ({
  hideMeter = false
}) => {
  const { availableMics, selectedMic, updateMic } = useRTVIClientMediaDevices();
  useEffect(() => {
    updateMic(selectedMic?.deviceId);
  }, [updateMic, selectedMic]);
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-4", children: /* @__PURE__ */ jsxs(Field, { label: "Microphone", error: false, children: [
    /* @__PURE__ */ jsx(
      Select,
      {
        onChange: (e) => updateMic(e.currentTarget.value),
        value: selectedMic?.deviceId,
        icon: /* @__PURE__ */ jsx(Mic, { size: 24 }),
        children: availableMics.length === 0 ? /* @__PURE__ */ jsx("option", { value: "", children: "Loading devices..." }) : availableMics.map((mic) => /* @__PURE__ */ jsx("option", { value: mic.deviceId, children: mic.label }, mic.deviceId))
      }
    ),
    !hideMeter && /* @__PURE__ */ jsx(AudioIndicatorBar, {})
  ] }) });
};
const Configure = React__default.memo(
  ({ startAudioOff, state, inSession = false, handleStartAudioOff }) => {
    const { clientParams, setClientParams } = useContext(AppContext);
    const voiceClient = useRTVIClient();
    const handleServiceUpdate = useCallback(
      (newService) => {
        setClientParams({ services: newService });
      },
      [setClientParams]
    );
    const handleConfigOptionUpdate = useCallback(
      async (newConfigOptions) => {
        const newConfig = await voiceClient.setConfigOptions(
          newConfigOptions,
          clientParams.config
        );
        setClientParams({ config: newConfig });
      },
      [voiceClient, clientParams.config, setClientParams]
    );
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("section", { className: "flex flex-col flex-wrap gap-3 lg:gap-4", children: [
        /* @__PURE__ */ jsx(DeviceSelect, { hideMeter: false }),
        /* @__PURE__ */ jsx(
          ConfigSelect,
          {
            state,
            onConfigUpdate: handleConfigOptionUpdate,
            onServiceUpdate: handleServiceUpdate,
            inSession
          }
        )
      ] }),
      !inSession && /* @__PURE__ */ jsx("section", { className: "flex flex-col gap-4 border-y border-primary-hairline py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs(Label, { className: "flex flex-row gap-1 items-center", children: [
          "Join with mic muted",
          " ",
          /* @__PURE__ */ jsx(HelpTip, { text: "Start with microphone muted (click to unmute)" })
        ] }),
        /* @__PURE__ */ jsx(
          Switch,
          {
            checked: startAudioOff,
            onCheckedChange: handleStartAudioOff
          }
        )
      ] }) })
    ] });
  },
  (prevProps, nextProps) => prevProps.startAudioOff === nextProps.startAudioOff && prevProps.state === nextProps.state
);
Configure.displayName = "Configure";
const ModelBadge = () => {
  const { clientParams } = useContext(AppContext);
  const [model, setModel] = React__default.useState(
    clientParams.config.find((c) => c.service === "llm")?.options.find((p) => p.name === "model")?.value
  );
  useRTVIClientEvent(
    RTVIEvent.Config,
    async (config) => {
      const m = config.find((c) => c.service === "llm")?.options.find((p) => p.name === "model")?.value;
      setModel(m);
    }
  );
  return /* @__PURE__ */ jsx("div", { className: styles$1.modelBadge, children: model });
};
const Agent = memo(
  ({ isReady, statsAggregator }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [botStatus, setBotStatus] = useState("initializing");
    const [botIsTalking, setBotIsTalking] = useState(false);
    useEffect(() => {
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);
    useRTVIClientEvent(
      RTVIEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
      }, [])
    );
    useRTVIClientEvent(
      RTVIEvent.BotStartedSpeaking,
      useCallback(() => {
        setBotIsTalking(true);
      }, [])
    );
    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        setBotIsTalking(false);
      }, [])
    );
    useEffect(() => () => setHasStarted(false), []);
    const cx2 = clsx(
      styles$1.agentWindow,
      hasStarted && styles$1.ready,
      botIsTalking && styles$1.talking
    );
    return /* @__PURE__ */ jsx("div", { className: styles$1.agent, children: /* @__PURE__ */ jsxs("div", { className: cx2, children: [
      /* @__PURE__ */ jsx(ModelBadge, {}),
      !hasStarted ? /* @__PURE__ */ jsx("span", { className: styles$1.loader, children: /* @__PURE__ */ jsx(Loader2, { size: 32, className: "animate-spin" }) }) : /* @__PURE__ */ jsx(VoiceVisualizer, { participantType: "bot", barColor: "#FFFFFF" })
    ] }) });
  },
  (p, n) => p.isReady === n.isReady
);
Agent.displayName = "Agent";
const StatsTile = ({
  service,
  metric,
  tip,
  sub = "s",
  multiplier = 3,
  data
}) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$2.serviceStat, children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsxs("div", { className: styles$2.serviceName, children: [
        service.charAt(0).toUpperCase() + service.slice(1),
        " ",
        metric,
        tip && /* @__PURE__ */ jsx(HelpTip, { text: tip })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$2.latest, children: [
        /* @__PURE__ */ jsx("span", { children: "Latest" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          data.latest?.toFixed(multiplier),
          /* @__PURE__ */ jsx("sub", { children: sub })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$2.chart, children: /* @__PURE__ */ jsxs(
      Sparklines,
      {
        data: data.timeseries,
        limit: 20,
        height: 80,
        svgHeight: 80,
        children: [
          /* @__PURE__ */ jsx(SparklinesBars, { style: { fill: "#41c3f9", fillOpacity: ".25" } }),
          /* @__PURE__ */ jsx(SparklinesLine, { style: { stroke: "#41c3f9", fill: "none" } }),
          /* @__PURE__ */ jsx(SparklinesReferenceLine, { type: "mean" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("footer", { children: [
      /* @__PURE__ */ jsxs("div", { className: styles$2.statValue, children: [
        "H:",
        /* @__PURE__ */ jsxs("span", { children: [
          data.high?.toFixed(multiplier),
          /* @__PURE__ */ jsx("sub", { children: sub })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$2.statValue, children: [
        "M:",
        /* @__PURE__ */ jsxs("span", { children: [
          data.median?.toFixed(multiplier),
          /* @__PURE__ */ jsx("sub", { children: sub })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$2.statValue, children: [
        "L:",
        /* @__PURE__ */ jsxs("span", { children: [
          data.low?.toFixed(multiplier),
          /* @__PURE__ */ jsx("sub", { children: sub })
        ] })
      ] })
    ] })
  ] });
};
const Stats = React__default.memo(
  ({ statsAggregator, handleClose }) => {
    const [currentStats, setCurrentStats] = useState(
      statsAggregator.statsMap
    );
    const intervalRef = useRef(null);
    useEffect(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(async () => {
        const newStats = statsAggregator.getStats();
        if (newStats) {
          setCurrentStats({ ...newStats });
        }
      }, 2500);
      return () => clearInterval(intervalRef.current);
    }, [statsAggregator]);
    return /* @__PURE__ */ jsxs("div", { className: styles$2.container, children: [
      /* @__PURE__ */ jsx("div", { className: styles$2.close, children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: handleClose,
          className: "m-3",
          children: /* @__PURE__ */ jsx(X, {})
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: styles$2.inner, children: /* @__PURE__ */ jsx("section", { className: styles$2.sectionServices, children: Object.entries(currentStats).length < 1 ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mx-auto" }) }) : Object.entries(currentStats).map(([service, data], index) => {
        return /* @__PURE__ */ jsxs("div", { className: styles$2.serviceTiles, children: [
          /* @__PURE__ */ jsx(
            StatsTile,
            {
              metric: "TTFB",
              tip: "Time to first byte",
              service,
              multiplier: 3,
              data: data.ttfb
            },
            `${service}-ttfb-${index}`
          ),
          currentStats[service].characters && /* @__PURE__ */ jsx(
            StatsTile,
            {
              metric: "Characters",
              sub: "",
              service,
              multiplier: 0,
              data: data.characters
            },
            `${service}-chars-${index}`
          ),
          currentStats[service].processing && /* @__PURE__ */ jsx(
            StatsTile,
            {
              metric: "Processing",
              service,
              data: data.processing
            },
            `${service}-proc-${index}`
          )
        ] }, service);
      }) }) })
    ] });
  },
  () => true
);
Stats.displayName = "Stats";
const AudioIndicatorBubble = () => {
  const volRef = useRef(null);
  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume) => {
      if (volRef.current) {
        const v = Number(volume) * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );
  return /* @__PURE__ */ jsx("div", { ref: volRef, className: styles$3.volume });
};
function UserMicBubble({
  active,
  muted = false,
  handleMute
}) {
  const canTalk = !muted && active;
  const cx2 = clsx(
    muted && active && styles$3.muted,
    !active && styles$3.blocked,
    canTalk && styles$3.canTalk
  );
  return /* @__PURE__ */ jsx("div", { className: `${styles$3.bubbleContainer}`, children: /* @__PURE__ */ jsxs("div", { className: `${styles$3.bubble} ${cx2}`, onClick: () => handleMute(), children: [
    /* @__PURE__ */ jsx("div", { className: styles$3.icon, children: !active ? /* @__PURE__ */ jsx(Pause, { size: 42, className: "size-8 md:size-10" }) : canTalk ? /* @__PURE__ */ jsx(Mic, { size: 42, className: "size-8 md:size-10" }) : /* @__PURE__ */ jsx(MicOff, { size: 42, className: "size-8 md:size-10" }) }),
    canTalk && /* @__PURE__ */ jsx(AudioIndicatorBubble, {})
  ] }) });
}
let stats_aggregator;
const Session = React__default.memo(
  ({ state, onLeave, startAudioOff = false }) => {
    const voiceClient = useRTVIClient();
    const [hasStarted, setHasStarted] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [muted, setMuted] = useState(startAudioOff);
    const [runtimeConfigUpdate, setRuntimeConfigUpdate] = useState(null);
    const [updatingConfig, setUpdatingConfig] = useState(false);
    const modalRef = useRef(null);
    useRTVIClientEvent(
      RTVIEvent.Metrics,
      useCallback((metrics) => {
        metrics?.ttfb?.map((m) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );
    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        if (hasStarted) return;
        setHasStarted(true);
      }, [hasStarted])
    );
    useRTVIClientEvent(
      RTVIEvent.UserStoppedSpeaking,
      useCallback(() => {
        if (hasStarted) return;
        setHasStarted(true);
      }, [hasStarted])
    );
    useEffect(() => {
      setHasStarted(false);
    }, []);
    useEffect(() => {
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);
    useEffect(() => {
      stats_aggregator = new StatsAggregator();
    }, []);
    useEffect(() => {
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);
    useEffect(() => {
      const current = modalRef.current;
      if (current && showConfig) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showConfig]);
    function toggleMute() {
      voiceClient.enableMic(muted);
      setMuted(!muted);
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("dialog", { ref: modalRef, children: /* @__PURE__ */ jsxs(Card, { className: "w-svw max-w-full md:max-w-md lg:max-w-lg", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Configuration" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Configure, { state, inSession: true }) }),
        /* @__PURE__ */ jsxs(CardFooter, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setShowConfig(false), children: "Cancel" }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "default",
              disabled: updatingConfig,
              onClick: async () => {
                const config = voiceClient.params.requestData?.config;
                if (!config) return;
                setUpdatingConfig(true);
                await voiceClient.updateConfig(config);
                setUpdatingConfig(false);
                setShowConfig(false);
              },
              children: [
                updatingConfig && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                updatingConfig ? "Updating..." : "Save Changes"
              ]
            }
          )
        ] })
      ] }) }),
      showStats && createPortal(
        /* @__PURE__ */ jsx(
          Stats,
          {
            statsAggregator: stats_aggregator,
            handleClose: () => setShowStats(false)
          }
        ),
        document.getElementById("tray")
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center w-full", children: [
        /* @__PURE__ */ jsx(
          Card,
          {
            className: "w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-long",
            children: /* @__PURE__ */ jsx(
              Agent,
              {
                isReady: state === "ready",
                statsAggregator: stats_aggregator
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          UserMicBubble,
          {
            active: hasStarted,
            muted,
            handleMute: () => toggleMute()
          }
        )
      ] }),
      /* @__PURE__ */ jsx("footer", { className: "w-full flex flex-row mt-auto self-end md:w-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between gap-3 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipContent, { children: "Interrupt bot" }),
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                voiceClient.action({
                  service: "tts",
                  action: "interrupt",
                  arguments: []
                });
              },
              children: /* @__PURE__ */ jsx(StopCircle, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipContent, { children: "Show bot statistics panel" }),
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: showStats ? "default" : "ghost",
              size: "icon",
              onClick: () => setShowStats(!showStats),
              children: /* @__PURE__ */ jsx(LineChart, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipContent, { children: "Configure" }),
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setShowConfig(true),
              children: /* @__PURE__ */ jsx(Settings, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: () => onLeave(), className: "ml-auto", children: [
          /* @__PURE__ */ jsx(LogOut, { size: 16 }),
          "End"
        ] })
      ] }) })
    ] });
  },
  (p, n) => p.state === n.state
);
Session.displayName = "Session";
const alertVariants = cva("text-left border border-black rounded-lg p-4", {
  variants: {
    intent: {
      info: "alert-info",
      danger: "border-red-200 text-red-600 bg-red-50"
    }
  },
  defaultVariants: {
    intent: "info"
  }
});
const Alert = ({ children, intent, title }) => {
  return /* @__PURE__ */ jsxs("div", { className: alertVariants({ intent }), children: [
    /* @__PURE__ */ jsxs(AlertTitle, { children: [
      intent === "danger" && /* @__PURE__ */ jsx(CircleAlert, { size: 18 }),
      title
    ] }),
    children
  ] });
};
const AlertTitle = React__default.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn(
      "text-base font-bold flex items-center gap-2 mb-2",
      className
    ),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const status_text = {
  idle: "Initializing...",
  initialized: "Start",
  authenticating: "Requesting bot...",
  connecting: "Connecting...",
  disconnected: "Start"
};
function Assistant() {
  const voiceClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();
  const [appState, setAppState] = useState("idle");
  const [error, setError] = useState(null);
  const [startAudioOff, setStartAudioOff] = useState(false);
  const mountedRef = useRef(false);
  const { clientParams } = useContext(AppContext);
  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback((message) => {
      const errorData = message.data;
      if (!errorData.fatal) return;
      setError(errorData.error);
    }, [])
  );
  useEffect(() => {
    if (!voiceClient || mountedRef.current) return;
    mountedRef.current = true;
    voiceClient.initDevices();
  }, [appState, voiceClient]);
  useEffect(() => {
    voiceClient.params = {
      ...voiceClient.params,
      requestData: {
        ...voiceClient.params.requestData,
        ...clientParams
      }
    };
  }, [voiceClient, appState, clientParams]);
  useEffect(() => {
    console.log(transportState);
    switch (transportState) {
      case "initialized":
      case "disconnected":
        setAppState("ready");
        break;
      case "authenticating":
      case "connecting":
        setAppState("connecting");
        break;
      case "connected":
      case "ready":
        setAppState("connected");
        break;
      default:
        setAppState("idle");
    }
  }, [transportState]);
  async function start() {
    if (!voiceClient) return;
    try {
      voiceClient.enableMic(false);
      await voiceClient.connect();
    } catch (e) {
      setError(e.message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }
  async function leave() {
    await voiceClient.disconnect();
  }
  if (error) {
    return /* @__PURE__ */ jsx(Alert, { intent: "danger", title: "An error occurred", children: error });
  }
  if (appState === "connected") {
    return /* @__PURE__ */ jsx(
      Session,
      {
        state: transportState,
        onLeave: () => leave(),
        startAudioOff
      }
    );
  }
  const isReady = appState === "ready";
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Card, { className: "animate-appear max-w-lg", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Configuration" }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty", children: [
        /* @__PURE__ */ jsx(Ear, { className: "size-7 md:size-5 text-primary-400" }),
        "Works best in a quiet environment with a good internet."
      ] }),
      /* @__PURE__ */ jsx(
        Configure,
        {
          startAudioOff,
          handleStartAudioOff: () => setStartAudioOff(!startAudioOff),
          state: appState
        }
      )
    ] }),
    /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsxs(Button, { onClick: () => start(), disabled: !isReady, children: [
      !isReady && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
      status_text[transportState]
    ] }, "start") })
  ] }) });
}
const $$Talk = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Talk to Portcullis", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex items-center justify-center min-h-screen"> <div class="flex flex-col gap-4 w-full max-w-[58rem] items-center"> ${renderComponent($$result2, "Assistant", Assistant, {})} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro";
const $$url = "/talk";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Talk,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
