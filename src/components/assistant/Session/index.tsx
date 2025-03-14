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
    const [calendarUrl, setCalendarUrl] = useState<string>("https://cal.com/team/portcullis/portcullis-intro");
    
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

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        if (hasStarted) return;

        /*if (bingSoundRef.current) {
          bingSoundRef.current.volume = 0.5;
          bingSoundRef.current.play();
        }*/
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

    // SSE Event Listener for show_calendar event
    useEffect(() => {
      // Set up SSE connection
      const eventSource = new EventSource('/api/assistant/events');

      // Handler for show_calendar event
      const handleShowCalendar = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          // Set the calendar URL if provided, otherwise use default
          if (data.url) {
            setCalendarUrl(data.url);
          }
          
          // Show the calendar dialog
          setShowCalendar(true);
        } catch (error) {
          console.error('Error parsing show_calendar event:', error);
        }
      };

      // Add event listener
      eventSource.addEventListener('show_calendar', handleShowCalendar);

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

          {/* <CalendarDialog
            open={showCalendar}
            onOpenChange={setShowCalendar}
            calendarUrl={calendarUrl}
          /> */}

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
