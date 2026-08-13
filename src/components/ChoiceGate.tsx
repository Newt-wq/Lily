'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from './AudioProvider';
import { TabType } from './Navigation';

interface ChoiceGateProps {
  onSelectChoice: (initialTab: TabType) => void;
}

// Clean Filled Vector Icons
function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-2.12l1.43-1.9c.17-.25.41-.37.69-.37zm-6 0c.28 0 .52.12.69.37L11.12 6H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 15H4v-2h16v2zm0-5H4V9h7v7h2V9h7v5z"/>
    </svg>
  );
}

function HeartLoveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a4 4 0 0 0-4 4c0 2.5 4 6 4 6s4-3.5 4-6a4 4 0 0 0-4-4zm0 20a4 4 0 0 0 4-4c0-2.5-4-6-4-6s-4 3.5-4 6a4 4 0 0 0 4 4zM2 12a4 4 0 0 0 4 4c2.5 0 6-4 6-4s-3.5-4-6-4a4 4 0 0 0-4 4zm20 0a4 4 0 0 0-4-4c-2.5 0-6 4-6 4s3.5 4 6 4a4 4 0 0 0 4-4z"/>
    </svg>
  );
}

export default function ChoiceGate({ onSelectChoice }: ChoiceGateProps) {
  const { fadeIn } = useAudio();

  const handleSelectSurprise = () => {
    fadeIn();
    onSelectChoice('surprise');
  };

  const handleSelectCompanion = () => {
    onSelectChoice('ai');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] px-5 py-12 relative overflow-hidden">
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-100/35 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* Aesthetic Gradient Icon Badge */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 text-white shadow-md border-2 border-white flex items-center justify-center"
        >
          <FlowerIcon />
        </motion.div>

        {/* Overline Tag */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500/90 mb-2"
        >
          Spesial Ulang Tahun
        </motion.span>

        {/* Clean Editorial Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="text-3xl sm:text-4xl text-gray-900 font-semibold tracking-tight mb-2.5"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Selamat datang, Kamilah
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-md mx-auto mb-9"
        >
          Pilih pengalaman yang ingin kamu jelajahi hari ini
        </motion.p>

        {/* Choice Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">

          {/* Surprise Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectSurprise}
            className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.18)] hover:border-rose-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GiftIcon />
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-rose-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                Kejutan Spesial
              </h3>

              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Buket bunga lily, surat cinta hangat, perayaan manis, dan lagu favorit disiapkan khusus untukmu.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-medium text-gray-400 group-hover:text-rose-500 transition-colors">
              <span>Jelajahi kejutan</span>
              <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRightIcon />
              </div>
            </div>
          </motion.button>

          {/* Companion Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.44 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectCompanion}
            className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(244,114,182,0.2)] hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <HeartLoveIcon />
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-pink-500 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                Ruang Teman Setia
              </h3>

              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Obrolan teman virtual Lily, tempat menulis diary, album foto kenangan, dan surat rahasia.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11.5px] font-medium text-gray-400 group-hover:text-pink-500 transition-colors">
              <span>Masuk ruang</span>
              <div className="w-6 h-6 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRightIcon />
              </div>
            </div>
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}
