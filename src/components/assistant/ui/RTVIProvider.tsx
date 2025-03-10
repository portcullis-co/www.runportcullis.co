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

        // Create RTVI client with MINIMAL configuration
        // Let the server handle all the LLM, TTS, STT configuration
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
          },
          callbacks: {
            onBotConnected: () => {
              console.log('[CALLBACK] Bot connected');
              // Initialize the bot when connected
              client.sendMessage({
                type: 'bot-message',
                data: {
                  text: "Hello! I'm initializing...",
                  type: 'text'
                },
                id: '',
                label: ''
              });
            },
            onBotDisconnected: () => {
              console.log('[CALLBACK] Bot disconnected');
            },
            onBotReady: () => {
              console.log('[CALLBACK] Bot ready to chat!');
              // Send a test message when ready
              client.sendMessage({
                type: 'bot-message',
                data: {
                  text: "I'm ready to help!",
                  type: 'text'
                },
                id: '',
                label: ''
              });
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
          // Send initial message
          client.sendMessage({
            type: 'bot-message',
            data: {
              text: "Hello! I'm ready to help.",
              type: 'text'
            },
            id: '',
            label: ''
          });
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
        
        // Add event listener for bot LLM events with correct casing
        client.on(RTVIEvent.BotLlmStarted, () => {
          console.log('[EVENT] Bot LLM started processing');
        });
        
        client.on(RTVIEvent.BotLlmStopped, () => {
          console.log('[EVENT] Bot LLM stopped processing');
        });
        
        client.on(RTVIEvent.BotLlmText, (data: any) => {
          console.log('[RTVI Core] BotLlmText event received:', data);
        });
        
        // Enhanced TTS event handling
        client.on(RTVIEvent.BotTtsStarted, () => {
          console.log('[EVENT] Bot TTS started - Audio should begin playing');
          setBotSpeaking(true);
        });
        
        client.on(RTVIEvent.BotTtsStopped, () => {
          console.log('[EVENT] Bot TTS stopped - Audio should stop playing');
          setBotSpeaking(false);
        });
        
        // Add TTS text event handler (important for debugging TTS)
        client.on(RTVIEvent.BotTtsText, (data: any) => {
          console.log('[EVENT] Bot TTS text received:', data);
          // This event indicates text is being sent to TTS service
        });
        
        // Also handle raw tts events via ServerMessage for legacy compatibility
        client.on(RTVIEvent.ServerMessage, (message: any) => {
          console.log('[RTVI Core] Server message received:', message);
          
          // Handle legacy TTS events 
          if (message.type === 'tts-start' || message.type === 'bot-tts-start') {
            console.log('[RTVI Core] Legacy TTS start detected');
            setBotSpeaking(true);
          }
          
          if (message.type === 'tts-end' || message.type === 'bot-tts-end') {
            console.log('[RTVI Core] Legacy TTS end detected');
            setBotSpeaking(false);
          }
          
          if (message.type === 'tts-text' || message.type === 'bot-tts-text') {
            console.log('[RTVI Core] Legacy TTS text detected:', message.data?.text);
          }
          
          // Special handling for bot-ready message to ensure proper state transitions
          if (message.type === 'bot-ready') {
            console.log('[IMPORTANT] Bot ready message received!');
          }
          
          // Handle LLM responses - multiple formats
          if (message.type === 'llm-response' && message.data && message.data.text) {
            console.log('[RTVIProvider] LLM response received:', message.data.text);
            setLastBotMessage(prev => prev + message.data.text);
          }
          
          // Handle bot-message format
          if (message.type === 'bot-message' && message.data && message.data.text) {
            console.log('[RTVIProvider] Bot message received:', message.data.text);
            setLastBotMessage(message.data.text);
          }
          
          // Handle bot-transcript format
          if (message.type === 'bot-transcript' && message.data && message.data.text) {
            console.log('[RTVIProvider] Bot transcript received:', message.data.text);
            setLastBotMessage(message.data.text);
          }
          
          // Handle bot-llm-chunk format (newer)
          if (message.type === 'bot-llm-chunk' && message.data && message.data.text) {
            console.log('[RTVIProvider] Bot LLM chunk received:', message.data.text);
            setLastBotMessage(prev => prev + message.data.text);
          }
          
          // Specifically log any message that might contain bot responses
          if (message.type && (
            message.type.includes('bot') || 
            message.type.includes('llm') || 
            message.type.includes('ai') ||
            message.type.includes('response') ||
            message.type.includes('tts')
          )) {
            console.log('[RTVI Core] Potential bot-related message detected:', message);
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
        
        // Enhanced message handling
        client.on(RTVIEvent.ServerMessage, (message: any) => {
          console.log('[DEBUG] Raw message received:', message);
          
          // Handle different message types
          if (message.type === 'bot-message' && message.data?.text) {
            console.log('[DEBUG] Bot message:', message.data.text);
            setLastBotMessage(message.data.text);
          }
          
          if (message.type === 'bot-thinking') {
            console.log('[DEBUG] Bot is thinking');
          }
          
          if (message.type === 'bot-error') {
            console.error('[DEBUG] Bot error:', message);
          }
        });
        
        // Audio track handling
        client.on(RTVIEvent.TrackStarted, (track: any) => {
          console.log('[DEBUG] Audio track started:', track);
          setBotSpeaking(true);
        });

        client.on(RTVIEvent.TrackStopped, (track: any) => {
          console.log('[DEBUG] Audio track stopped:', track);
          setBotSpeaking(false);
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
      {/* Enhanced audio component with explicit options */}
      <RTVIClientAudio 
        autoPlay={true}
        muted={false}
        volume={1.0}
        debug={true} // Enable debug logging for audio events
      />
      
      {/* Audio debug log */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '5px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '5px',
          zIndex: 100,
          fontSize: '10px',
          display: botSpeaking ? 'block' : 'none'
        }}
      >
        🔊 Bot speaking...
      </div>
      
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