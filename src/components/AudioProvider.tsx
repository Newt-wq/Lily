'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  fadeIn: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio('/audio/serta-mulia.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Check if browser allows autoplay on user interaction
    const handleInteraction = () => {
      // We don't autoplay immediately, but we prepare the audio context
      if (audioRef.current) {
        // Just load, don't play yet
        audioRef.current.load();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay blocked or audio failed:', err));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const fadeIn = () => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = 0;
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
        let vol = 0;
        
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        
        fadeIntervalRef.current = setInterval(() => {
          if (vol < 0.8) {
            vol += 0.05;
            audio.volume = Math.min(vol, 0.8);
          } else {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          }
        }, 100);
      })
      .catch(err => console.log('Autoplay blocked on fadeIn:', err));
  };

  return (
    <AudioContext.Provider value={{ isPlaying, play, pause, toggle, fadeIn }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
