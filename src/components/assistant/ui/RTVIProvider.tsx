import React, { ReactNode, useState, useEffect } from 'react';
import { broadcast } from '../../../pages/api/assistant/events';

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

        // Function handler for tool calls
        const handleFunctionCall = async (data: any) => {
          if (!data || !data.name) return null;
          
          console.log('Function call received:', data.name, data.arguments);
          
          try {
            switch (data.name) {
              case 'check_interest':
                const interestLevel = data.arguments?.interest_level || 0;
                const product = data.arguments?.product || '';
                const notes = data.arguments?.notes || '';
                
                // Broadcast the interest level event
                broadcast('interest_tagged', {
                  interest_level: interestLevel,
                  product,
                  notes
                });
                
                return {
                  success: true,
                  interest_level: interestLevel,
                  product,
                  notes
                };
                
              case 'collect_qualification_info':
                if (data.arguments?.trigger_form) {
                  // Broadcast event to trigger the form
                  broadcast('interest_tagged', {
                    interest_level: 8, // High interest to trigger form
                    product: "General Interest",
                    notes: "Customer explicitly requested information collection"
                  });
                }
                
                return {
                  success: true,
                  message: "Customer information form has been triggered"
                };
                
              case 'get_products':
                // This would typically fetch products from your API
                // For demo purposes, we'll return sample data
                return {
                  success: true,
                  products: [
                    {
                      id: "prod_01",
                      name: "Data Warehouse Optimization - Basic",
                      description: "Essential optimization services for your data warehouse",
                      price: "$5,000/month"
                    },
                    {
                      id: "prod_02",
                      name: "Data Warehouse Optimization - Premium",
                      description: "Advanced optimization with ongoing support",
                      price: "$10,000/month"
                    },
                    {
                      id: "prod_03",
                      name: "Data Security & Governance",
                      description: "Enterprise-grade security and governance",
                      price: "$7,500/month"
                    }
                  ]
                };
                
              case 'provide_quote':
                // This would typically create a quote in your system
                // For demo purposes, we'll simulate success
                broadcast('quote_created', {
                  quote_id: "quote_" + Math.random().toString(36).substring(2, 9),
                  customer_id: data.arguments?.customer_id || "unknown",
                  customer_name: "Customer",
                  customer_email: "customer@example.com"
                });
                
                return {
                  success: true,
                  quote_id: "quote_" + Math.random().toString(36).substring(2, 9),
                  message: "Quote has been created and sent to the customer"
                };
                
              default:
                return {
                  error: `Unknown function: ${data.name}`
                };
            }
          } catch (error) {
            console.error(`Error processing function call ${data.name}:`, error);
            return {
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        };

        // Create RTVI client with MINIMAL configuration
        const client = new RTVIClient({
          transport: transport as any,
          enableMic: true,
          enableCam: false,
          timeout: 15000,
          params: {
            baseUrl: '/api/assistant',
            endpoints: {
              connect: '/connect',
            },
            // Add service configuration
            services: {
              llm: 'anthropic',
              tts: 'cartesia'
            },
            // Add initial configuration
            config: [
              {
                service: 'llm',
                options: [
                  {
                    name: 'messages',
                    value: [{
                      role: 'system',
                      content: "You are a friendly assistant for Portcullis, helping users understand our data warehouse steering assistance services. Your job is to help the user understand the services we offer and to collect the information we need to provide a quote. You should call the 'check_interest' tool to guage the user's interest and then call the 'provide_quote' tool to provide a quote. You should also call the 'collect_qualification_info' tool to collect the information we need to provide a quote."
                    }]
                  }
                ]
              },
              {
                service: 'tts',
                options: [
                  { name: 'voice', value: 'default' }
                ]
              }
            ]
          },
          callbacks: {
            onBotConnected: () => {},
            onBotDisconnected: () => {
              setBotSpeaking(false);
            },
            onBotReady: (botReadyData: any) => {},
            onTransportStateChanged: (state: string) => {
              setTransportState(state);
            },
            onError: (error: any) => {},
            // Add LLM callbacks
            onBotLlmStarted: () => {},
            onBotLlmStopped: () => {},
            onBotLlmText: (text: any) => {
              if (text?.text) {
                setLastBotMessage(text.text);
                // Try to speak the response
                client.action({
                  service: 'tts',
                  action: 'say',
                  arguments: [{ name: 'text', value: text.text }]
                }).catch(() => {});
              }
            },
            // Add TTS callbacks
            onBotTtsStarted: () => {
              setBotSpeaking(true);
            },
            onBotTtsStopped: () => {
              setBotSpeaking(false);
            },
            onBotTtsText: (text: any) => {},
            // Add transcript callbacks
            onBotTranscript: (text: any) => {
              if (text?.text) {
                setLastBotMessage(text.text);
              }
            },
            // Note: We're removing the onUserTranscript handler here as we want
            // to handle this in the session component using triggerBotToSpeak
            onUserTranscript: (transcript: any) => {
              // Just capture transcripts, don't trigger LLM directly
              // The session component will handle this
            }
          }
        });
        
        // Core event listeners
        client.on(RTVIEvent.Error, (error: any) => {});
        client.on(RTVIEvent.BotReady, () => {});

        // Add audio track handling
        client.on(RTVIEvent.BotStartedSpeaking, () => {
          setBotSpeaking(true);
        });

        client.on(RTVIEvent.BotStoppedSpeaking, () => {
          setBotSpeaking(false);
        });

        // Add message handlers
        client.on(RTVIEvent.ServerMessage, (message: any) => {
          // Handle function calls from the bot
          if (message?.type === 'function_call') {
            handleFunctionCall(message).then(result => {
              if (result) {
                // Use the client's action method to send function results
                client.action({
                  service: 'llm',
                  action: 'function_result',
                  arguments: [
                    { name: 'name', value: message.name },
                    { name: 'result', value: JSON.stringify(result) }
                  ]
                }).catch(error => {
                  console.error('Error sending function result:', error);
                });
              }
            }).catch(error => {
              console.error('Error handling function call:', error);
            });
          }
        });

        client.on(RTVIEvent.ServerMessage, (message: any) => {
          if (message?.type === 'bot-message' && message?.data?.text) {
            setLastBotMessage(message.data.text);
            // Try to speak the response
            client.action({
              service: 'tts',
              action: 'say',
              arguments: [{ name: 'text', value: message.data.text }]
            }).catch(() => {});
          }
        });

        // Store the client and components
        setRtviClient(client);
        setRTVIClientProvider(() => RTVIClientProvider);
        setRTVIClientAudio(() => RTVIClientAudio);
        setIsLoaded(true);
      } catch (error) {}
    }
    
    loadDependencies();
    
    // Cleanup
    return () => {
      if (rtviClient) {
        try {
          rtviClient.disconnect().catch(() => {});
        } catch (err) {}
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
      {/* Essential RTVIClientAudio component to mount the bot's audio track */}
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
} 