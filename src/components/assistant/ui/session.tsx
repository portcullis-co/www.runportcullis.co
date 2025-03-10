import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Volume2, LogOut, StopCircle } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent } from '@pipecat-ai/client-react';

// Simple session view with chat interface
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // Set up event listeners
  useEffect(() => {
    if (!client) return;
    
    const handleServerMessage = (event: any) => {
      console.log('Server message received:', event);
      
      // User transcription events
      if (event.name === 'transcription') {
        const text = event.data.text || '';
        setTranscription(text);
        
        // Add user message when transcription is complete
        if (event.data.is_final) {
          setMessages(prev => [...prev, { role: 'user', content: text }]);
        }
      }
      
      // Bot text events
      if (event.name === 'llm-response') {
        const data = event.data;
        
        // If first chunk for this response, add a new entry
        if (data.index === 0) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
        } else {
          // Otherwise, append to the last message
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content += data.text;
            }
            return newMessages;
          });
        }
      }
      
      // Bot TTS events
      if (event.name === 'tts-start') {
        setIsSpeaking(true);
      }
      
      if (event.name === 'tts-end') {
        setIsSpeaking(false);
      }
      
      // User speaking events
      if (event.name === 'user-started-speaking') {
        setIsListening(true);
      }
      
      if (event.name === 'user-stopped-speaking') {
        setIsListening(false);
      }
    };
    
    client.on('serverMessage', handleServerMessage);
    
    return () => {
      client.off('serverMessage', handleServerMessage);
    };
  }, [client]);
  
  const handleInterrupt = () => {
    if (!client) return;
    
    client.action({
      service: "tts",
      action: "interrupt",
      arguments: [],
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portcullis AI Assistant</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleInterrupt}
            title="Interrupt bot"
          >
            <StopCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onLeave}
          >
            <LogOut className="h-4 w-4 mr-2" />
            End
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="max-h-96 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Start speaking to interact with the assistant.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`p-3 rounded-md ${
              message.role === 'assistant' ? 'bg-blue-50' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.role === 'assistant' ? (
                <Volume2 
                  className={`h-4 w-4 ${
                    isSpeaking ? 'text-blue-500 animate-pulse' : 'text-gray-500'
                  }`} 
                />
              ) : (
                <Mic 
                  className={`h-4 w-4 ${
                    isListening ? 'text-green-500 animate-pulse' : 'text-gray-500'
                  }`} 
                />
              )}
              <span className="text-xs font-medium">
                {message.role === 'assistant' 
                  ? (isSpeaking ? 'Bot speaking...' : 'Bot') 
                  : 'You'}
              </span>
            </div>
            <p className="mt-1 text-sm">{message.content}</p>
          </div>
        ))}
        
        {/* Show current transcription if not finalized */}
        {transcription && isListening && (
          <div className="p-3 bg-gray-100 rounded-md">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-xs font-medium">You (speaking...)</span>
            </div>
            <p className="mt-1 text-sm">{transcription}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isListening ? 
            <Mic className="h-5 w-5 text-green-500 animate-pulse" /> : 
            <Mic className="h-5 w-5" />}
          <span className="text-sm">
            {isListening ? 'Listening...' : 'Waiting for speech...'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
} 