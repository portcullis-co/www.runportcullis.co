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
              console.log('[RTVI] Bot connected');
            },
            onBotDisconnected: () => {
              console.log('[RTVI] Bot disconnected');
            },
            onBotReady: (botReadyData: any) => {
              console.log('[RTVI] Bot ready:', botReadyData);
            },
            onTransportStateChanged: (state: string) => {
              console.log('[RTVI] Transport state:', state);
              setTransportState(state);
              
              if (state === 'ready' && !client.connected) {
                console.log('[RTVI] Transport ready, connecting...');
                client.connect().catch(error => {
                  console.error('[RTVI] Connection failed:', error);
                });
              }
            },
            onError: (error: any) => {
              console.error('[RTVI] Error:', error);
            }
          }
        });
        
        // Core event listeners only
        client.on(RTVIEvent.Error, (error: any) => {
          console.error('[RTVI] Client error:', error);
        });
        
        client.on(RTVIEvent.BotReady, () => {
          console.log('[RTVI] Bot ready event received');
        });
        
        // Store the client and components
        setRtviClient(client);
        setRTVIClientProvider(() => RTVIClientProvider);
        setRTVIClientAudio(() => RTVIClientAudio);
        setIsLoaded(true);
        
        console.log('[RTVI] Client initialized');
       
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