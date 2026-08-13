'use client';

import React, { useEffect, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import FloatingPetals from './FloatingPetals';
import LilySVG from './LilySVG';
import { motion } from 'framer-motion';

interface CountdownPageProps {
  onComplete: () => void;
}

export default function CountdownPage({ onComplete }: CountdownPageProps) {
  const { days, hours, minutes, seconds, isFinished } = useCountdown();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only show dev skip button in local development environment
    if (process.env.NODE_ENV === 'development') {
      setIsDev(true);
    }
  }, []);

  // When timer finishes, transition
  useEffect(() => {
    if (isFinished) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  // Dev bypass function
  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bypass_countdown', 'true');
      onComplete();
    }
  };

  // Double check so that if isFinished is true we don't flash countdown
  if (isFinished) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-lily-cream via-lily-lavender/20 to-lily-pink/20 overflow-hidden px-4">
      {/* Falling lily petals */}
      <FloatingPetals />

      {/* Decorative background Lily */}
      <div className="absolute opacity-20 md:opacity-30 -bottom-10 -left-10 md:bottom-10 md:left-10 scale-75 md:scale-110 pointer-events-none">
        <LilySVG size={280} variant="full" animated={true} />
      </div>

      <div className="absolute opacity-10 md:opacity-20 -top-10 -right-10 md:top-10 md:right-10 scale-75 md:scale-100 pointer-events-none rotate-180">
        <LilySVG size={220} variant="half" animated={true} />
      </div>

      {/* Content wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="z-20 text-center max-w-lg px-6 py-12 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl"
      >
        {/* Tiny icon */}
        <div className="mb-6 flex justify-center">
          <LilySVG size={80} variant="half" animated={true} />
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl md:text-3xl text-gray-700 font-semibold mb-2">
          Siti Kamilah 🌸
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-light mb-8 italic">
          Menghitung hari menuju hari spesialmu 🤍
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto">
          {/* Days */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/60 border border-lily-pink/20 shadow-sm min-w-[70px]">
            <span className="font-serif text-3xl md:text-4xl text-lily-pink-dark font-bold leading-none">
              {String(days).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-wider">
              Hari
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/60 border border-lily-pink/20 shadow-sm min-w-[70px]">
            <span className="font-serif text-3xl md:text-4xl text-lily-pink-dark font-bold leading-none">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-wider">
              Jam
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/60 border border-lily-pink/20 shadow-sm min-w-[70px]">
            <span className="font-serif text-3xl md:text-4xl text-lily-pink-dark font-bold leading-none">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-wider">
              Menit
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/60 border border-lily-pink/20 shadow-sm min-w-[70px]">
            <span className="font-serif text-3xl md:text-4xl text-lily-pink-dark font-bold leading-none">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-wider">
              Detik
            </span>
          </div>
        </div>

        {/* Visible Bypass Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="mt-8 px-6 py-2.5 rounded-full bg-rose-400 hover:bg-rose-500 text-white font-medium text-xs md:text-sm shadow-lg shadow-rose-200/50 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          <span>Punya Kode Rahasia? Masuk Disini</span>
          <span>🔑</span>
        </motion.button>
      </motion.div>

      {/* Hidden skip trigger for testing on prod or dev skip button */}
      {isDev ? (
        <button
          onClick={handleSkip}
          className="absolute bottom-4 left-4 z-50 text-[10px] text-gray-400/50 hover:text-lily-pink-dark/80 bg-white/20 hover:bg-white/60 px-3 py-1.5 rounded-full transition-colors duration-200 border border-gray-300/20"
        >
          [DEV] Lewati Hitung Mundur ⚡
        </button>
      ) : (
        /* Hidden bypass on production: click bottom-left 5 times */
        <div
          onClick={() => {
            const clicks = Number(sessionStorage.getItem('dev_clicks') || 0) + 1;
            sessionStorage.setItem('dev_clicks', String(clicks));
            if (clicks >= 5) {
              handleSkip();
            }
          }}
          className="absolute bottom-0 left-0 w-16 h-16 z-50 cursor-default opacity-0"
          title="Secret bypass"
        />
      )}
    </div>
  );
}
