import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2 } from 'lucide-react';
import { useRTVIClient, useRTVIClientTransportState, RTVIClientProvider, RTVIClientAudio } from '@pipecat-ai/client-react';
import { DailyTransport } from '@pipecat-ai/daily-transport';

// Wrapper component to provide the RTVI client context
function AssistantContent() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

  // Using a ref to keep track of the audio element without triggering rerenders
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  // Using a ref to track if we've already set up audio handling
  const audioHandlingSetup = useRef(false);

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

  // Initialize audio context and ensure it's ready
  useEffect(() => {
    if (audioReady) return;

    const unlockAudio = () => {
      try {
        // Create and play a silent audio context to unlock audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
          audioContext.resume()
            .then(() => {
              console.log('Audio context resumed successfully:', audioContext.state);
              setAudioReady(true);
            })
            .catch(err => console.error('Failed to resume audio context:', err));
        } else {
          console.log('Audio context already active:', audioContext.state);
          setAudioReady(true);
        }
        
        // Create a short sound to ensure proper unlocking
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.01; // Very low volume
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        // Create a silent audio element and play it to unlock audio on iOS
        const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
        silentAudio.play().catch(e => console.log('Silent audio play failed but this is expected:', e));
        
      } catch (err) {
        console.error('Error unlocking audio context:', err);
      }
    };

    unlockAudio();

    // Add event listeners for user interaction to unlock audio
    const handleUserInteraction = () => {
      unlockAudio();
      if (audioElementRef.current) {
        audioElementRef.current.play().catch(e => console.warn('Audio play from interaction failed:', e));
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioReady]);

  // Configure audio when device is selected
  useEffect(() => {
    if (rtviClient && selectedDevice) {
      // Use type assertion to bypass TypeScript checking
      try {
        (rtviClient as any).setAudioInput?.(selectedDevice);
        console.log('Audio input device set to:', selectedDevice);
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

  // Set up audio track handling when rtviClient is available
  useEffect(() => {
    if (!rtviClient || audioHandlingSetup.current) return;
    
    audioHandlingSetup.current = true;
    
    console.log('Setting up audio track handling');
    
    // Initialize audio element
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio();
      audioElementRef.current.autoplay = true;
      audioElementRef.current.controls = false; // Usually hidden controls
      audioElementRef.current.id = 'rtvi-audio-output';
      audioElementRef.current.volume = 1.0; // Maximum volume
      
      // Append to body to ensure it's part of the DOM
      document.body.appendChild(audioElementRef.current);
      
      console.log('Created audio element for output');
    }
    
    const handleAudioTrack = (track: MediaStreamTrack, participant: any) => {
      if (participant.local || track.kind !== 'audio') return;
      
      console.log('Received remote audio track, setting up playback');
      
      // Create a new MediaStream with the track
      const stream = new MediaStream([track]);
      
      // Set the stream as the source for our audio element
      if (audioElementRef.current) {
        audioElementRef.current.srcObject = stream;
        
        // Try to play the audio
        audioElementRef.current.play()
          .then(() => {
            console.log('Audio playback started successfully');
          })
          .catch(err => {
            console.warn('Audio playback failed:', err);
            
            // Create a visible play button to allow user-initiated play
            if (!document.getElementById('audio-fallback-button')) {
              const playButton = document.createElement('button');
              playButton.id = 'audio-fallback-button';
              playButton.textContent = 'Enable Audio';
              playButton.style.position = 'fixed';
              playButton.style.bottom = '20px';
              playButton.style.right = '20px';
              playButton.style.zIndex = '9999';
              playButton.style.padding = '10px 15px';
              playButton.style.background = '#4f46e5';
              playButton.style.color = 'white';
              playButton.style.borderRadius = '5px';
              playButton.style.border = 'none';
              playButton.style.cursor = 'pointer';
              
              playButton.onclick = () => {
                if (audioElementRef.current) {
                  audioElementRef.current.play()
                    .then(() => {
                      console.log('Audio playback started via button');
                      playButton.remove();
                    })
                    .catch(e => console.error('Audio play still failed:', e));
                }
              };
              
              document.body.appendChild(playButton);
            }
          });
      }
    };
    
    // Add track start listener
    rtviClient.on('trackStarted' as any, handleAudioTrack);
    
    return () => {
      rtviClient.off('trackStarted' as any, handleAudioTrack);
      
      // Clean up audio element
      if (audioElementRef.current) {
        audioElementRef.current.remove();
        audioElementRef.current = null;
      }
      
      // Remove fallback button if it exists
      const fallbackButton = document.getElementById('audio-fallback-button');
      if (fallbackButton) {
        fallbackButton.remove();
      }
      
      audioHandlingSetup.current = false;
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
        console.log('Initializing audio before connecting...');
        // Force audio initialization before connecting
        try {
          // Create a silent audio context and ensure it's running
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log('Audio context resumed before connecting:', audioContext.state);
          }
          
          // Play a silent audio element to unblock audio on Safari/iOS
          const audio = new Audio();
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          await audio.play();
          console.log('Audio initialized successfully');
        } catch (audioErr) {
          console.warn('Audio initialization warning:', audioErr);
          // Continue despite audio initialization issues
        }
        
        console.log('Attempting to connect to assistant service...');
        // Now connect to the service
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
      
      // Additional debugging info
      if (err instanceof Error && err.stack) {
        console.error('Error stack:', err.stack);
      }
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

        {/* Audio status indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className={`h-4 w-4 ${audioReady ? 'text-green-500' : 'text-gray-400'}`} />
          <span>{audioReady ? 'Audio ready' : 'Audio initializing...'}</span>
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
        console.log('Using API base URL:', PIPECAT_API_URL);
        
        // Dynamically import the modules
        const { RTVIClient } = await import('@pipecat-ai/client-js');
        const { DailyTransport } = await import('@pipecat-ai/daily-transport');
        
        // Create the transport with the correct options
        const transport = new DailyTransport({
          dailyFactoryOptions: {
            audioSource: true,
            videoSource: false,
            subscribeToTracksAutomatically: true,
            dailyConfig: {
              userMediaAudioConstraints: {
                autoGainControl: true,
                echoCancellation: true,
                noiseSuppression: true,
              }
            }
          }
        });
        
        // Log transport creation
        console.log('Transport created successfully');
        
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
            config: [
              {
                service: "tts",
                options: [
                  { name: "output_format", value: "mp3" },
                  { name: "optimize_streaming_latency", value: 4 },
                ],
              }
            ],
          },
          callbacks: {
            onBotReady: () => console.log('Bot is ready'),
            onBotTtsStarted: () => console.log('Bot TTS started'),
            onBotTtsStopped: () => console.log('Bot TTS stopped'),
            onError: (error) => console.error('RTVI client error:', error),
            onTrackStarted: (track: MediaStreamTrack) => {
              console.log('Track started:', track);
              // Force track to play if it's audio
              if (track.kind === 'audio') {
                console.log('Audio track received, attempting to play');
              }
            }
          }
        });
        
        // Log successful client creation
        console.log('RTVI client created successfully');
        
        setClient(rtviClient);
      } catch (error) {
        console.error('Failed to load Pipecat client:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    }
    
    // Define unlockAudio function outside to have access in cleanup
    const unlockAudio = () => {
      try {
        // Create and play a silent audio context to unlock audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Add this line to ensure the context is resumed
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => console.log('Audio context resumed'));
        }
        
        // Create a longer sound to ensure proper unlocking
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.01; // Very low volume
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 0.2); // Slightly longer duration
        
        // Also try to play a silent audio file
        const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
        silentAudio.play().catch(err => console.log('Silent audio play failed but this is expected:', err));
        
        console.log('Audio context unlocked:', audioContext.state);
        
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      } catch (err: unknown) {
        console.error('Error unlocking audio context:', err);
      }
    };
    
    // Add event listeners
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    
    // Immediately try to unlock audio for browser support
    unlockAudio();
    
    loadClient();
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      
      // Properly disconnect client if it exists
      if (client) {
        try {
          client.disconnect().catch((err: unknown) => {
            console.warn('Error during disconnect in cleanup:', err);
          });
        } catch (err: unknown) {
          console.warn('Error during cleanup:', err);
        }
      }
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