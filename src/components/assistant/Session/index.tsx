import { LineChart, Loader2, LogOut, Settings, StopCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PipecatMetricsData,
  RTVIClientConfigOption,
  RTVIEvent,
  TransportState,
} from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent } from "@pipecat-ai/client-react";

import StatsAggregator from "@/pages/utils/stats_aggregator";
import { Configure } from "@/components/assistant/Setup";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import Agent from "./Agent";
import Stats from "./Stats";
import UserMicBubble from "./UserMicBubble";
import CalendarDialog from "./CalendarDialog";
import CallRequestDialog from "./CallRequestDialog";

let stats_aggregator: StatsAggregator;

interface SessionProps {
  state: TransportState;
  onLeave: () => void;
  openMic?: boolean;
  startAudioOff?: boolean;
}

export const Session = React.memo(
  ({ state, onLeave, startAudioOff = false }: SessionProps) => {
    const voiceClient = useRTVIClient()!;
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [showConfig, setShowConfig] = useState<boolean>(false);
    const [showStats, setShowStats] = useState<boolean>(false);
    const [muted, setMuted] = useState(startAudioOff);
    const [runtimeConfigUpdate, setRuntimeConfigUpdate] = useState<
      RTVIClientConfigOption[] | null
    >(null);
    const [updatingConfig, setUpdatingConfig] = useState<boolean>(false);
    
    // Calendar dialog state
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [calendarLink, setCalendarLink] = useState<string>("team/portcullis/portcullis-intro");
    
    // Call request dialog state
    const [showCallRequest, setShowCallRequest] = useState<boolean>(false);
    const [callRequestMessage, setCallRequestMessage] = useState<string>("Enter your phone number to receive a call from our AI assistant.");
    
    const modalRef = useRef<HTMLDialogElement>(null);
    //const bingSoundRef = useRef<HTMLAudioElement>(null);
    //const bongSoundRef = useRef<HTMLAudioElement>(null);

    // ---- Voice Client Events

    useRTVIClientEvent(
      RTVIEvent.Metrics,
      useCallback((metrics: PipecatMetricsData) => {
        metrics?.ttfb?.map((m: { processor: string; value: number }) => {
          stats_aggregator.addStat([m.processor, "ttfb", m.value, Date.now()]);
        });
      }, [])
    );

    // Listen for function calls from the LLM
    useRTVIClientEvent(
      RTVIEvent.LLMFunctionCall,
      useCallback(async (data: any) => {
        console.log('Function call received from RTVI:', data);
        
        try {
          // Make API call to our function-call endpoint
          const response = await fetch('/api/assistant/function-call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              function_name: data.function_name,
              arguments: data.args || {}
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error calling function:', errorData);
          } else {
            console.log('Function call successful');
            
            // For show_calendar, directly set the state
            if (data.function_name === 'show_calendar') {
              setShowCalendar(true);
            }
            // For create_call, directly set the state
            else if (data.function_name === 'create_call') {
              setShowCallRequest(true);
            }
          }
        } catch (error) {
          console.error('Error processing function call:', error);
        }
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        if (hasStarted) return;
        setHasStarted(true);
      }, [hasStarted])
    );

    useRTVIClientEvent(
      RTVIEvent.UserStoppedSpeaking,
      useCallback(() => {
        /*if (bongSoundRef.current) {
          bongSoundRef.current.volume = 0.5;
          bongSoundRef.current.play();
        }*/

        if (hasStarted) return;
        setHasStarted(true);
      }, [hasStarted])
    );

    // ---- Effects

    useEffect(() => {
      // Reset started state on mount
      setHasStarted(false);
    }, []);

    useEffect(() => {
      // If we joined unmuted, enable the mic once in ready state
      if (!hasStarted || startAudioOff) return;
      voiceClient.enableMic(true);
    }, [voiceClient, startAudioOff, hasStarted]);

    useEffect(() => {
      // Create new stats aggregator on mount (removes stats from previous session)
      stats_aggregator = new StatsAggregator();
    }, []);

    useEffect(() => {
      // Leave the meeting if there is an error
      if (state === "error") {
        onLeave();
      }
    }, [state, onLeave]);

    useEffect(() => {
      // Modal effect
      // Note: backdrop doesn't currently work with dialog open, so we use setModal instead
      const current = modalRef.current;

      if (current && showConfig) {
        current.inert = true;
        current.showModal();
        current.inert = false;
      }
      return () => current?.close();
    }, [showConfig]);

    // SSE Event Listeners for tool events
    useEffect(() => {
      // Set up SSE connection
      const eventSource = new EventSource('/api/assistant/sse');

      // Handler for show_calendar event
      const handleShowCalendar = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          // Set the calendar link if provided, otherwise use default
          if (data.calendarLink) {
            setCalendarLink(data.calendarLink);
          }
          
          // Show the calendar dialog
          setShowCalendar(true);
        } catch (error) {
          console.error('Error parsing show_calendar event:', error);
        }
      };

      // Handler for create_call event
      const handleCreateCall = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          // Set the message if provided
          if (data.message) {
            setCallRequestMessage(data.message);
          }
          
          // Show the call request dialog
          setShowCallRequest(true);
        } catch (error) {
          console.error('Error parsing create_call event:', error);
        }
      };

      // Add event listeners
      eventSource.addEventListener('show_calendar', handleShowCalendar);
      eventSource.addEventListener('create_call', handleCreateCall);

      // Connection status events
      eventSource.addEventListener('open', () => {
        console.log('SSE connection established');
      });

      eventSource.addEventListener('error', (e) => {
        console.error('SSE connection error:', e);
      });

      // Cleanup on unmount
      return () => {
        eventSource.removeEventListener('show_calendar', handleShowCalendar);
        eventSource.removeEventListener('create_call', handleCreateCall);
        eventSource.close();
      };
    }, []);

    function toggleMute() {
      voiceClient.enableMic(muted);
      setMuted(!muted);
    }

    return (
      <TooltipProvider>
        <>
          <dialog ref={modalRef} className="p-0 rounded-lg shadow-lg bg-white">
            <Card.Card className="w-svw max-w-full md:max-w-md lg:max-w-lg">
              <Card.CardHeader>
                <Card.CardTitle>Porticia Setup</Card.CardTitle>
              </Card.CardHeader>
              <Card.CardContent>
                <Configure state={state} inSession={true} />
              </Card.CardContent>
              <Card.CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfig(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={updatingConfig}
                  onClick={async () => {
                    const config: RTVIClientConfigOption[] = (
                      voiceClient.params.requestData as {
                        config: RTVIClientConfigOption[];
                      }
                    )?.config;
                    if (!config) return;

                    setUpdatingConfig(true);
                    await voiceClient.updateConfig(config);
                    // On update, reset state
                    setUpdatingConfig(false);
                    setShowConfig(false);
                  }}
                >
                  {updatingConfig && <Loader2 className="animate-spin" />}
                  {updatingConfig ? "Updating..." : "Save Changes"}
                </Button>
              </Card.CardFooter>
            </Card.Card>
          </dialog>

          {/* Calendar Dialog */}
          <CalendarDialog 
            open={showCalendar}
            onClose={() => setShowCalendar(false)}
          />

          {/* Call Request Dialog */}
          <CallRequestDialog
            open={showCallRequest}
            onClose={() => setShowCallRequest(false)}
            message={callRequestMessage}
          />

          {showStats &&
            createPortal(
              <Stats
                statsAggregator={stats_aggregator}
                handleClose={() => setShowStats(false)}
              />,
              document.getElementById("tray")!
            )}

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <Card.Card className="w-full max-w-[320px] sm:max-w-[420px] mt-auto shadow-lg">
              <Agent
                isReady={state === "ready"}
                statsAggregator={stats_aggregator}
              />
            </Card.Card>
            <UserMicBubble
              active={hasStarted}
              muted={muted}
              handleMute={() => toggleMute()}
            />
          </div>

          <footer className="w-full flex flex-row mt-auto self-end md:w-auto">
            <div className="flex flex-row justify-between gap-3 w-full md:w-auto">
              <Tooltip>
                <TooltipContent>Interrupt bot</TooltipContent>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      voiceClient.action({
                        service: "tts",
                        action: "interrupt",
                        arguments: [],
                      });
                    }}
                  >
                    <StopCircle />
                  </Button>
                </TooltipTrigger>
              </Tooltip>

              <Tooltip>
                <TooltipContent>Show bot statistics panel</TooltipContent>
                <TooltipTrigger asChild>
                  <Button
                    variant={showStats ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <LineChart />
                  </Button>
                </TooltipTrigger>
              </Tooltip>
              <Tooltip>
                <TooltipContent>Configure</TooltipContent>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfig(true)}
                  >
                    <Settings />
                  </Button>
                </TooltipTrigger>
              </Tooltip>
              <Button onClick={() => onLeave()} className="ml-auto">
                <LogOut size={16} />
                End
              </Button>
            </div>
          </footer>
          {/*audio ref={bingSoundRef} src="/bing.wav" />
          <audio ref={bongSoundRef} src="/bong.wav" /> */}
        </>
      </TooltipProvider>
    );
  },
  (p, n) => p.state === n.state
);

Session.displayName = "Session";

export default Session;
