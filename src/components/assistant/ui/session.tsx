import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer, RTVIClientAudio } from '@pipecat-ai/client-react';
import { RTVIEvent } from '@pipecat-ai/client-js';

// Simplified session view with a single voice visualizer
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  
  // User speech events
  useRTVIClientEvent(RTVIEvent.UserStartedSpeaking, () => {
    setIsUserSpeaking(true);
    setIsListening(true);
  });
  
  useRTVIClientEvent(RTVIEvent.UserStoppedSpeaking, () => {
    setIsUserSpeaking(false);
    setIsListening(false);
    
    // When user stops speaking, use their transcript to trigger a response
    if (userTranscript.trim()) {
      // Small delay to ensure final transcript is received
      setTimeout(() => {
        triggerBotToSpeak(userTranscript);
        // Clear the user transcript after processing
        setUserTranscript('');
      }, 500);
    }
  });
  
  // User transcription events
  useRTVIClientEvent(RTVIEvent.UserTranscript, (data: any) => {
    if (data && data.text) {
      setCurrentTranscript(data.text);
      
      // If this is the final transcript, save it for processing when user stops speaking
      if (data.final) {
        setUserTranscript(data.text);
      }
    }
  });
  
  // Bot speech events
  useRTVIClientEvent(RTVIEvent.BotStartedSpeaking, () => {
    setIsSpeaking(true);
  });
  
  useRTVIClientEvent(RTVIEvent.BotStoppedSpeaking, () => {
    setIsSpeaking(false);
  });
  
  // Primary bot response handler
  useRTVIClientEvent(RTVIEvent.BotLlmText, (data: any) => {
    if (data?.text) {
      setCurrentTranscript(data.text);
    }
  });
  
  // Trigger bot to speak
  const triggerBotToSpeak = (text: string) => {
    if (!client) return;
    
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
      // Fall back to direct TTS if LLM fails
      client.action({
        service: 'tts',
        action: 'say',
        arguments: [{ name: 'text', value: text }]
      }).catch(err => {});
    });
  };

  // Enhanced bot ready handling
  useRTVIClientEvent(RTVIEvent.BotReady, () => {
    setTimeout(() => {
      triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
    }, 1000);
  });

  useRTVIClientEvent(RTVIEvent.TransportStateChanged, (state: string) => {
    if (state === 'ready') {
      setTimeout(() => {
        triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
      }, 1000);
    }
  });

  // Additional transcript handlers
  useRTVIClientEvent(RTVIEvent.BotTtsText, (data: any) => {
    if (data?.text) {
      setCurrentTranscript(data.text);
    }
  });

  useRTVIClientEvent(RTVIEvent.ServerMessage, (message: any) => {
    if (message?.type === 'bot-message' && message?.data?.text) {
      setCurrentTranscript(message.data.text);
    }
    if (message?.type === 'user-transcription' && message?.data?.text) {
      setCurrentTranscript(message.data.text);
      // If final transcription, also save for processing
      if (message?.data?.final) {
        setUserTranscript(message.data.text);
      }
    }
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portcullis AI Assistant</CardTitle>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onLeave}
        >
          <LogOut className="h-4 w-4 mr-2" />
          End
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Single Voice Visualizer */}
        <div className="w-full">
          <div className="text-center mb-2 text-sm font-medium">
            {isUserSpeaking ? 'You are speaking...' : 
             isSpeaking ? 'Assistant is speaking...' : 
             'Listening...'}
          </div>
          <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-lg">
            <VoiceVisualizer 
              participantType={isUserSpeaking ? "local" : "bot"}
              backgroundColor="transparent"
              barColor={isUserSpeaking ? "#22c55e" : isSpeaking ? "#3b82f6" : "#9ca3af"}
              barGap={4}
              barWidth={6}
              barMaxHeight={60}
            />
          </div>
          {currentTranscript && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              {currentTranscript}
            </div>
          )}
        </div>

        {/* Bot Audio Output - Essential for hearing the bot speak */}
        <RTVIClientAudio />
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground text-center">
        {isUserSpeaking ? 'Listening to you...' : 
         isSpeaking ? 'Assistant is speaking...' : 
         'Ready - speak or ask a question'}
      </CardFooter>
    </Card>
  );
} 