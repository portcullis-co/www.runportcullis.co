import React, { ReactNode, useState, useEffect } from 'react';

// Create a placeholder provider for SSR
export function RTVIProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [transportState, setTransportState] = useState<string>('initializing');
  const [rtviClient, setRtviClient] = useState<any>(null);
  const [RTVIClientProvider, setRTVIClientProvider] = useState<any>(null);
  const [RTVIClientAudio, setRTVIClientAudio] = useState<any>(null);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState('');

  // Only run in the browser
  useEffect(() => {
    setIsClient(true);
    
    async function loadDependencies() {
      try {
        // Dynamically import the modules
        const { RTVIClient, RTVIEvent } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        const { RTVIClientProvider, RTVIClientAudio } = await import('@pipecat-ai/client-react');
        
        // Create transport with proper configuration
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            audioSource: true,
            videoSource: false,
            subscribeToTracksAutomatically: true,
          }
        });

        // Create RTVI client with proper configuration
        const client = new RTVIClient({
          transport: transport as any,
          enableMic: true,
          enableCam: false,
          timeout: 15000,
          params: {
            // Using standard URL format for Daily Bots
            baseUrl: '/api/assistant',
            endpoints: {
              connect: '/connect',
            },
            // Use the requestData property to explicitly pass services and config
            // This follows the Daily Bots docs more closely
            requestData: {
              services: {
                llm: "anthropic",
                tts: "elevenlabs",
                stt: "deepgram"
              },
              config: [
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
                    { name: "model", value: "claude-3-5-sonnet-latest" },
                    {
                      name: "initial_messages",
                      value: [
                        {
                          role: "system",
                          content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote. Respond concisely. Introduce yourself first."
                        }
                      ]
                    },
                    { name: "temperature", value: 0.7 },
                    { name: "run_on_config", value: true }
                  ]
                }
              ]
            }
          },
          callbacks: {
            onBotConnected: () => {
              console.log('[CALLBACK] Bot connected');
            },
            onBotDisconnected: () => {
              console.log('[CALLBACK] Bot disconnected');
            },
            onBotReady: () => {
              console.log('[CALLBACK] Bot ready to chat!');
            },
            onTransportStateChanged: (state: string) => {
              console.log('[CALLBACK] Transport state changed:', state);
              setTransportState(state);
            },
            onError: (error: any) => {
              console.error('[CALLBACK] RTVI error:', error);
            }
          }
        });
        
        // Set up event listeners with error handling
        client.on(RTVIEvent.TransportStateChanged, (state: string) => {
          console.log('[EVENT] Transport state changed:', state);
          setTransportState(state);
          
          if (state === 'connected') {
            console.log('Successfully connected to Daily.co bot!');
          } else if (state === 'connecting') {
            console.log('Connecting to Daily.co bot...');
          } else if (state === 'disconnected') {
            console.log('Disconnected from Daily.co bot');
          }
        });
        
        client.on(RTVIEvent.Error, (error: any) => {
          console.error('[EVENT] RTVI client error:', error);
        });
        
        // Core bot state events
        client.on(RTVIEvent.BotReady, () => {
          console.log('[EVENT] Bot is ready to chat');
        });
        
        client.on(RTVIEvent.BotConnected, () => {
          console.log('[EVENT] Bot has connected');
        });
        
        client.on(RTVIEvent.BotDisconnected, () => {
          console.log('[EVENT] Bot has disconnected');
        });
        
        // Standard RTVIEvents for speech
        client.on(RTVIEvent.BotStartedSpeaking, () => {
          console.log('[EVENT] Bot started speaking');
          setBotSpeaking(true);
        });
        
        client.on(RTVIEvent.BotStoppedSpeaking, () => {
          console.log('[EVENT] Bot stopped speaking');
          setBotSpeaking(false);
        });
        
        client.on(RTVIEvent.BotTranscript, (data: any) => {
          console.log('[EVENT] Bot transcript:', data);
          if (data && data.text) {
            setLastBotMessage(data.text);
          }
        });
        
        // Handle user speech events for debugging
        client.on(RTVIEvent.UserStartedSpeaking, () => {
          console.log('[EVENT] User started speaking');
        });
        
        client.on(RTVIEvent.UserStoppedSpeaking, () => {
          console.log('[EVENT] User stopped speaking');
        });
        
        client.on(RTVIEvent.UserTranscript, (data: any) => {
          console.log('[EVENT] User transcript:', data);
        });
        
        // Log all RTVI messages for debugging
        client.on(RTVIEvent.ServerMessage, (message: any) => {
          console.log('[RTVI Message]', message);
          
          // Special handling for bot-ready message to ensure proper state transitions
          if (message.type === 'bot-ready') {
            console.log('[IMPORTANT] Bot ready message received!');
          }
          
          // Handle raw bot message formats if needed
          if (message.type === 'tts-start') {
            setBotSpeaking(true);
          }
          
          if (message.type === 'tts-end') {
            setBotSpeaking(false);
          }
          
          // Handle LLM responses
          if (message.type === 'llm-response' && message.data && message.data.text) {
            setLastBotMessage(prev => prev + message.data.text);
          }
        });
        
        // Store the client and components
        setRtviClient(client);
        setRTVIClientProvider(() => RTVIClientProvider);
        setRTVIClientAudio(() => RTVIClientAudio);
        setIsLoaded(true);
        
        console.log('RTVI client and components loaded successfully');
       
        // Log the final URL for debugging
        console.log('Connect URL will be:', client.params.baseUrl ? client.params.baseUrl + (client.params.endpoints?.connect || '') : 'Base URL not defined');
      } catch (error) {
        console.error('Failed to load RTVI dependencies:', error);
      }
    }
    
    loadDependencies();
    
    // Cleanup
    return () => {
      if (rtviClient) {
        try {
          rtviClient.disconnect().catch((err: unknown) => {
            console.warn('Error during disconnect in cleanup:', err);
          });
        } catch (err) {
          console.warn('Error during cleanup:', err);
        }
      }
    };
  }, []);
  
  // During SSR or while loading, just render children
  if (!isClient || !isLoaded || !rtviClient || !RTVIClientProvider || !RTVIClientAudio) {
    return <>{children}</>;
  }
  
  // Once everything is loaded, render with the provider
  return (
    <RTVIClientProvider client={rtviClient}>
      {children}
      <RTVIClientAudio />
      
      {/* Simple debug panel */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          maxWidth: '300px',
          zIndex: 1000,
        }}
      >
        RTVI Audio Status: Active<br />
        TTS: ElevenLabs (PCM)<br />
        Transport: {transportState}<br />
        Bot Speaking: {botSpeaking ? 'Yes' : 'No'}<br />
        Last Message: {lastBotMessage ? lastBotMessage.substring(0, 30) + '...' : 'None yet'}<br />
        Version: {rtviClient?.version || '0.3.3'}
      </div>
    </RTVIClientProvider>
  );
} 