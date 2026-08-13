'use client';

import React, { useEffect, useState } from 'react';
import { congratsText } from '../config/content';
import { motion } from 'framer-motion';
import LilySVG from './LilySVG';

export default function CongratsBanner() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: Math.random() * 3,
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full p-8 md:p-12 rounded-3xl bg-white/60 border border-lily-gold/25 shadow-lg overflow-hidden text-center"
      >
        {/* Sparkle dots */}
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            animate={{ scale: [0.3, 1, 0.3], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
            className="absolute w-1.5 h-1.5 bg-lily-gold rounded-full"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          />
        ))}

        {/* Corner frames */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-lily-gold/30 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-lily-gold/30 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-lily-gold/30 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-lily-gold/30 rounded-br-xl" />

        {/* Lily flower decoration */}
        <div className="flex justify-center mb-4">
          <LilySVG size={70} variant="full" animated />
        </div>

        {/* Graduation icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EAC435" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
          </svg>
        </motion.div>

        <h2 className="font-serif text-2xl md:text-3xl text-gray-800 font-bold mb-4 tracking-wide leading-snug">
          Congratulations, Kamilah!
        </h2>

        <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed max-w-md mx-auto font-light whitespace-pre-line">
          {congratsText}
        </p>

        {/* Badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lily-gold/15 border border-lily-gold/30 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#EAC435" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-lily-gold font-serif text-xs font-semibold tracking-wider uppercase">
            S.Psi. Graduation Day
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#EAC435" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
