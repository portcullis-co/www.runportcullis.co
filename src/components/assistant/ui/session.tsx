import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Volume2, LogOut, StopCircle } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent } from '@pipecat-ai/client-react';
import { RTVIEvent } from '@pipecat-ai/client-js';

// Simple session view with chat interface
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // User speech events
  useRTVIClientEvent(RTVIEvent.UserStartedSpeaking, () => {
    console.log('[SESSION] User started speaking');
    setIsListening(true);
  });
  
  useRTVIClientEvent(RTVIEvent.UserStoppedSpeaking, () => {
    console.log('[SESSION] User stopped speaking');
    setIsListening(false);
  });
  
  // User transcription events
  useRTVIClientEvent(RTVIEvent.UserTranscript, (data: any) => {
    console.log('[SESSION] User transcription:', data);
    if (data) {
      setTranscription(data.text || '');
      
      // When transcription is final, add to messages
      if (data.final) {
        setMessages(prev => [...prev, { 
          role: 'user', 
          content: data.text 
        }]);
        setTranscription('');
      }
    }
  });
  
  // Bot speech events - simplified to match Daily demo
  useRTVIClientEvent(RTVIEvent.BotStartedSpeaking, () => {
    console.log('[SESSION] Bot started speaking');
    setIsSpeaking(true);
  });
  
  useRTVIClientEvent(RTVIEvent.BotStoppedSpeaking, () => {
    console.log('[SESSION] Bot stopped speaking');
    setIsSpeaking(false);
  });
  
  // Primary bot response handler - simplified to match Daily demo
  useRTVIClientEvent(RTVIEvent.BotLlmText, (data: any) => {
    console.log('[SESSION] Bot LLM text:', data);
    if (data?.text) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.text 
      }]);
    }
  });
  
  // Handle interrupting the bot
  const handleInterrupt = () => {
    if (!client) return;
    
    try {
      console.log('Interrupting bot...');
      client.action({
        service: "tts",
        action: "interrupt",
        arguments: []
      });
    } catch (error) {
      console.error('Failed to interrupt bot:', error);
    }
  };
  
  // Simplified bot speak trigger to match Daily demo
  const triggerBotToSpeak = (text: string) => {
    if (!client) return;
    
    console.log('[SESSION] Triggering bot to speak:', text);
    
    // Send message to bot first
    client.action({
      service: 'llm',
      action: 'generate',
      arguments: [{ name: 'text', value: text }]
    }).catch(error => {
      console.error('[SESSION] LLM generation failed:', error);
      // Fall back to direct TTS if LLM fails
      client.action({
        service: 'tts',
        action: 'say',
        arguments: [{ name: 'text', value: text }]
      }).catch(err => console.error('[SESSION] TTS failed:', err));
    });
  };

  // Enhanced bot ready handling
  useEffect(() => {
    if (!client) return;
    
    console.log('[SESSION] Setting up message handlers...');
    
    const handleBotReady = () => {
      console.log('[SESSION] Bot ready event received');
      if (messages.length === 0) {
        setTimeout(() => {
          triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
        }, 1000);
      }
    };

    const handleTransportStateChange = (state: string) => {
      console.log('[SESSION] Transport state changed:', state);
      if (state === 'ready' && messages.length === 0) {
        setTimeout(() => {
          console.log('[SESSION] Transport ready, sending greeting...');
          triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
        }, 1000);
      }
    };

    // Listen for both events
    client.on(RTVIEvent.BotReady, handleBotReady);
    client.on(RTVIEvent.TransportStateChanged, handleTransportStateChange);

    return () => {
      client.off(RTVIEvent.BotReady, handleBotReady);
      client.off(RTVIEvent.TransportStateChanged, handleTransportStateChange);
    };
  }, [client, messages]);

  // Bot event handlers
  useRTVIClientEvent(RTVIEvent.BotLlmStarted, () => {
    console.log('[SESSION] Bot started thinking...');
  });

  useRTVIClientEvent(RTVIEvent.BotLlmStopped, () => {
    console.log('[SESSION] Bot finished thinking');
  });

  useRTVIClientEvent(RTVIEvent.BotLlmText, (data: any) => {
    console.log('[SESSION] Bot LLM text:', data);
    if (data?.text) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.text 
      }]);
    }
  });

  useRTVIClientEvent(RTVIEvent.BotTtsStarted, () => {
    console.log('[SESSION] Bot started speaking');
    setIsSpeaking(true);
  });

  useRTVIClientEvent(RTVIEvent.BotTtsStopped, () => {
    console.log('[SESSION] Bot stopped speaking');
    setIsSpeaking(false);
  });

  useRTVIClientEvent(RTVIEvent.BotTtsText, (data: any) => {
    console.log('[SESSION] Bot TTS text:', data);
  });

  // Add message handlers for both modern and legacy formats
  useRTVIClientEvent(RTVIEvent.ServerMessage, (message: any) => {
    console.log('[SESSION] Server message received:', message);
    if (message?.type === 'bot-message' && message?.data?.text) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: message.data.text 
      }]);
    }
  });
  
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
            disabled={!isSpeaking}
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
      
      <CardContent className="max-h-96 overflow-y-auto space-y-4 relative">
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
            <p className="mt-1 text-sm whitespace-pre-wrap">{message.content}</p>
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
        
        {/* Test Speak Button - For debugging */}
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => triggerBotToSpeak("Hello, I'm testing the TTS functionality. Can you hear me?")}
          >
            Test TTS
          </Button>
        </div>
        
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
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
        
        <div className="text-xs text-gray-500">
          {isSpeaking ? 'Bot is speaking...' : 'Bot is ready'}
        </div>
      </CardFooter>
    </Card>
  );
} 