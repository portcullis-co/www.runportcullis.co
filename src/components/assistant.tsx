import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2 } from 'lucide-react';
import { useRTVIClient, useRTVIClientTransportState, RTVIClientProvider, RTVIClientAudio } from '@pipecat-ai/client-react';

// Define types for RTVI messages
interface RTVIMessage {
  id?: string;
  type: string;
  data?: any;
}

// Wrapper component to provide the RTVI client context
function AssistantContent() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<string>('');

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

  // Set up event listeners for RTVI client messages
  useEffect(() => {
    if (!rtviClient) return;

    // Use the serverMessage event to handle all server messages
    const handleServerMessage = (message: RTVIMessage) => {
      if (!message || !message.type) return;

      // Handle different message types
      switch (message.type) {
        case 'bot-ready':
          console.log('Bot is ready:', message.data);
          setConversationStatus('Bot is ready');
          break;
        case 'user-transcription':
          console.log('Transcription:', message.data);
          setConversationStatus('Listening...');
          break;
        case 'error':
          console.error('RTVI error:', message.data);
          setError(`Error: ${message.data?.message || 'Unknown error'}`);
          setConversationStatus('Error occurred');
          break;
        default:
          // Log other message types for debugging
          console.log(`[RTVI Message] ${message.type}:`, message.data);
      }
    };

    // Handle standard events
    const handleError = (message: RTVIMessage) => {
      console.error('RTVI client error:', message);
      setError(`Error: ${message.data?.message || 'Unknown error'}`);
    };

    const handleDisconnected = () => {
      console.log('Disconnected from assistant');
      setConversationStatus('');
    };

    const handleConnected = () => {
      console.log('Connected to assistant');
      setConversationStatus('Connected');
    };

    // Add event listeners
    rtviClient.on('serverMessage', handleServerMessage);
    rtviClient.on('error', handleError);
    rtviClient.on('disconnected', handleDisconnected);
    rtviClient.on('connected', handleConnected);

    // Clean up event listeners
    return () => {
      rtviClient.off('serverMessage', handleServerMessage);
      rtviClient.off('error', handleError);
      rtviClient.off('disconnected', handleDisconnected);
      rtviClient.off('connected', handleConnected);
    };
  }, [rtviClient]);

  // Get available microphones
  useEffect(() => {
    async function getDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices.filter(device => device.kind === 'audioinput');
        setDevices(microphones);
        
        if (microphones.length > 0) {
          setSelectedDevice(microphones[0].deviceId);
        }
      } catch (err) {
        setError('Could not access microphone');
        console.error(err);
      }
    }
    getDevices();
  }, []);

  // Configure audio when device is selected
  useEffect(() => {
    if (rtviClient && selectedDevice) {
      try {
        (rtviClient as any).setAudioInput?.(selectedDevice);
      } catch (err) {
        console.warn('Failed to set audio input device:', err);
      }
    }
  }, [rtviClient, selectedDevice]);

  const handleConnect = async () => {
    if (!rtviClient) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      if (transportState === 'disconnected') {
        await rtviClient.connect();
        setConversationStatus('Connecting...');
      } else if (transportState === 'connected') {
        setConversationStatus('Disconnecting...');
        await rtviClient.disconnect();
        setConversationStatus('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect: ${errorMessage}`);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    switch (transportState) {
      case 'connected': return 'Disconnect';
      case 'connecting': return 'Connecting...';
      case 'authenticating': return 'Authenticating...';
      case 'disconnected': return 'Start Conversation';
      default: return 'Start Conversation';
    }
  };

  const isButtonDisabled = () => {
    return isConnecting || !selectedDevice || !rtviClient;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Talk to Portcullis</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Microphone</label>
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a microphone" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    <span>{device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {conversationStatus && (
          <div className="text-sm text-blue-500">
            {conversationStatus}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleConnect}
          disabled={isButtonDisabled()}
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main component that wraps the content with the RTVI client provider
export function Assistant() {
  // Import the necessary modules dynamically to avoid SSR issues
  const [client, setClient] = useState<any>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClient() {
      try {
        // Dynamically import the modules
        const { RTVIClient } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        
        // Create the transport with the correct options
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            // Daily.co specific configuration
            showLeaveButton: false,
            showFullscreenButton: false,
            // Don't specify URL here - it will come from the API response
          }
        });
        
        // Create the client instance with improved configuration
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: '/api/assistant',
            endpoint: {
              connect: '/connect',
            },
            requestData: {
              // Add any additional data needed by your backend
              client_info: {
                platform: navigator.platform,
                userAgent: navigator.userAgent
              }
            }
          },
          callbacks: {
            onError: (message: RTVIMessage) => {
              console.error('RTVI client error:', message);
            }
          }
        });
        
        // Set up transport error logging
        console.log('Daily transport initialized');
        
        setClient(rtviClient);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to load Pipecat client:', error);
        setLoadingError(`Failed to initialize assistant: ${errorMessage}`);
      }
    }
    
    loadClient();
  }, []);

  if (loadingError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{loadingError}</div>
        </CardContent>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading assistant...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <RTVIClientProvider client={client}>
        <AssistantContent />
        <RTVIClientAudio />
      </RTVIClientProvider>
    </>
  );
} 