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
  
  // Bot speech events
  useRTVIClientEvent(RTVIEvent.BotStartedSpeaking, () => {
    console.log('[SESSION] Bot started speaking');
    setIsSpeaking(true);
  });
  
  useRTVIClientEvent(RTVIEvent.BotStoppedSpeaking, () => {
    console.log('[SESSION] Bot stopped speaking');
    setIsSpeaking(false);
  });
  
  // Bot transcript events
  useRTVIClientEvent(RTVIEvent.BotTranscript, (data: any) => {
    console.log('[SESSION] Bot transcript:', data);
    if (data && data.text) {
      // Check if we need to add a new message or update the last one
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant') {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: data.text }];
        } else {
          // Update last message
          lastMessage.content = data.text;
          return newMessages;
        }
      });
    }
  });
  
  // Handle BotLlmText events - primary way bot responses come through
  useRTVIClientEvent(RTVIEvent.BotLlmText, (data: any) => {
    console.log('[SESSION] BotLlmText received:', data);
    
    if (data && data.text) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant' || data.index === 0) {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: data.text }];
        } else {
          // Update last message with concatenated content
          lastMessage.content = data.text;
          return newMessages;
        }
      });
    }
  });
  
  // Fallback for legacy message types
  useRTVIClientEvent(RTVIEvent.ServerMessage, (message: any) => {
    console.log('[SESSION] Raw RTVI message:', message);
    
    // Handle LLM response messages (legacy format)
    if (message.type === 'llm-response' && message.data && message.data.text) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant' || message.data.index === 0) {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: message.data.text }];
        } else {
          // Update last message
          lastMessage.content += message.data.text;
          return newMessages;
        }
      });
    }
    
    // Handle bot-message format
    if (message.type === 'bot-message' && message.data && message.data.text) {
      console.log('[SESSION] Bot message detected:', message.data.text);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant') {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: message.data.text }];
        } else {
          // Update last message
          lastMessage.content = message.data.text;
          return newMessages;
        }
      });
    }
    
    // Handle bot-transcript format (sometimes used instead of BotTranscript event)
    if (message.type === 'bot-transcript' && message.data && message.data.text) {
      console.log('[SESSION] Bot transcript message detected:', message.data.text);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant') {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: message.data.text }];
        } else {
          // Update last message
          lastMessage.content = message.data.text;
          return newMessages;
        }
      });
    }
    
    // Handle bot-llm-chunk format (newer variant)
    if (message.type === 'bot-llm-chunk' && message.data && message.data.text) {
      console.log('[SESSION] Bot LLM chunk detected:', message.data.text);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (!lastMessage || lastMessage.role !== 'assistant' || message.data.index === 0) {
          // Add new assistant message
          return [...prev, { role: 'assistant', content: message.data.text }];
        } else {
          // Update last message
          lastMessage.content += message.data.text;
          return newMessages;
        }
      });
    }
    
    // Handle bot thinking events
    if (message.type === 'bot-thinking' && message.data) {
      console.log('[SESSION] Bot thinking:', message.data);
      // Optionally add UI indication that bot is thinking
    }
    
    // Log any message that might be a bot response
    if (message.type && (
      message.type.includes('bot') || 
      message.type.includes('llm') || 
      message.type.includes('ai') ||
      message.type.includes('response')
    )) {
      console.log('[SESSION] Potential bot response message detected:', message);
    }
    
    // Handle TTS events (legacy format)
    if (message.type === 'tts-start') {
      setIsSpeaking(true);
    }
    
    if (message.type === 'tts-end') {
      setIsSpeaking(false);
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
        arguments: [],
      });
    } catch (error) {
      console.error('Failed to interrupt bot:', error);
    }
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