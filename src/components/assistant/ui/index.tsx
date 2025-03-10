import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { RTVIClient } from '@pipecat-ai/client-js';
import { 
  RTVIClientProvider, 
  RTVIClientAudio,
  useRTVIClientTransportState,
  useRTVIClient
} from '@pipecat-ai/client-react';
import { DailyTransport } from '@pipecat-ai/daily-transport';

// Import the Daily demo components we want to reuse
import { DeviceSelect } from './device-select';
import { PortcullisSessionView } from './session';

// Main component that provides the RTVI client context
export function PortcullisBot() {
  const [client, setClient] = useState<RTVIClient | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Only run in the browser
  useEffect(() => {
    setIsClient(true);
    
    async function initRTVIClient() {
      try {
        // Create transport
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            audioSource: true,
            videoSource: false,
            subscribeToTracksAutomatically: true,
          }
        });
        
        // Create RTVI client
        const rtviClient = new RTVIClient({
          transport: transport as any,
          enableMic: true,
          enableCam: false,
          timeout: 15000,
          params: {
            baseUrl: '/api/assistant',
            endpoints: {
              connect: 'connect',
            }
          }
        });
        
        console.log('RTVI client initialized successfully');
        setClient(rtviClient);
      } catch (error) {
        console.error('Failed to initialize RTVI client:', error);
      }
    }
    
    initRTVIClient();
    
    return () => {
      if (client) {
        try {
          client.disconnect().catch((err: unknown) => {
            console.warn('Error during disconnect in cleanup:', err);
          });
        } catch (err) {
          console.warn('Error during cleanup:', err);
        }
      }
    };
  }, []);

  // If we're not in a browser or the client hasn't loaded yet, show a loading state
  if (!isClient || !client) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Loading Portcullis Assistant...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <RTVIClientProvider client={client}>
      <BotController />
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}

// Controller component that manages the bot session
function BotController() {
  const [isSetup, setIsSetup] = useState(true);
  const transportState = useRTVIClientTransportState();
  const client = useRTVIClient();
  
  const handleStartSession = async () => {
    if (!client) return;
    
    try {
      console.log('Starting session...');
      
      // Get session token from our backend
      const response = await fetch('/api/assistant/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get session token');
      }

      const data = await response.json();
      console.log('Received session token:', data);

      // Connect to session
      try {
        // @ts-ignore - Ignore type checking for connection
        client.connect(data.token, data.url);
      } catch (error) {
        console.error('Connection failed:', error);
        throw error;
      }
      
      // Move to session view
      setIsSetup(false);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };
  
  const handleEndSession = async () => {
    if (!client) return;
    
    try {
      await client.disconnect();
      console.log('Session ended successfully');
      // Show a brief message before returning to setup
      alert('Session ended. Thank you for using Portcullis AI Assistant.');
      setIsSetup(true);
    } catch (error) {
      console.error('Failed to end session:', error);
      setIsSetup(true);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">
      {isSetup ? (
        <SetupView 
          transportState={transportState}
          onStart={handleStartSession}
        />
      ) : (
        <PortcullisSessionView onLeave={handleEndSession} />
      )}
    </div>
  );
}

// Setup view shown before starting a session
function SetupView({ 
  transportState, 
  onStart 
}: { 
  transportState: string | undefined,
  onStart: () => Promise<void>
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleStart = async () => {
    setIsConnecting(true);
    try {
      await onStart();
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portcullis AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Select your microphone and click Connect to start speaking with the Portcullis assistant.
          </p>
          
          <DeviceSelect hideMeter={false} />
          
          <div className="flex items-center gap-2 text-sm">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <span>
              Audio inactive - click Connect to start
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleStart}
          disabled={isConnecting || transportState === 'connecting'}
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
} 