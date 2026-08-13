'use client';

import React, { useState, useEffect } from 'react';
import { openWhenLetters } from '../config/content';
import OpenWhenEnvelope from './OpenWhenEnvelope';
import { motion } from 'framer-motion';

// Aesthetic Duotone Vector Icons
function CloudIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.9"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l6-6-2.5 6-3.5 3.5z"/>
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM2 21h20v-2H2v2z"/>
    </svg>
  );
}

function getLetterIconConfig(id: string) {
  switch (id) {
    case 'sedih':
      return { icon: <CloudIcon />, bg: 'bg-sky-100/80 text-sky-500 border-sky-200' };
    case 'kangen':
      return { icon: <HeartIcon />, bg: 'bg-rose-100/80 text-rose-500 border-rose-200' };
    case 'semangat':
      return { icon: <SparklesIcon />, bg: 'bg-amber-100/80 text-amber-500 border-amber-200' };
    case 'bahagia':
      return { icon: <SmileIcon />, bg: 'bg-emerald-100/80 text-emerald-500 border-emerald-200' };
    case 'galau':
      return { icon: <CompassIcon />, bg: 'bg-indigo-100/80 text-indigo-500 border-indigo-200' };
    case 'gabut':
      return { icon: <CoffeeIcon />, bg: 'bg-orange-100/80 text-orange-500 border-orange-200' };
    default:
      return { icon: <HeartIcon />, bg: 'bg-rose-100/80 text-rose-500 border-rose-200' };
  }
}

export default function OpenWhen() {
  const [activeLetter, setActiveLetter] = useState<typeof openWhenLetters[number] | null>(null);
  const [openedStatus, setOpenedStatus] = useState<Record<string, boolean>>({});

  const refreshStatus = async () => {
    // Try API first
    try {
      const res = await fetch('/api/letters');
      if (res.ok) {
        const data = await res.json();
        setOpenedStatus(data);
        // Cache locally
        Object.entries(data).forEach(([id, opened]) => {
          if (opened) localStorage.setItem(`openwhen_opened_${id}`, 'true');
        });
        return;
      }
    } catch { /* API unavailable */ }

    // Fallback: localStorage
    if (typeof window !== 'undefined') {
      const status: Record<string, boolean> = {};
      openWhenLetters.forEach((letter) => {
        status[letter.id] = localStorage.getItem(`openwhen_opened_${letter.id}`) === 'true';
      });
      setOpenedStatus(status);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [activeLetter]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 block mb-0.5">
          Kotak Surat Buka Saat...
        </span>
        <h2 className="text-2xl sm:text-3xl text-gray-900 font-semibold tracking-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Pilih Amplop Suratmu
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
          Pilihlah salah satu amplop surat di bawah ini sesuai dengan apa yang sedang kamu rasakan saat ini.
        </p>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {openWhenLetters.map((letter) => {
          const isOpened = openedStatus[letter.id];
          const iconConfig = getLetterIconConfig(letter.id);

          return (
            <motion.div
              key={letter.id}
              onClick={() => setActiveLetter(letter)}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative p-5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.18)] hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[160px] text-center overflow-hidden"
            >
              {/* Envelope Top Accent Bar */}
              <div className="w-10 h-1 rounded-full bg-rose-300/80 mb-3 group-hover:bg-rose-500 transition-colors" />

              {/* Styled Pastel Icon Badge */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-xs border transition-transform duration-300 group-hover:scale-110 ${iconConfig.bg}`}>
                {iconConfig.icon}
              </div>

              {/* Title */}
              <h4 className="text-xs sm:text-sm text-gray-900 font-semibold leading-snug mb-3 group-hover:text-rose-600 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                {letter.label}
              </h4>

              {/* Status Badge */}
              <span className={`text-[10px] px-3 py-0.5 rounded-full font-medium transition-colors ${
                isOpened
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-rose-50 text-rose-600 border border-rose-150 font-semibold'
              }`}>
                {isOpened ? 'Sudah dibaca' : 'Buka surat →'}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Envelope Modal Overlay */}
      {activeLetter && (
        <OpenWhenEnvelope
          letter={activeLetter}
          onClose={() => setActiveLetter(null)}
        />
      )}
    </div>
  );
}
