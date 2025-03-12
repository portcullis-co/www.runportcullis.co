import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Volume2, LogOut, StopCircle } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer, RTVIClientAudio } from '@pipecat-ai/client-react';
import { RTVIEvent } from '@pipecat-ai/client-js';

// Simple session view with voice visualizer interface
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [botSpeech, setBotSpeech] = useState('');
  
  // User speech events
  useRTVIClientEvent(RTVIEvent.UserStartedSpeaking, () => {
    console.log('[SESSION] User started speaking');
    setIsListening(true);
  });
  
  useRTVIClientEvent(RTVIEvent.UserStoppedSpeaking, () => {
    console.log('[SESSION] User stopped speaking');
    setIsListening(false);
    // Clear user speech after a short delay
    setTimeout(() => {
      setUserSpeech('');
    }, 3000);
  });
  
  // User transcription events
  useRTVIClientEvent(RTVIEvent.UserTranscript, (data: any) => {
    console.log('[SESSION] User transcription:', data);
    if (data) {
      setUserSpeech(data.text || '');
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
    // Clear bot speech after a delay
    setTimeout(() => {
      setBotSpeech('');
    }, 3000);
  });
  
  // Primary bot response handler
  useRTVIClientEvent(RTVIEvent.BotLlmText, (data: any) => {
    console.log('[SESSION] Bot LLM text:', data);
    if (data?.text) {
      setBotSpeech(prev => prev + (prev ? ' ' : '') + data.text);
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
  
  // Trigger bot to speak
  const triggerBotToSpeak = (text: string) => {
    if (!client) return;
    
    console.log('[SESSION] Triggering bot to speak:', text);
    
    // Send message to LLM with proper format
    client.action({
      service: 'llm',
      action: 'generate',
      arguments: [{
        name: 'messages',
        value: [
          {
            role: 'user',
            content: text
          }
        ]
      }]
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
      setTimeout(() => {
        triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
      }, 1000);
    };

    const handleTransportStateChange = (state: string) => {
      console.log('[SESSION] Transport state changed:', state);
      if (state === 'ready') {
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
  }, [client]);

  // Additional bot event handlers
  useRTVIClientEvent(RTVIEvent.BotTtsText, (data: any) => {
    console.log('[SESSION] Bot TTS text:', data);
    if (data?.text) {
      setBotSpeech(data.text);
    }
  });

  // Server message handler
  useRTVIClientEvent(RTVIEvent.ServerMessage, (message: any) => {
    console.log('[SESSION] Server message received:', message);
    if (message?.type === 'bot-message' && message?.data?.text) {
      setBotSpeech(message.data.text);
    }
    if (message?.type === 'user-transcription' && message?.data?.text) {
      setUserSpeech(message.data.text);
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
      
      <CardContent className="space-y-8">
        {/* User Voice Visualizer */}
        <div className="w-full">
          <div className="text-center mb-2 text-sm font-medium">
            {isListening ? '🎤 You are speaking...' : 'Waiting for speech...'}
          </div>
          <div className="h-16 w-full flex items-center justify-center bg-gray-50 rounded-lg">
            <VoiceVisualizer 
              participantType="local"
              backgroundColor="transparent"
              barColor={isListening ? "#22c55e" : "#9ca3af"}
              barGap={4}
              barWidth={6}
              barMaxHeight={40}
            />
          </div>
          {userSpeech && (
            <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm">
              {userSpeech}
            </div>
          )}
        </div>
        
        {/* Bot Voice Visualizer */}
        <div className="w-full">
          <div className="text-center mb-2 text-sm font-medium">
            {isSpeaking ? '🔊 Assistant is speaking...' : 'Assistant is listening'}
          </div>
          <div className="h-16 w-full flex items-center justify-center bg-blue-50 rounded-lg">
            <VoiceVisualizer 
              participantType="bot"
              backgroundColor="transparent"
              barColor={isSpeaking ? "#3b82f6" : "#9ca3af"}
              barGap={4}
              barWidth={6}
              barMaxHeight={40}
            />
          </div>
          {botSpeech && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
              {botSpeech}
            </div>
          )}
        </div>

        {/* Bot Audio Output - Essential for hearing the bot speak */}
        <RTVIClientAudio />
        
        {/* Test Button - For debugging */}
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => triggerBotToSpeak("Hello, I'm testing the voice assistant. Can you hear me?")}
          >
            Test Voice
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isListening ? '🎤 Listening...' : 
           isSpeaking ? '🔊 Speaking...' : 
           '✅ Ready'}
        </div>
      </CardFooter>
    </Card>
  );
} 