import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { 
  useRTVIClient, 
  useRTVIClientTransportState, 
  RTVIClientProvider, 
  RTVIClientAudio
} from '@pipecat-ai/client-react';

// Use type safety for RTVI events
type RTVIEventType = 
  | 'user-transcription' 
  | 'bot-llm-text' 
  | 'bot-tts-started' 
  | 'bot-tts-stopped'
  | 'user-started-speaking'
  | 'user-stopped-speaking'
  | 'bot-llm-stopped';

// Wrapper component to provide the RTVI client context
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
      console.log('RTVI Message received:', event);
      
      // Force update connecting state if we get messages
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
        console.log('TTS STARTED - AUDIO SHOULD BE PLAYING NOW');
      }
      
      if (event.type === 'bot-tts-stopped') {
        setIsTTSPlaying(false);
        console.log('TTS STOPPED');
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

// Main component that wraps the content with the RTVI client provider
export function Assistant() {
  const [client, setClient] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showDebugAudio, setShowDebugAudio] = useState(false); // For debugging

  useEffect(() => {
    async function loadClient() {
      try {
        const PIPECAT_API_URL = import.meta.env.PIPECAT_API_URL;

        // Log initialization parameters
        console.log('Using API base URL:', PIPECAT_API_URL || '/api/assistant');
        
        // Dynamically import the modules
        const { RTVIClient } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        
        // Create transport with audio output explicitly enabled
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            audioSource: true,
            videoSource: false,
            subscribeToTracksAutomatically: true,
            dailyConfig: {
              // Enable audio output processing
              userMediaAudioConstraints: {
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
              }
            }
          }
        });
        
        console.log('Transport created with explicit audio configuration');
        
        // Create the client with explicit audio configuration
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: PIPECAT_API_URL || '/api/assistant',
            endpoints: {
              connect: '/connect',
            },
            // Match server config exactly
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
        
        // Handle tracks directly
        rtviClient.on('trackStarted', (track: any) => {
          console.log('Track started:', track);
          
          if (track.kind === 'audio' && track.readyState === 'live') {
            console.log('Live audio track received, attaching manually');
            
            if (audioRef.current) {
              try {
                // Create a new MediaStream with the track
                const stream = new MediaStream([track]);
                audioRef.current.srcObject = stream;
                
                // Try to play
                audioRef.current.play()
                  .then(() => console.log('Direct audio playback started'))
                  .catch(err => {
                    console.error('Direct audio playback failed:', err);
                    // Try again with user interaction
                    const playButton = document.createElement('button');
                    playButton.textContent = 'Enable Audio';
                    playButton.style.position = 'fixed';
                    playButton.style.top = '10px';
                    playButton.style.left = '10px';
                    playButton.style.zIndex = '9999';
                    playButton.onclick = () => {
                      if (audioRef.current) {
                        audioRef.current.play()
                          .then(() => {
                            console.log('Audio started via button');
                            playButton.remove();
                          })
                          .catch(e => console.error('Still could not play audio:', e));
                      }
                    };
                    document.body.appendChild(playButton);
                  });
              } catch (err) {
                console.error('Error setting up audio:', err);
              }
            } else {
              console.warn('No audio element ref available');
            }
          }
        });
        
        console.log('RTVI client created with explicit audio configuration');
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
      
      {/* Direct audio element for manual audio handling */}
      <audio 
        ref={audioRef}
        id="direct-audio-output"
        autoPlay
        playsInline
        controls={showDebugAudio} 
        style={{ 
          display: showDebugAudio ? 'block' : 'none',
          position: showDebugAudio ? 'fixed' : 'absolute',
          bottom: showDebugAudio ? '70px' : '0',
          right: showDebugAudio ? '10px' : '0',
          zIndex: 1000,
          width: '300px'
        }}
      />
      
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
        <div onClick={() => setShowDebugAudio(!showDebugAudio)} style={{ cursor: 'pointer' }}>
          RTVI Audio Status: Active [Click to {showDebugAudio ? 'Hide' : 'Show'} Debug]<br />
        </div>
        TTS: ElevenLabs (PCM)<br />
        Format: PCM 24000<br />
        Voice: 6IlUNt4hAIP1jMBYQncS
      </div>
    </RTVIClientProvider>
  );
}