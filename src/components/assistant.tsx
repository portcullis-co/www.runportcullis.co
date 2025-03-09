import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Loader2, Volume2, VolumeX } from 'lucide-react';
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
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [audioTestPassed, setAudioTestPassed] = useState<boolean | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

  // Create an audio element for testing playback
  useEffect(() => {
    if (!audioElement.current) {
      const audio = new Audio();
      audio.oncanplay = () => {
        console.log('Audio can play');
      };
      audio.onerror = (e) => {
        console.error('Audio test error:', e);
        setAudioTestPassed(false);
      };
      audioElement.current = audio;
    }
  }, []);

  // Reset error count when connection state changes
  useEffect(() => {
    if (transportState === 'connected') {
      setErrorCount(0);
      // Test audio playback once connected
      testAudioPlayback();
    }
  }, [transportState]);

  // Function to test audio playback
  const testAudioPlayback = () => {
    if (!audioElement.current) return;
    
    try {
      // Use a short test tone
      const testToneUrl = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAZYAAAAALgAAA8AlZL4XsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQRAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAEFYGRlAD/+5JkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQMCA+QEOD8gICAyYEI/5AQEHv/2IYQDgf//8MBwQ////3BgP/////4YDwQ//1AgICAQCAQAAAAAAArI=';
      audioElement.current.src = testToneUrl;
      
      // Play the test sound
      const playPromise = audioElement.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playback test successful');
            setAudioTestPassed(true);
            // Stop it after a short time
            setTimeout(() => {
              if (audioElement.current) {
                audioElement.current.pause();
              }
            }, 300);
          })
          .catch((err) => {
            console.error('Audio playback test failed:', err);
            setAudioTestPassed(false);
          });
      }
    } catch (err) {
      console.error('Audio test error:', err);
      setAudioTestPassed(false);
    }
  };

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
          setConversationStatus(`You: ${message.data?.text || 'Listening...'}`);
          break;
        case 'bot-transcription':
          console.log('Bot transcription:', message.data);
          setConversationStatus(`Portcullis: ${message.data?.text || 'Speaking...'}`);
          break;
        case 'bot-llm-text':
          console.log('Bot LLM text:', message.data);
          break;
        case 'bot-llm-started':
          console.log('Bot LLM started');
          setConversationStatus('Thinking...');
          break;
        case 'bot-llm-stopped':
          console.log('Bot LLM stopped');
          break;
        case 'bot-tts-started':
          console.log('Bot TTS started');
          setBotSpeaking(true);
          break;
        case 'bot-tts-stopped':
          console.log('Bot TTS stopped');
          setBotSpeaking(false);
          break;
        case 'user-started-speaking':
          console.log('User started speaking');
          setUserSpeaking(true);
          break;
        case 'user-stopped-speaking':
          console.log('User stopped speaking');
          setUserSpeaking(false);
          break;
        case 'error':
          console.error('RTVI error:', message.data);
          
          // Extract error message
          const errorMessage = message.data?.message || 'Unknown error';
          
          // Increment error count
          setErrorCount(prev => prev + 1);
          
          // Show specific error for audio issues if audio test failed
          if (audioTestPassed === false && (
            errorMessage.includes('tts') || 
            errorMessage.includes('audio') || 
            errorMessage.includes('playback')
          )) {
            setError('Audio playback issue detected. Please check your speakers or headphones and ensure audio is enabled in your browser.');
          } 
          // Only show other errors if it's not a TTS error or if we've seen multiple errors
          else if (!errorMessage.includes('tts') || errorCount > 2) {
            setError(`Error: ${errorMessage}`);
            setConversationStatus('Error occurred');
          } else {
            console.log('Suppressing TTS error display to user');
          }
          break;
        case 'metrics':
          // Don't log metrics to avoid console spam
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
      setBotSpeaking(false);
      setUserSpeaking(false);
    };

    const handleConnected = () => {
      console.log('Connected to assistant');
      setConversationStatus('Connected');
      setError(null);
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
  }, [rtviClient, errorCount, audioTestPassed]);

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
    setAudioTestPassed(null);
    
    try {
      if (transportState === 'disconnected') {
        console.log('Attempting to connect to assistant...');
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

  // Get status indicator
  const getStatusIndicator = () => {
    if (botSpeaking) {
      return (
        <div className="flex items-center text-sm text-green-500">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Portcullis is speaking
        </div>
      );
    }
    
    if (userSpeaking) {
      return (
        <div className="flex items-center text-sm text-blue-500">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Listening to you
        </div>
      );
    }

    // Show audio status if available
    if (audioTestPassed !== null && transportState === 'connected') {
      return (
        <div className={`flex items-center text-sm ${audioTestPassed ? 'text-green-500' : 'text-red-500'}`}>
          {audioTestPassed ? (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              Audio working
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 mr-2" />
              Audio issue detected
            </>
          )}
        </div>
      );
    }
    
    if (transportState === 'connected') {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
          </span>
          Ready
        </div>
      );
    }
    
    return null;
  };

  // Retry audio test
  const handleRetryAudio = () => {
    setAudioTestPassed(null);
    testAudioPlayback();
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

        {getStatusIndicator()}

        {conversationStatus && (
          <div className="text-sm text-blue-500 min-h-[3rem] max-h-[6rem] overflow-y-auto">
            {conversationStatus}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">
            {error}
            {(errorCount > 3 || audioTestPassed === false) && (
              <div className="mt-2 flex space-x-2">
                {audioTestPassed === false && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetryAudio}
                  >
                    Test Audio
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setError(null);
                    setErrorCount(0);
                  }}
                >
                  Dismiss
                </Button>
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
        
        // Create the client instance with minimal configuration
        // to reduce potential errors
        const rtviClient = new RTVIClient({
          transport,
          enableMic: true,
          enableCam: false,
          params: {
            baseUrl: '/api/assistant',
            // IMPORTANT: This field needs to be "endpoints" not "endpoint"
            endpoints: {
              connect: '/connect'
            },
            requestData: {
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