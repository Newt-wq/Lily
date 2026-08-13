'use client';

import React, { useState } from 'react';
import { jarReasons } from '../config/content';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveJar() {
  const [currentReason, setCurrentReason] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const drawReason = () => {
    setIsShaking(true);
    // Shake animation finishes in 500ms
    setTimeout(() => {
      setIsShaking(false);
      const randomIndex = Math.floor(Math.random() * jarReasons.length);
      setCurrentReason(jarReasons[randomIndex]);
      setIsOpen(true);
    }, 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full max-w-md mx-auto mt-16 px-4 text-center"
    >
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-gray-800 font-bold mb-2">
          Jar Permintaan Sayang 🏺
        </h3>
        <p className="text-xs text-gray-500 font-light max-w-xs mx-auto">
          Klik jar di bawah untuk mengambil gulungan pesan berisi alasan-alasan mengapa aku sayang kamu
        </p>
      </div>

      {/* Jar Container */}
      <div className="relative flex justify-center items-center min-h-[220px] mb-6">
        <motion.div
          onClick={drawReason}
          className="cursor-pointer relative z-20 group"
          animate={isShaking ? {
            rotate: [-3, 3, -3, 3, -2, 2, 0],
            x: [-4, 4, -4, 4, -2, 2, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Jar SVG */}
          <svg
            width="140"
            height="180"
            viewBox="0 0 140 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md"
          >
            <defs>
              {/* Glass gradients */}
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#FCE1E4" stopOpacity="0.2" /> {/* pink tint */}
                <stop offset="100%" stopColor="#EAE6F8" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4A373" />
                <stop offset="100%" stopColor="#A98467" />
              </linearGradient>
            </defs>

            {/* Lid (Tutup Kayu) */}
            <rect x="35" y="10" width="70" height="15" rx="5" fill="url(#lidGrad)" />
            <rect x="42" y="22" width="56" height="8" rx="2" fill="#8B5E3C" />

            {/* Jar Neck */}
            <path d="M45 30 H95 V45 H45 Z" fill="url(#glassGrad)" stroke="#E5989B" strokeWidth="1" />

            {/* Jar Body */}
            <path
              d="M45 45 C35 55, 20 70, 20 100 C20 145, 30 170, 70 170 C110 170, 120 145, 120 100 C120 70, 105 55, 95 45 Z"
              fill="url(#glassGrad)"
              stroke="#E5989B"
              strokeWidth="1.5"
            />

            {/* Glass shine highlights */}
            <path d="M32 65 C28 85, 28 115, 34 135" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <path d="M108 65 C112 85, 112 115, 106 135" stroke="#E5989B" strokeWidth="1" opacity="0.3" />

            {/* Colorful rolled papers inside (static) */}
            <g opacity="0.8">
              {/* Paper 1 - pink */}
              <rect x="45" y="130" width="12" height="25" rx="3" transform="rotate(-30 45 130)" fill="#FFB5A7" stroke="#FF9F8C" strokeWidth="0.5" />
              {/* Paper 2 - lavender */}
              <rect x="75" y="135" width="12" height="25" rx="3" transform="rotate(20 75 135)" fill="#D8B4F8" stroke="#C594F3" strokeWidth="0.5" />
              {/* Paper 3 - yellow */}
              <rect x="58" y="125" width="12" height="25" rx="3" transform="rotate(5 58 125)" fill="#FFE5EC" stroke="#FFC2D1" strokeWidth="0.5" />
              {/* Paper 4 - mint */}
              <rect x="85" y="120" width="12" height="25" rx="3" transform="rotate(-45 85 120)" fill="#BFF6C3" stroke="#9DF1A3" strokeWidth="0.5" />
              {/* Paper 5 - gold */}
              <rect x="62" y="145" width="22" height="10" rx="3" transform="rotate(-15 62 145)" fill="#FDE2E4" stroke="#FFCAD4" strokeWidth="0.5" />
            </g>

            {/* Label Tag on the Jar */}
            <rect x="42" y="75" width="56" height="30" rx="4" fill="#FFFDF9" stroke="#E5989B" strokeWidth="1" />
            <line x1="47" y1="80" x2="93" y2="80" stroke="#FAD4D8" strokeWidth="1" />
            <text x="70" y="94" fontFamily="var(--font-serif)" fontSize="10" fontWeight="bold" fill="#B5838D" textAnchor="middle">For Kamilah</text>
            <line x1="47" y1="99" x2="93" y2="99" stroke="#FAD4D8" strokeWidth="1" />
          </svg>

          {/* Sparkle click badge */}
          <span className="absolute -top-4 -right-2 text-xs bg-lily-gold text-white font-serif px-2 py-0.5 rounded-full shadow-sm scale-90 group-hover:scale-100 transition-transform">
            Buka! ✨
          </span>
        </motion.div>

        {/* Paper flight out animation */}
        <AnimatePresence>
          {isOpen && currentReason && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
              
              <motion.div
                initial={{ scale: 0.1, y: 100, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.1, y: 100, rotate: 45, opacity: 0 }}
                transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                className="relative z-10 w-full max-w-sm paper-texture border-2 border-lily-pink/40 p-6 md:p-8 rounded-3xl shadow-2xl text-center"
              >
                {/* Paper tie ribbon graphic */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lily-pink-dark text-white text-xs px-3 py-1 rounded-full font-serif shadow-md border border-white">
                  💝 Pesan Cinta
                </div>

                <div className="mt-4 min-h-[100px] flex items-center justify-center">
                  <p className="font-serif text-base md:text-lg text-gray-700 leading-relaxed italic">
                    "{currentReason}"
                  </p>
                </div>

                {/* Close action */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 font-sans text-xs text-white bg-lily-pink-dark hover:bg-rose-500 border-none px-6 py-2 rounded-full transition-all shadow-md font-semibold"
                >
                  Gulung Kembali 💌
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
