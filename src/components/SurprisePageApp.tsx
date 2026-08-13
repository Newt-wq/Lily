'use client';

import React, { useState } from 'react';
import CongratsBanner from './CongratsBanner';
import LoveLetter from './LoveLetter';
import PhotoGallery from './PhotoGallery';
import PickFlower from './PickFlower';
import LoveJar from './LoveJar';
import FinalSection from './FinalSection';
import MusicButton from './MusicButton';
import { motion, AnimatePresence } from 'framer-motion';

type SurpriseSubPage = 'congrats' | 'letter' | 'gallery' | 'flowers' | 'jar' | 'final';

const surprisePages: { id: SurpriseSubPage; label: string }[] = [
  { id: 'congrats', label: 'Selamat' },
  { id: 'letter', label: 'Surat' },
  { id: 'gallery', label: 'Momen' },
  { id: 'flowers', label: 'Bunga' },
  { id: 'jar', label: 'Toples' },
  { id: 'final', label: 'Akhir' },
];

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

interface SurprisePageAppProps {
  onSwitchToCompanion: () => void;
  onBackToChoice: () => void;
}

export default function SurprisePageApp({ onSwitchToCompanion, onBackToChoice }: SurprisePageAppProps) {
  const [currentPage, setCurrentPage] = useState<SurpriseSubPage>('congrats');

  const currentIndex = surprisePages.findIndex(p => p.id === currentPage);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < surprisePages.length - 1;

  const goNext = () => {
    if (canNext) setCurrentPage(surprisePages[currentIndex + 1].id);
  };
  const goPrev = () => {
    if (canPrev) setCurrentPage(surprisePages[currentIndex - 1].id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'congrats': return <CongratsBanner />;
      case 'letter': return <LoveLetter />;
      case 'gallery': return <PhotoGallery />;
      case 'flowers': return <PickFlower />;
      case 'jar': return <LoveJar />;
      case 'final': return <FinalSection />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-lily-cream">
      {/* Persist Music Control */}
      <MusicButton />

      {/* Top Header Bar */}
      <header className="z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50 transition-all"
          >
            <ArrowLeftIcon /> Kembali
          </button>

          <div className="h-4 w-px bg-gray-200" />

          <h1 className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
            Kejutan Spesial
          </h1>
        </div>

        <button
          onClick={onSwitchToCompanion}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all"
        >
          <HeartIcon /> Ruang Teman
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-120px)]">
        {/* Sub-Navigation Bar for Surprise Pages */}
        <div className="z-20 bg-lily-cream/90 backdrop-blur-md border-b border-lily-pink/10 px-4 pt-3 pb-2.5 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              className={`p-2 rounded-full transition-all ${canPrev ? 'text-lily-pink-dark hover:bg-lily-pink/20' : 'text-gray-300 cursor-default'}`}
            >
              <ChevronLeft />
            </button>

            <div className="text-center">
              <h2 className="font-serif text-base text-gray-800 font-bold">
                {surprisePages[currentIndex].label}
              </h2>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                {currentIndex + 1} / {surprisePages.length}
              </p>
            </div>

            <button
              onClick={goNext}
              disabled={!canNext}
              className={`p-2 rounded-full transition-all ${canNext ? 'text-lily-pink-dark hover:bg-lily-pink/20' : 'text-gray-300 cursor-default'}`}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {surprisePages.map((page, i) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 h-2 bg-lily-pink-dark'
                    : 'w-2 h-2 bg-lily-pink/40 hover:bg-lily-pink-dark/50'
                }`}
                title={page.label}
              />
            ))}
          </div>
        </div>

        {/* Surprise Page Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full max-w-2xl"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Hint */}
        <div className="flex-shrink-0 flex justify-center items-center gap-4 px-6 py-2.5 border-t border-lily-pink/10 bg-lily-cream/60">
          {canPrev && (
            <button
              onClick={goPrev}
              className="flex items-center gap-1 text-lily-pink-dark text-xs font-medium hover:underline transition-all"
            >
              <ChevronLeft /> Sebelumnya
            </button>
          )}
          {canPrev && canNext && <span className="text-gray-300">|</span>}
          {canNext && (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-lily-pink-dark text-xs font-medium hover:underline transition-all"
            >
              Selanjutnya <ChevronRight />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
