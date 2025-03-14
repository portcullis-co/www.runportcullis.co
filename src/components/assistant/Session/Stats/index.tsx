import React, { useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import HelpTip from "@/components/ui/helptip";
import StatsAggregator from "@/pages/utils/stats_aggregator";

// Define types that match what StatsAggregator provides
interface MetricValue {
  latest?: number;
  high?: number;
  median?: number;
  low?: number;
  timeseries: number[];
}

interface StatsMap {
  [service: string]: {
    ttfb: MetricValue;
    characters?: MetricValue;
    processing?: MetricValue;
  };
}

interface StatsProps {
  statsAggregator: StatsAggregator;
  handleClose: () => void;
}

const StatsTile = ({
  service,
  metric,
  tip,
  sub = "s",
  multiplier = 3,
  data,
}: {
  service: string;
  sub?: string;
  metric: string;
  tip?: string;
  multiplier?: number;
  data: MetricValue;
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-2">
      <header className="flex justify-between items-center mb-2">
        <div className="text-sm font-semibold">
          {service.charAt(0).toUpperCase() + service.slice(1)} {metric}
          {tip && <HelpTip text={tip} />}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">Latest</span>
          <span className="font-medium">
            {data.latest?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </header>
      <div className="h-20 my-2">
        <Sparklines
          data={data.timeseries}
          limit={20}
          height={80}
          svgHeight={80}
        >
          <SparklinesBars style={{ fill: "#41c3f9", fillOpacity: ".25" }} />
          <SparklinesLine style={{ stroke: "#41c3f9", fill: "none" }} />
          <SparklinesReferenceLine type="mean" />
        </Sparklines>
      </div>
      <footer className="flex justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center">
          H:
          <span className="ml-1 font-medium">
            {data.high?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="flex items-center">
          M:
          <span className="ml-1 font-medium">
            {data.median?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="flex items-center">
          L:
          <span className="ml-1 font-medium">
            {data.low?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </footer>
    </div>
  );
};

export const Stats = React.memo(
  ({ statsAggregator, handleClose }: StatsProps) => {
    // Create a safe initial state with the expected structure
    const initialStats: StatsMap = {};
    // Handle the type conversion safely
    Object.entries(statsAggregator.statsMap).forEach(([service, metrics]) => {
      initialStats[service] = {} as any;
      
      if (metrics && typeof metrics === 'object') {
        if ('ttfb' in metrics) {
          initialStats[service].ttfb = metrics.ttfb as unknown as MetricValue;
        } else {
          // Create default empty metric if none exists
          initialStats[service].ttfb = { timeseries: [] };
        }
        
        if ('characters' in metrics) {
          initialStats[service].characters = metrics.characters as unknown as MetricValue;
        }
        
        if ('processing' in metrics) {
          initialStats[service].processing = metrics.processing as unknown as MetricValue;
        }
      }
    });
    
    const [currentStats, setCurrentStats] = useState<StatsMap>(initialStats);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current!);
      }

      intervalRef.current = setInterval(async () => {
        // Get latest stats from aggregator
        const newStats = statsAggregator.getStats();
        if (newStats) {
          // Convert the new stats to our format
          const updatedStats: StatsMap = {};
          Object.entries(newStats).forEach(([service, metrics]) => {
            updatedStats[service] = {} as any;
            
            if (metrics && typeof metrics === 'object') {
              if ('ttfb' in metrics) {
                updatedStats[service].ttfb = metrics.ttfb as unknown as MetricValue;
              } else {
                updatedStats[service].ttfb = { timeseries: [] };
              }
              
              if ('characters' in metrics) {
                updatedStats[service].characters = metrics.characters as unknown as MetricValue;
              }
              
              if ('processing' in metrics) {
                updatedStats[service].processing = metrics.processing as unknown as MetricValue;
              }
            }
          });
          
          setCurrentStats(updatedStats);
        }
      }, 2500);

      return () => clearInterval(intervalRef.current!);
    }, [statsAggregator]);

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="absolute top-0 right-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="m-3"
          >
            <X />
          </Button>
        </div>
        <div className="p-6 max-w-4xl w-full max-h-[90vh] bg-white rounded-lg shadow-lg overflow-auto">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentStats).length < 1 ? (
              <div className="col-span-full flex justify-center items-center py-8">
                <Loader2 className="animate-spin mx-auto" />
              </div>
            ) : (
              Object.entries(currentStats).map(([service, data], index) => {
                return (
                  <div key={service} className="space-y-2">
                    {data.ttfb && (
                      <StatsTile
                        key={`${service}-ttfb-${index}`}
                        metric="TTFB"
                        tip="Time to first byte"
                        service={service}
                        multiplier={3}
                        data={data.ttfb}
                      />
                    )}
                    {data.characters && (
                      <StatsTile
                        key={`${service}-chars-${index}`}
                        metric="Characters"
                        sub=""
                        service={service}
                        multiplier={0}
                        data={data.characters}
                      />
                    )}
                    {data.processing && (
                      <StatsTile
                        key={`${service}-proc-${index}`}
                        metric="Processing"
                        service={service}
                        data={data.processing}
                      />
                    )}
                  </div>
                );
              })
            )}
          </section>
        </div>
      </div>
    );
  },
  () => true
);

Stats.displayName = "Stats";

export default Stats;
