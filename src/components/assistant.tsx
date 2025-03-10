import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { 
  useRTVIClient, 
  useRTVIClientTransportState
} from '@pipecat-ai/client-react';
import { RTVIProvider } from '@/components/RTVIProvider';

// Use type safety for RTVI events
type RTVIEventType = 
  | 'user-transcription' 
  | 'bot-llm-text' 
  | 'bot-tts-started' 
  | 'bot-tts-stopped'
  | 'user-started-speaking'
  | 'user-stopped-speaking'
  | 'bot-llm-stopped';

// Define types
interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

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
      console.log('Server message received:', event);
      
      // Reset connecting state when any events are received
      if (isConnecting) {
        setIsConnecting(false);
      }
      
      // User transcription events
      if (event.name === 'transcription') {
        setTranscription(event.data.text || '');
      }
      
      // Bot text events
      if (event.name === 'llm-response') {
        if (event.data.index === 0) {
          setBotResponse(event.data.text || '');
        } else {
          setBotResponse(prev => prev + (event.data.text || ''));
        }
      }
      
      // Bot TTS events
      if (event.name === 'tts-start') {
        setIsTTSPlaying(true);
        console.log('TTS started - audio should be playing');
      }
      
      if (event.name === 'tts-end') {
        setIsTTSPlaying(false);
        console.log('TTS stopped');
      }
      
      // User speaking events
      if (event.name === 'user-started-speaking') {
        setIsListening(true);
      }
      
      if (event.name === 'user-stopped-speaking') {
        setIsListening(false);
      }
      
      // Bot LLM events
      if (event.name === 'bot-llm-stopped') {
        setTimeout(() => setBotResponse(''), 10000);
      }
    };
    
    // Listen for connection state changes
    const handleConnected = () => {
      console.log('RTVI Client connected');
      setIsConnecting(false);
    };
    
    const handleDisconnected = () => {
      console.log('RTVI Client disconnected');
    };
    
    // Register event handlers
    rtviClient.on('serverMessage', handleServerMessage);
    rtviClient.on('connected', handleConnected);
    rtviClient.on('disconnected', handleDisconnected);
    
    return () => {
      // Clean up event handlers
      rtviClient.off('serverMessage', handleServerMessage);
      rtviClient.off('connected', handleConnected);
      rtviClient.off('disconnected', handleDisconnected);
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
        setIsConnecting(false);
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
        
        {/* Audio troubleshooting help */}
        <div className="space-y-2">          
          <p className="text-xs text-gray-500 text-center">
            If you can't hear any audio, check that your volume is turned up.
          </p>
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

// Export the main component that uses the RTVIProvider
export function Assistant() {
  return (
    <RTVIProvider>
      <AssistantContent />
    </RTVIProvider>
  );
}