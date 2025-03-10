import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { useRTVIClient, useRTVIClientTransportState, RTVIClientProvider, RTVIClientAudio } from '@pipecat-ai/client-react';

// Main content component
function AssistantContent() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [botResponse, setBotResponse] = useState<string>('');
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

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

  // Configure audio input when device is selected
  useEffect(() => {
    if (rtviClient && selectedDevice) {
      try {
        (rtviClient as any).setAudioInput?.(selectedDevice);
        console.log('Audio input device set to:', selectedDevice);
      } catch (err) {
        console.warn('Failed to set audio input device:', err);
      }
    }
  }, [rtviClient, selectedDevice]);

  // Listen for RTVI events
  useEffect(() => {
    if (!rtviClient) return;
    
    const handleServerMessage = (event: any) => {
      // Reset connecting state when any events are received
      if (isConnecting) {
        setIsConnecting(false);
      }
      
      // User transcription events
      if (event.type === 'user-transcription' && event.data?.text) {
        setTranscription(event.data.text);
      }
      
      // Bot text events
      if (event.type === 'bot-llm-text' && event.data?.text) {
        setBotResponse(prev => prev + event.data.text);
      }
      
      // Bot TTS events
      if (event.type === 'bot-tts-started') {
        setIsTTSPlaying(true);
        console.log('TTS started - audio should be playing');
      }
      
      if (event.type === 'bot-tts-stopped') {
        setIsTTSPlaying(false);
        console.log('TTS stopped');
      }
      
      // User speaking events
      if (event.type === 'user-started-speaking') {
        setIsListening(true);
      }
      
      if (event.type === 'user-stopped-speaking') {
        setIsListening(false);
      }
      
      // Bot LLM events
      if (event.type === 'bot-llm-stopped') {
        setTimeout(() => setBotResponse(''), 10000);
      }
    };
    
    // Register event handlers
    rtviClient.on('serverMessage', handleServerMessage);
    rtviClient.on('connected', () => {
      console.log('RTVI Client connected');
      setIsConnecting(false);
    });
    
    return () => {
      // Clean up event handlers
      rtviClient.off('serverMessage', handleServerMessage);
      rtviClient.off('connected', () => {});
    };
  }, [rtviClient, isConnecting]);

  const handleConnect = async () => {
    if (!rtviClient) {
      console.error('RTVI client is not initialized');
      setError('RTVI client not initialized');
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      if (transportState === 'disconnected') {
        console.log('Attempting to connect to assistant service...');
        await rtviClient.connect();
        console.log('Connection request completed');
      } else if (transportState === 'connected') {
        console.log('Disconnecting from assistant service...');
        await rtviClient.disconnect();
        console.log('Successfully disconnected');
        setBotResponse('');
      }
    } catch (err) {
      console.error('Connection error details:', err);
      setError(err instanceof Error ? 
        `Failed to connect: ${err.message}` : 
        'Failed to connect: Unknown error');
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

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {transportState === 'connected' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              {isListening ? 
                <Mic className="h-4 w-4 text-green-500 animate-pulse" /> : 
                <Mic className="h-4 w-4" />}
              <span className="text-sm">{isListening ? 'Listening...' : 'Not listening'}</span>
            </div>
            {transcription && (
              <div className="p-3 bg-gray-100 rounded-md text-sm">
                <p><strong>You:</strong> {transcription}</p>
              </div>
            )}
            
            {botResponse && (
              <div className="p-3 bg-blue-50 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <Volume2 className={`h-4 w-4 ${isTTSPlaying ? 'text-blue-500 animate-pulse' : 'text-gray-500'}`} />
                  <span className="text-xs">{isTTSPlaying ? 'Bot speaking...' : 'Last response:'}</span>
                </div>
                <p><strong>Bot:</strong> {botResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* Simple audio status indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className={`h-4 w-4 ${transportState === 'connected' ? 'text-green-500' : 'text-gray-400'}`} />
          <span>
            {transportState === 'connected' 
              ? 'Connected - speak to interact with the assistant' 
              : 'Audio inactive - click Connect to start'}
          </span>
        </div>
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

// Root component that provides the RTVIClientProvider
export function Assistant() {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    async function loadClient() {
      try {
        const PIPECAT_API_URL = import.meta.env.PIPECAT_API_URL;

        // Dynamically import the modules
        const { RTVIClient } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        
        // Create transport with default configuration
        const transport = new DailyTransport();
        
        console.log('Using API base URL:', PIPECAT_API_URL || '/api/assistant');
        console.log('Transport created with default configuration');
        
        // Create the client with server-matching configuration
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: PIPECAT_API_URL || '/api/assistant',
            endpoints: {
              connect: '/connect',
            },
            config: [
              {
                service: "tts",
                options: [
                  { name: "voice", value: "6IlUNt4hAIP1jMBYQncS" },
                  { name: "model", value: "eleven_turbo_v2" },
                  { name: "output_format", value: "pcm_24000" },
                  { name: "optimize_streaming_latency", value: 4 },
                  { name: "stability", value: 0.75 },
                  { name: "similarity_boost", value: 0.75 },
                  { name: "latency", value: 1 }
                ],
              }
            ],
          }
        });
        
        console.log('RTVI client created with standard configuration');
        setClient(rtviClient);
      } catch (error) {
        console.error('Failed to load Pipecat client:', error);
      }
    }
    
    loadClient();
    
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

  if (!client) {
    return <div>Loading assistant...</div>;
  }

  return (
    <RTVIClientProvider client={client}>
      <AssistantContent />
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}