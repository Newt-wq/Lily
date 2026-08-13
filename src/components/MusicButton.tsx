'use client';

import React from 'react';
import { useAudio } from './AudioProvider';

export default function MusicButton() {
  const { isPlaying, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-lily-pink/30 shadow-lg text-lily-pink-dark hover:bg-white hover:scale-105 transition-all duration-300 group"
      aria-label={isPlaying ? 'Pause Musik' : 'Putar Musik'}
    >
      {/* Icon */}
      {isPlaying ? (
        <svg
          className="w-5 h-5 animate-[spin_6s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Note icon with a slash indicating muted */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3 M3 3l18 18"
          />
        </svg>
      )}

      {/* Floating note indicators when playing */}
      {isPlaying && (
        <span className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lily-pink-dark opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-lily-pink"></span>
        </span>
      )}
    </button>
  );
}
