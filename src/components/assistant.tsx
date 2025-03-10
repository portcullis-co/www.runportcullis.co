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

  // Handle RTVI client events for transcription and user state
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
    };

    rtviClient.on('serverMessage' as any, handleMessage);
    
    return () => {
      rtviClient.off('serverMessage' as any, handleMessage);
    };
  }, [rtviClient]);

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
          </div>
        )}

        {/* Audio status indicator based on transport state */}
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className={`h-4 w-4 ${transportState === 'connected' ? 'text-green-500' : 'text-gray-400'}`} />
          <span>{transportState === 'connected' ? 'Audio active' : 'Audio inactive'}</span>
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

// Main component that wraps the content with the RTVI client provider
export function Assistant() {
  // Import the necessary modules dynamically to avoid SSR issues
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    async function loadClient() {
      try {
        const PIPECAT_API_URL = import.meta.env.PIPECAT_API_URL;

        // Log initialization parameters
        console.log('Using API base URL:', PIPECAT_API_URL || '/api/assistant');
        
        // Dynamically import the modules
        const { RTVIClient } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        
        // Create the transport with the correct options for audio input AND output
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            audioSource: true,      // Enable microphone input
            videoSource: false,     // No camera needed
            subscribeToTracksAutomatically: true, // Auto-subscribe to remote audio tracks
            dailyConfig: {
              userMediaAudioConstraints: {
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
              }
            }
          }
        });
        
        console.log('Transport created with audio configuration');
        
        // Create the client instance with proper audio configuration
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
                  { name: "output_format", value: "mp3" },
                  { name: "optimize_streaming_latency", value: 4 },
                ],
              },
              {
                service: "audio",
                options: [
                  { name: "enable_output", value: true },
                  { name: "enable_input", value: true },
                ],
              }
            ],
          },
          callbacks: {
            onBotReady: () => console.log('Bot is ready for interaction'),
            onBotTtsStarted: () => console.log('Bot TTS audio stream started'),
            onBotTtsStopped: () => console.log('Bot TTS audio stream stopped'),
            onError: (error) => console.error('RTVI client error:', error),
            onTrackStarted: (track) => {
              console.log('Track started:', track);
              if (track.kind === 'audio') {
                console.log('Audio track received - handling should be automatic');
                // Force play on iOS/Safari which might need user interaction
                try {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => console.log('Audio context resumed for track'));
                  }
                } catch (err) {
                  console.warn('Failed to resume audio context:', err);
                }
              }
            },
            onTrackStopped: (track) => {
              console.log('Track stopped:', track);
            },
            onConnected: () => {
              console.log('RTVI client connected and ready');
            }
          }
        });
        
        console.log('RTVI client created with proper audio configuration');
        setClient(rtviClient);
      } catch (error) {
        console.error('Failed to load Pipecat client:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    }
    
    // Simple audio context initialization for browser auto-play policy
    const unlockAudio = () => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('Initial audio context state:', audioContext.state);
        
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log('Audio context resumed successfully to:', audioContext.state);
          });
        }
        
        // Play a short, silent sound to help unlock audio on iOS/Safari
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.001; // Very low volume, practically silent
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.01);
        
        console.log('Audio unlock attempt completed');
      } catch (err) {
        console.error('Error in audio unlock function:', err);
      }
    };
    
    // Try to unlock audio on component mount
    unlockAudio();
    
    // Add event listeners for user interaction to help unlock audio
    const handleUserInteraction = () => {
      unlockAudio();
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    loadClient();
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      
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
      {/* RTVIClientAudio is a critical component that handles the audio playback */}
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
} 