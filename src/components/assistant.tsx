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
  const [hasReceivedAudioTrack, setHasReceivedAudioTrack] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [lastTTSResponse, setLastTTSResponse] = useState<string>('');

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
      
      // Track audio events from the bot
      if (event.type === 'bot-tts-started') {
        setIsTTSPlaying(true);
        setHasReceivedAudioTrack(true);
        console.log('TTS STARTED - AUDIO SHOULD BE PLAYING NOW');
      } else if (event.type === 'bot-tts-stopped') {
        setIsTTSPlaying(false);
        console.log('TTS STOPPED');
      }
      
      // Track LLM responses
      if (event.type === 'bot-llm-text' && event.data?.text) {
        setLastTTSResponse(prev => prev + event.data.text);
      } else if (event.type === 'bot-llm-stopped') {
        // Keep last response but prepare for next one
        setTimeout(() => setLastTTSResponse(''), 5000);
      }
    };

    rtviClient.on('serverMessage' as any, handleMessage);
    
    return () => {
      rtviClient.off('serverMessage' as any, handleMessage);
    };
  }, [rtviClient]);

  // Track when an audio track is received
  useEffect(() => {
    if (!rtviClient) return;
    
    const handleTrackStarted = (track: any) => {
      if (track.kind === 'audio' && track.label?.includes('remote')) {
        setHasReceivedAudioTrack(true);
      }
    };
    
    rtviClient.on('trackStarted' as any, handleTrackStarted);
    
    return () => {
      rtviClient.off('trackStarted' as any, handleTrackStarted);
    };
  }, [rtviClient]);

  // Add a special listener for bot responses
  useEffect(() => {
    if (!rtviClient) return;
    
    // Function to directly play PCM audio data
    const playPCMAudio = (audioData: ArrayBuffer) => {
      try {
        console.log('Attempting to play PCM audio directly');
        
        // Create a new audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Make sure it's running
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        // Create a buffer source
        const source = audioContext.createBufferSource();
        
        // Process PCM data at 24kHz
        audioContext.decodeAudioData(
          audioData, 
          (decodedData) => {
            source.buffer = decodedData;
            source.connect(audioContext.destination);
            source.start(0);
            console.log('PCM audio playback started');
          },
          (err) => {
            console.error('Error decoding PCM data:', err);
          }
        );
      } catch (err) {
        console.error('Error in PCM playback:', err);
      }
    };

    // Listen for bot-tts-audio events
    const handleRawAudio = (message: any) => {
      if (message.type === 'bot-tts-audio' && message.data?.buffer) {
        console.log('Received bot-tts-audio event with buffer');
        playPCMAudio(message.data.buffer);
      }
    };
    
    // Register the handler
    rtviClient.on('serverMessage' as any, handleRawAudio);
    
    return () => {
      rtviClient.off('serverMessage' as any, handleRawAudio);
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
        setIsConnecting(false);
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

  const handleManualAudioUnlock = () => {
    // Create and play an audio context to help with browser audio policies
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Manual audio unlock - context state:', audioContext.state);
      
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => console.log('Audio context resumed manually'));
      }
      
      // Create a short sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.01; // Very low volume, nearly silent
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(0);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      console.log('Manual audio unlock attempted');
    } catch (err) {
      console.error('Error in manual audio unlock:', err);
    }
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
            
            {lastTTSResponse && (
              <div className="p-3 bg-blue-50 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <Volume2 className={`h-4 w-4 ${isTTSPlaying ? 'text-blue-500 animate-pulse' : 'text-gray-500'}`} />
                  <span className="text-xs">{isTTSPlaying ? 'Bot speaking...' : 'Last response:'}</span>
                </div>
                <p><strong>Bot:</strong> {lastTTSResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* Audio status indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className={`h-4 w-4 ${hasReceivedAudioTrack ? 'text-green-500' : 
            (transportState === 'connected' ? 'text-yellow-500' : 'text-gray-400')}`} />
          <span>
            {hasReceivedAudioTrack 
              ? 'Audio connected and active' 
              : (transportState === 'connected' 
                ? 'Connected - try speaking to activate audio' 
                : 'Audio inactive - click Connect to start')}
          </span>
        </div>
        
        {/* Audio troubleshooting buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2" 
            onClick={handleManualAudioUnlock}
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Enable Audio (Safari/iOS)
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            If you can't hear any audio, check that your volume is turned up and try the button above.
            A debug audio player may appear at the bottom left corner if needed.
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
        
        // Create the transport with proper audio configuration
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
              // Match the server-side TTS configuration for ElevenLabs EXACTLY
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
              },
              // Enable audio input and output
              {
                service: "audio",
                options: [
                  { name: "enable_output", value: true },
                  { name: "enable_input", value: true },
                  { name: "output_volume", value: 1.0 },
                ],
              }
            ],
          },
          callbacks: {
            onBotReady: () => console.log('Bot is ready for interaction'),
            onTrackStarted: (track) => {
              console.log('Track started:', track);
              if (track.kind === 'audio') {
                console.log('Audio track received - handling should be automatic');
                // Create a visible audio element for debugging
                if (track.label?.includes('remote')) {
                  console.log('Creating visible audio element for debugging');
                  
                  // Remove any existing debug audio elements
                  const existingDebug = document.getElementById('debug-audio');
                  if (existingDebug) existingDebug.remove();
                  
                  // Create a new audio element
                  const audioElement = document.createElement('audio');
                  audioElement.id = 'debug-audio';
                  audioElement.controls = true; // Show controls for debugging
                  audioElement.autoplay = true;
                  audioElement.style.position = 'fixed';
                  audioElement.style.bottom = '10px';
                  audioElement.style.left = '10px';
                  audioElement.style.zIndex = '9999';
                  
                  // Create a MediaStream with the track
                  const stream = new MediaStream([track]);
                  audioElement.srcObject = stream;
                  
                  // Add to DOM
                  document.body.appendChild(audioElement);
                  
                  // Try to play
                  audioElement.play()
                    .then(() => console.log('Debug audio playback started'))
                    .catch(err => console.error('Debug audio playback failed:', err));
                }
              }
            },
            onTrackStopped: (track) => {
              console.log('Track stopped:', track);
            },
            onConnected: () => {
              console.log('RTVI client connected and ready');
            },
            // Listen for TTS audio events
            onBotTtsStarted: () => {
              console.log('TTS started - audio should be playing');
              
              // Force unlock audio context on iOS/Safari when TTS starts
              try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                  audioContext.resume().then(() => console.log('Audio context resumed for TTS'));
                }
              } catch (err) {
                console.warn('Failed to resume audio context for TTS:', err);
              }
            },
            onBotTtsStopped: () => {
              console.log('TTS stopped - audio should have played');
            },
            onError: (error) => {
              console.error('RTVI client error:', error);
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
      <RTVIClientAudio key={`rtvi-audio-${Date.now()}`} />
      {/* Add a hidden audio element as a fallback */}
      <audio 
        id="fallback-audio"
        autoPlay 
        style={{ display: 'none' }}
        ref={(el) => {
          if (el) {
            console.log('Fallback audio element added to DOM');
            el.volume = 1.0;
          }
        }}
      />
      {/* Add TTS debugging info */}
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
        RTVI Audio Debug: {client ? 'Client Ready' : 'No Client'} <br />
        TTS Voice: 6IlUNt4hAIP1jMBYQncS <br />
        TTS Model: eleven_turbo_v2 <br />
        Format: PCM 24000
        
        {/* Add test audio for browser audio capability testing */}
        <div style={{ marginTop: '10px' }}>
          <p>Test your browser audio:</p>
          <audio 
            src="https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3"
            controls
            style={{ width: '100%', height: '30px' }}
          />
        </div>
      </div>
    </RTVIClientProvider>
  );
}