import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { useRTVIClient, useRTVIClientTransportState, RTVIClientProvider, RTVIClientAudio } from '@pipecat-ai/client-react';

// Wrapper component to provide the RTVI client context
function AssistantContent() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isListening, setIsListening] = useState(false);

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

  // Configure audio when device is selected
  useEffect(() => {
    if (rtviClient && selectedDevice) {
      // Use type assertion to bypass TypeScript checking
      // The actual implementation may have this method even if types don't reflect it
      try {
        (rtviClient as any).setAudioInput?.(selectedDevice);
      } catch (err) {
        console.warn('Failed to set audio input device:', err);
      }
    }
  }, [rtviClient, selectedDevice]);

  // Handle RTVI client events
  useEffect(() => {
    if (!rtviClient) return;

    const handleMessage = (event: any) => {
      console.log('RTVI Message received:', event);
      
      // Handle transcription updates
      if (event.type === 'user-transcription' && event.data?.text) {
        setTranscription(event.data.text);
      }
      
      // Handle listening state
      if (event.type === 'user-started-speaking') {
        setIsListening(true);
      } else if (event.type === 'user-stopped-speaking') {
        setIsListening(false);
      }
      
      // Add audio debugging
      if (event.type === 'bot-tts-started') {
        console.log('TTS audio started - checking audio context');
        try {
          // Force resume audio context if it's suspended
          const audioContext = (rtviClient as any)._transport?.dailyCallObject?._audioContext;
          if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => console.log('Audio context resumed'));
          }
          console.log('Audio context state:', audioContext?.state);
        } catch (err) {
          console.error('Error accessing audio context:', err);
        }
      }
      
      if (event.type === 'bot-tts-stopped') {
        console.log('TTS audio stopped');
      }
    };

    rtviClient.on('serverMessage' as any, handleMessage);
    
    return () => {
      rtviClient.off('serverMessage' as any, handleMessage);
    };
  }, [rtviClient]);

  const handleConnect = async () => {
    if (!rtviClient) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      if (transportState === 'disconnected') {
        // Force audio initialization before connecting
        await new Audio().play().catch(() => console.log('Audio initialized'));
        
        // Now connect to the service
        await rtviClient.connect();
      } else if (transportState === 'connected') {
        await rtviClient.disconnect();
      }
    } catch (err) {
      setError('Failed to connect to assistant');
      console.error(err);
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
            // The roomUrl property is used to specify the Daily room URL
            url: import.meta.env.PUBLIC_DAILY_ROOM_URL || '',
            audioSource: true, // Ensure audio source is enabled
            videoSource: false, // Disable video as we only need audio
          }
        });
        
        // Create the client instance
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: import.meta.env.PIPECAT_API_URL || '/api/assistant',
            endpoints: {
              connect: '/connect',
            },
          },
        });
        
        setClient(rtviClient);
        
        // Setup audio context unlock for iOS/Safari
        const unlockAudio = () => {
          // Create and play a silent audio context to unlock audio
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          oscillator.frequency.value = 1;
          oscillator.connect(audioContext.destination);
          oscillator.start(0);
          oscillator.stop(0.1);
          
          document.removeEventListener('click', unlockAudio);
          document.removeEventListener('touchstart', unlockAudio);
        };
        
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        
      } catch (error) {
        console.error('Failed to load Pipecat client:', error);
      }
    }
    
    loadClient();
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', function() {});
      document.removeEventListener('touchstart', function() {});
    };
  }, []);

  if (!client) {
    return <div>Loading assistant...</div>;
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