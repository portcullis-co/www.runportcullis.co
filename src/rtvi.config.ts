// src/rtvi.config.ts
export const defaultBotProfile = "natural_conversation_2024_11";
export const defaultMaxDuration = 600; // 10 minutes

// Default services configuration
export const defaultServices = {
  llm: "openai",
  tts: "elevenlabs",
  stt: "deepgram"
};

// Default configuration for services
export const defaultConfig = [
  {
    service: "stt",
    options: [
      { name: "language", value: "en-US" }
    ]
  },
  {
    service: "tts",
    options: [
      { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
      { name: "model", value: "eleven_turbo_v2" },
      { name: "output_format", value: "pcm_24000" },
      { name: "stability", value: 0.5 },
      { name: "similarity_boost", value: 0.5 },
      { name: "latency", value: 1 }
    ]
  },
  {
    service: "llm",
    options: [
      { name: "model", value: "gpt-4o-mini" },
      {
        name: "initial_messages",
        value: [
          {
            role: "system",
            content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote. You should call the 'check_interest' tool to guage the user's interest and then call the 'provide_quote' tool to provide a quote. You should also call the 'collect_qualification_info' tool to collect the information we need to provide a quote."
          }
        ]
      },
      { name: "temperature", value: 0.7 },
    ]
  }
];

// Default webhook tools configuration
export const defaultWebhookTools = {
  provide_quote: {
    url: "/api/assistant/webhooks",
    method: "POST",
    streaming: false
  },
  collect_qualification_info: {
    url: "/api/assistant/webhooks",
    method: "POST",
    streaming: false
  },
  check_interest: {
    url: "/api/assistant/webhooks",
    method: "POST",
    streaming: false
  }
}; 