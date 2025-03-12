import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { 
  useRTVIClientTransportState,
  useRTVIClient,
  useRTVIClientEvent,
  RTVIClientAudio
} from '@pipecat-ai/client-react';

// Import the Daily demo components we want to reuse
import { DeviceSelect } from './device-select';
import { PortcullisSessionView } from './session';
import { RTVIProvider } from './RTVIProvider';
import { RTVIEvent } from '@pipecat-ai/client-js';

// Main component that provides the RTVI client context
export function PortcullisBot() {
  return (
    <RTVIProvider>
      <BotController />
    </RTVIProvider>
  );
}

// Controller component that manages the bot session
function BotController() {
  const [isSetup, setIsSetup] = useState(true);
  const transportState = useRTVIClientTransportState();
  const client = useRTVIClient();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use RTVI event hooks to track bot ready state
  useRTVIClientEvent(RTVIEvent.BotReady, () => {
    setIsSetup(false);
  });
  
  // Also watch for transport state changes
  useEffect(() => {
    if (transportState === 'ready') {
      // Give a small delay to ensure everything is loaded
      setTimeout(() => {
        setIsConnecting(false);
        setIsSetup(false);
      }, 1000);
    }
  }, [transportState]);
  
  const handleStartSession = async () => {
    if (!client) {
      alert('RTVI client not initialized. Please try refreshing the page.');
      return;
    }
    
    try {
      setIsConnecting(true);
      await client.connect();
      
      // Once connected, the session component will handle the greeting
      // through its BotReady and TransportStateChanged event handlers
    } catch (error) {
      setIsConnecting(false);
    }
  };
  
  const handleEndSession = async () => {
    if (!client) return;
    
    try {
      await client.disconnect();
      alert('Session ended. Thank you for using Portcullis AI Assistant.');
      setIsSetup(true);
    } catch (error) {
      setIsSetup(true);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">
      {isSetup ? (
        <SetupView 
          transportState={transportState}
          onStart={handleStartSession}
          isConnecting={isConnecting}
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
  onStart,
  isConnecting
}: { 
  transportState: string | undefined,
  onStart: () => Promise<void>,
  isConnecting: boolean
}) {
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
          onClick={onStart}
          disabled={isConnecting || transportState === 'connecting'}
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
} 