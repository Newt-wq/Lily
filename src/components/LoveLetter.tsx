'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { letterContent } from '../config/content';
import { motion } from 'framer-motion';

export default function LoveLetter() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const startTyping = useCallback(() => {
    setShowEnvelope(false);

    let currentIndex = 0;
    let accumulatedText = '';
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex >= letterContent.length) {
        setIsTyping(false);
        return;
      }

      const char = letterContent[currentIndex];
      accumulatedText += char;
      setDisplayedText(accumulatedText);
      currentIndex++;

      // Natural pause modeling
      let delay = 30;
      if (char === '.' || char === '!' || char === '?') {
        delay = 400;
      } else if (char === ',' || char === '-') {
        delay = 200;
      } else if (char === '\n') {
        delay = 300;
      } else if (char === ' ') {
        delay = 50;
      }

      timeoutId = setTimeout(typeNextChar, delay);
    };

    // Small delay before starting to type
    timeoutId = setTimeout(typeNextChar, 800);

    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-scroll as text grows
  useEffect(() => {
    if (containerRef.current && isTyping) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText, isTyping]);

  const handleSkip = () => {
    setIsTyping(false);
    setDisplayedText(letterContent);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {showEnvelope ? (
        /* ===== ENVELOPE INTRO ===== */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          {/* Envelope Icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8"
          >
            <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="15" width="90" height="60" rx="8" fill="#FFFDF9" stroke="#E5989B" strokeWidth="2" />
              <polygon points="5,15 50,50 95,15" fill="#FCE1E4" stroke="#E5989B" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="50" cy="42" r="8" fill="#E5989B" />
              <path d="M47 42 L49.5 44.5 L53 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <h3 className="font-serif text-xl text-gray-800 font-bold mb-2">
            Ada Surat Untukmu
          </h3>
          <p className="text-sm text-gray-500 font-light mb-8 max-w-[250px]">
            Sebuah surat yang ditulis dengan sepenuh hati, khusus untuk hari spesialmu
          </p>

          <button
            onClick={startTyping}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-lily-pink-dark to-rose-400 text-white font-serif text-sm font-semibold shadow-lg shadow-lily-pink-dark/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            Buka Surat
          </button>
        </motion.div>
      ) : (
        /* ===== LETTER PAPER ===== */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="relative paper-texture border border-lily-pink/25 rounded-3xl shadow-xl overflow-hidden">
            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-lily-pink/25 rounded-tl-xl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-lily-pink/25 rounded-tr-xl" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-lily-pink/25 rounded-bl-xl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-lily-pink/25 rounded-br-xl" />

            {/* Scrollable text area */}
            <div
              ref={containerRef}
              className="px-8 py-10 md:px-12 md:py-14 max-h-[55vh] overflow-y-auto"
            >
              <p className="font-serif text-base md:text-lg text-gray-700 leading-[1.9] whitespace-pre-wrap tracking-wide">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 ml-0.5 bg-lily-pink-dark animate-[pulse_0.7s_infinite] align-middle rounded-full" />
                )}
              </p>
            </div>

            {/* Bottom bar */}
            <div className="px-8 pb-4 flex justify-between items-center border-t border-lily-pink/10 pt-3 bg-white/40">
              <p className="text-[10px] text-gray-400 italic font-serif">
                {isTyping ? 'Sedang menulis...' : 'Selesai 🤍'}
              </p>
              {isTyping && (
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1 text-[11px] text-lily-pink-dark hover:text-rose-600 bg-white/80 hover:bg-white border border-lily-pink/20 px-3 py-1.5 rounded-full transition-all shadow-sm font-medium"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 4 15 12 5 20" />
                    <line x1="19" y1="5" x2="19" y2="19" />
                  </svg>
                  Tampilkan Semua
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
