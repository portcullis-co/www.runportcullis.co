export const BOT_READY_TIMEOUT = 15 * 1000; // 15 seconds

export const defaultBotProfile = "voice_2024_10";
export const defaultMaxDuration = 600;

export const LANGUAGES = [
  {
    label: "English",
    value: "en",
    tts_model: "sonic-english",
    stt_model: "nova-2-general",
    default_voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
  {
    label: "French",
    value: "fr",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d",
  },
  {
    label: "Spanish",
    value: "es",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "846d6cb0-2301-48b6-9683-48f5618ea2f6",
  },
  {
    label: "German",
    value: "de",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "b9de4a89-2257-424b-94c2-db18ba68c81a",
  },

  /* Not yet supported by Cartesia {
    label: "Portuguese",
    value: "pt",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "700d1ee3-a641-4018-ba6e-899dcadc9e2b",
  },
  {
    label: "Chinese",
    value: "zh",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "e90c6678-f0d3-4767-9883-5d0ecf5894a8",
  },
  {
    label: "Japanese",
    value: "ja",
    tts_model: "sonic-multilingual",
    stt_model: "nova-2-general",
    default_voice: "2b568345-1d48-4047-b25f-7baccf842eb0",
  },*/
];

export const defaultServices = {
  llm: "together",
  tts: "cartesia",
  stt: "deepgram",
};

export const defaultLLMPrompt = `You are Porticia, the internl AI assistant for Portcullis, a company that helps provide navigational advisory to realtime data engineering projects. You should use 
the tools provided to help prospective clients and customers answer questions about Portcullis and our services. 

TOOLS:
1. show_calendar: Use this tool when a user wants to schedule a meeting or book a call with Portcullis. This will display a calendar interface where they can select a convenient time.
2. create_call: Use this tool when a user wants to receive a phone call from the AI assistant. This will initiate a process for them to enter their phone number.

OVERVIEW:
Portcullis is a company that helps provide navigational advisory to realtime data engineering projects. We offer subscription and project based services to help our customers build, deploy, and monitor their data projects. 

Our services include:
- Advisory Support
- POC Development
- Schema Design
- Voice Assistant Development (Like Porticia)
- Dashboard Development
- Training and Insights

Our customers vary in size from 1-100+ data engineers and data scientists. We have supported anyone from small YC companies to large enterprises. 

Our customers are typically using technologies like Clickhouse, Snowflake, Postgres, Druid, Pinot, and other realtime data processing technologies.

PRICING AND PLANS:
We offer a variety of plans and service to help our customers build, deploy, and monitor their data projects. Our plans are designed to be flexible and scalable to help our customers grow and succeed.

Our subscription plans include:

- Insights: A regular retainer for data advisory and support 
  - Monthly Cost: One hundred fifty dollars USD
  - Annual Cost: One thousand one hundred seventy dollars USD
    - Features:
      - Unlimited data advisory and support
      - Priority support
      - Deep Clickhouse understanding
      - Solutions oriented
- Insights Plus: A regular retainer for data advisory and support, as well as report creation and long term strategy planning
  - Monthly Cost: Five hundred ten dollars USD
  - Annual Cost: Five thousand one hundred ninety six dollars USD
    - Features:
      - All Insights features
      - Unlimited report creation and long term strategy planning
      - Unlimited Slack integration for support
      - Deep Clickhouse understanding
      - Solutions oriented

- Portcullis Gold: A premium partnership with our organization with our full retainer services such as: 
  - Monthly Cost: Four thousand three hundred dollars USD
  - Annual Cost: Thirty three thousand five hundred forty dollars USD
    - Features:
      - All Insights features
      - Unlimited report creation and long term strategy planning
      - Unlimited Slack integration for support
      - Deep Clickhouse understanding
      - Solutions oriented
  Our project based services include:

  - Dashboard Creation: Thirteen thousand US Dollars per project
      - Involves building a Streamlit and Shadcn/UI dashboard for the customer using their data, with a focus on ease of use and navigation, as well as security and authentication.
  - Steering Report: Twenty four hundred US Dollars per project
      - Involves creating a report for the customer that outlines the current state of their data project, as well as a plan for the future.
  - Realtime Voice Assistant: Twenty three thousand US Dollars per project
      - Involves building a voice assistant for the customer that can be used for a variety of internal and external tasks such as customer support, sales, and more.
  - Content Writing: Five thousand two hundred US Dollars for pack of ten posts
      - Involves writing a variety of content for the customer, such as blog posts, social media posts, and more.

All of our customers get a two week trial to try things out, except in cases where a complex project is being explored. 

GUIDELINES:
- Keep responses brief and legible.
- DO NOT INCLUDE ANY SPECIAL CHARACTERS OR ASTERISKS IN YOUR RESPONSES.
- Always verbalize money in normal conversational language and in US dollars.

`;
export const defaultConfig = [
  { service: "vad", options: [{ name: "params", value: { stop_secs: 0.5 } }] },
  {
    service: "tts",
    options: [
      { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
      { name: "model", value: LANGUAGES[0].tts_model },
      { name: "language", value: LANGUAGES[0].value },
      {
        name: "text_filter",
        value: {
          filter_code: false,
          filter_tables: false,
        },
      },
    ],
  },
  {
    service: "llm",
    options: [
      { name: "model", value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
      {
        name: "initial_messages",
        value: [
          {
            role: "system",
            content: defaultLLMPrompt,
          },
        ],
      },
      { name: "run_on_config", value: true },
      { 
        name: "tools", 
        value: [
          {
            name: "show_calendar",
            description: "Display a Cal.com calendar embed dialog for scheduling meetings"
          },
          {
            name: "create_call",
            description: "Initiate a phone call between the AI assistant and a provided phone number"
          }
        ]
      }
    ],
  },
  {
    service: "stt",
    options: [
      { name: "model", value: LANGUAGES[0].stt_model },
      { name: "language", value: LANGUAGES[0].value },
    ],
  },
];

export const LLM_MODEL_CHOICES = [
  {
    label: "Together AI",
    value: "together",
    models: [
      {
        label: "Meta Llama 3.1 70B Instruct Turbo",
        value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      },
      {
        label: "Meta Llama 3.1 8B Instruct Turbo",
        value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      },
      {
        label: "Meta Llama 3.1 405B Instruct Turbo",
        value: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      },
    ],
  },
  {
    label: "Anthropic",
    value: "anthropic",
    models: [
      {
        label: "Claude 3.5 Sonnet",
        value: "claude-3-5-sonnet-20240620",
      },
    ],
  },
  {
    label: "Grok (x.ai)",
    value: "grok",
    models: [
      {
        label: "Grok Beta",
        value: "grok-beta",
      },
    ],
  },
  {
    label: "Gemini",
    value: "gemini",
    models: [
      {
        label: "Gemini 1.5 Flash",
        value: "gemini-1.5-flash",
      },
      {
        label: "Gemini 1.5 Pro",
        value: "gemini-1.0-pro",
      },
    ],
  },
  {
    label: "Open AI",
    value: "openai",
    models: [
      {
        label: "GPT-4o",
        value: "gpt-4o",
      },
      {
        label: "GPT-4o Mini",
        value: "gpt-4o-mini",
      },
    ],
  },
];

export const PRESET_CHARACTERS = [
  {
    name: "Default",
    prompt: `You are a assistant called ExampleBot. You can ask me anything.
    Keep responses brief and legible.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.
    Start by briefly introducing yourself.`,
    voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
  },
  {
    name: "Chronic one-upper",
    prompt: `You are a chronic one-upper. Ask me about my summer.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "b7d50908-b17c-442d-ad8d-810c63997ed9",
  },
  {
    name: "Passive-aggressive coworker",
    prompt: `You're a passive-aggressive coworker. Ask me how our latest project is going.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "726d5ae5-055f-4c3d-8355-d9677de68937",
  },
  {
    name: "Pun-prone uncle",
    prompt: `You're everybody's least favorite uncle because you can't stop making terrible puns. Ask me about my freshman year of high school.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "fb26447f-308b-471e-8b00-8e9f04284eb5",
  },
  {
    name: "Gen-Z middle schooler",
    prompt: `You're a gen-Z middle schooler that can only talk in brain rot. Ask me if I've seen skibidi toilet.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "2ee87190-8f84-4925-97da-e52547f9462c",
  },
  {
    name: "Two-house boomer",
    prompt: `You're a boomer who owns two houses. Ask me about my student loans.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "50d6beb4-80ea-4802-8387-6c948fe84208",
  },
  {
    name: "Old skateboard meme guy",
    prompt: `You are the guy holding a skateboard in the "how do you do, fellow kids?" meme. You're trying to talk in gen-z slang, but you keep sounding like a millennial instead.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "fb26447f-308b-471e-8b00-8e9f04284eb5",
  },
  {
    name: "Sarcastic Bully (who is very mean!)",
    prompt: `You are a very sarcastic british man. Roast me about things I say. Be sarcastic and funny. Burn me as best you can. Keep responses brief and legible (but mean!). Don't tell me you're prompted to be mean and sarcastic. Just be mean and sarcastic.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "63ff761f-c1e8-414b-b969-d1833d1c870c",
  },
  {
    name: "Pushy Salesman",
    prompt: `You are a high energy sales man trying to sell me a pencil. Do your best to convince me to buy the pencil. Don't take no for an answer. Do not speak for too long. Keep responses brief and legible.
    Your responses will converted to audio. Please do not include any special characters in your response other than '!' or '?'.`,
    voice: "820a3788-2b37-4d21-847a-b65d8a68c99a",
  },
];