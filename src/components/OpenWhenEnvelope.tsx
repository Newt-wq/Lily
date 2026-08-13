'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  letter: {
    id: string;
    label: string;
    color: string;
    icon: string;
    effect: string;
    message: string;
  };
  onClose: () => void;
}

// Clean Vector Icons
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function OpenWhenEnvelope({ letter, onClose }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`openwhen_opened_${letter.id}`, 'true');
    }
    // Persist to API
    fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letterId: letter.id }),
    }).catch(() => { /* stays in localStorage */ });
  }, [letter.id]);

  const handleOpen = () => {
    if (isSealBroken) return;
    setIsSealBroken(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ✉️ CLOSED ENVELOPE CARD */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleOpen}
              className="relative w-full max-w-sm min-h-[290px] bg-white rounded-3xl shadow-xl border border-gray-200/90 overflow-hidden cursor-pointer flex flex-col justify-between items-center p-6 text-center group"
            >
              {/* Envelope Flap Polygon Background */}
              <div
                className="absolute top-0 left-0 right-0 h-36 border-b border-gray-200/60"
                style={{
                  backgroundColor: '#FAF8F5',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  zIndex: 1,
                }}
              />

              {/* Wax Seal Area */}
              <div className="relative z-10 mt-8 flex flex-col items-center gap-2">
                <motion.div
                  animate={isSealBroken ? { scale: [1, 1.2, 0], rotate: [0, 10, -10, 0] } : { scale: [1, 1.05, 1] }}
                  transition={isSealBroken ? { duration: 0.4 } : { duration: 2.5, repeat: Infinity }}
                  className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-rose-600"
                >
                  <HeartIcon />
                </motion.div>

                {!isSealBroken && (
                  <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs select-none">
                    Ketuk untuk membuka
                  </span>
                )}
              </div>

              {/* Title Section (Positioned neatly at bottom without overlap) */}
              <div className="relative z-10 w-full mt-6 pt-4 border-t border-gray-100 flex flex-col items-center">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-rose-500 mb-1">
                  Surat Spesial
                </span>
                <h3 className="text-base sm:text-lg text-gray-900 font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {letter.label}
                </h3>
              </div>
            </motion.div>
          ) : (
            /* 📜 OPENED LETTER READ MODAL */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-stone-200/90 p-6 sm:p-8 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.14)] max-h-[85vh] flex flex-col overflow-hidden text-left"
            >
              {/* Paper Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300" />

              {/* Letter Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-stone-200/70">
                <div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 block mb-0.5">
                    Surat Spesial Untuk Kamilah
                  </span>
                  <h3 className="text-xl sm:text-2xl text-stone-900 font-semibold tracking-tight leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                    {letter.label}
                  </h3>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 border border-stone-200/60 shadow-2xs transition-colors flex items-center justify-center flex-shrink-0"
                  title="Tutup"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Scrollable Letter Body */}
              <div className="flex-1 overflow-y-auto pr-2 text-base text-stone-800 leading-[1.85] font-normal whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {letter.message}
              </div>

              {/* Letter Actions Footer */}
              <div className="mt-6 pt-3.5 border-t border-stone-200/70 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors shadow-2xs flex items-center gap-2"
                >
                  <MailIcon />
                  <span>Tutup & Simpan Surat</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
