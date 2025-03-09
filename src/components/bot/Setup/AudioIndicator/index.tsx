import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import styles from "./styles.module.css";

export const AudioIndicatorBar: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  // Initialize audio context and analyzer
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    // Create audio context
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    
    // Create analyzer
    const analyzerNode = context.createAnalyser();
    analyzerNode.fftSize = 256;
    analyzerNode.smoothingTimeConstant = 0.8;
    setAnalyzer(analyzerNode);
    
    // Get user media
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setMediaStream(stream);
        const source = context.createMediaStreamSource(stream);
        source.connect(analyzerNode);
      })
      .catch(err => {
        console.error("Error accessing microphone for audio indicator:", err);
      });
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      
      if (context && context.state !== 'closed') {
        context.close();
      }
    };
  }, []);
  
  // Update volume meter
  useEffect(() => {
    if (!analyzer || !volRef.current) return;
    
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    const updateVolume = () => {
      analyzer.getByteFrequencyData(dataArray);
      
      // Calculate volume average
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Scale to 0-1 range and apply to volume bar
      const volume = average / 255;
      if (volRef.current) {
        volRef.current.style.width = `${Math.max(2, volume * 100)}%`;
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(updateVolume);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(updateVolume);
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyzer]);

  return (
    <div className={styles.bar}>
      <div ref={volRef} />
    </div>
  );
};

export default AudioIndicatorBar;
