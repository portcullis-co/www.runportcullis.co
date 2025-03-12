import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer, RTVIClientAudio } from '@pipecat-ai/client-react';
import { RTVIEvent } from '@pipecat-ai/client-js';

// Zero-state management - Maximum responsiveness
export function PortcullisSessionView({ onLeave }: { onLeave: () => void }) {
  const client = useRTVIClient();
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  
  // Core function to trigger bot responses
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
    })
  };

  // The only event we need to handle is getting the transcript to send to the LLM
  useRTVIClientEvent(RTVIEvent.UserTranscript, (data: any) => {
    if (data?.text && data?.final) {
      triggerBotToSpeak(data.text);
    }
  });

  // Handle initial greeting
  useRTVIClientEvent(RTVIEvent.BotReady, () => {
    triggerBotToSpeak("Hello! I'm your Portcullis assistant. How can I help you today?");
  });

  // Track when user starts speaking
  useRTVIClientEvent(RTVIEvent.UserStartedSpeaking, () => {
    setIsUserSpeaking(true);
  });

  // Track when user stops speaking
  useRTVIClientEvent(RTVIEvent.UserStoppedSpeaking, () => {
    setIsUserSpeaking(false);
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
        {/* Voice Visualizer automatically connects to RTVI client */}
        <div className="w-full">
          <div className="text-center mb-2 text-sm font-medium">
            Portcullis Voice Assistant
            {isUserSpeaking && <span className="ml-2 text-green-500 animate-pulse">● User Speaking</span>}
          </div>
          <div className={`h-40 w-full flex items-center justify-center ${isUserSpeaking ? 'bg-gray-100' : 'bg-gray-50'} rounded-lg border ${isUserSpeaking ? 'border-green-300' : 'border-gray-200'} transition-colors duration-200`}>
            <VoiceVisualizer 
              participantType="bot"
              backgroundColor="transparent"
              barColor={isUserSpeaking ? "#22c55e" : "#000000"}
              barGap={4}
              barWidth={18}
              barMaxHeight={100}
            />
          </div>
        </div>

        {/* Essential audio component */}
        <RTVIClientAudio />
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground text-center">
        {isUserSpeaking ? "Listening..." : "Speak to interact with the assistant"}
      </CardFooter>
    </Card>
  );
} 