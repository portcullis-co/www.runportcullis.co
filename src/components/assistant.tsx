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
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

  // Reset error count when connection state changes
  useEffect(() => {
    if (transportState === 'connected') {
      setErrorCount(0);
    }
  }, [transportState]);

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
          
          // Increment error count
          setErrorCount(prev => prev + 1);
          
          // Extract error message
          const errorMessage = message.data?.message || 'Unknown error';
          
          // Only show error if it's not a TTS error or if we've seen multiple errors
          if (!errorMessage.includes('tts') || errorCount > 2) {
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
  }, [rtviClient, errorCount]);

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
            {errorCount > 3 && (
              <div className="mt-1">
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