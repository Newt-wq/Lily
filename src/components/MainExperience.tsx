'use client';

import React, { useState } from 'react';
import Navigation, { TabType } from './Navigation';
import CongratsBanner from './CongratsBanner';
import LoveLetter from './LoveLetter';
import PhotoGallery from './PhotoGallery';
import PickFlower from './PickFlower';
import LoveJar from './LoveJar';
import FinalSection from './FinalSection';
import OpenWhen from './OpenWhen';
import Diary from './Diary';
import GalleryPage from './GalleryPage';
import VirtualFriendPage from './VirtualFriendPage';
import MusicButton from './MusicButton';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Sub-pages within Surprise tab
type SurprisePage = 'congrats' | 'letter' | 'gallery' | 'flowers' | 'jar' | 'final';

const surprisePages: { id: SurprisePage; label: string }[] = [
  { id: 'congrats', label: 'Selamat' },
  { id: 'letter', label: 'Surat' },
  { id: 'gallery', label: 'Galeri Quick' },
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

export default function MainExperience({ initialTab = 'surprise' }: { initialTab?: TabType }) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [surprisePage, setSurprisePage] = useState<SurprisePage>('congrats');

  const currentPageIndex = surprisePages.findIndex(p => p.id === surprisePage);
  const canPrev = currentPageIndex > 0;
  const canNext = currentPageIndex < surprisePages.length - 1;

  const goNext = () => {
    if (canNext) setSurprisePage(surprisePages[currentPageIndex + 1].id);
  };
  const goPrev = () => {
    if (canPrev) setSurprisePage(surprisePages[currentPageIndex - 1].id);
  };

  const renderSurprisePage = () => {
    switch (surprisePage) {
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



      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20">
        <AnimatePresence mode="wait">
          {/* ===== SURPRISE TAB ===== */}
          {activeTab === 'surprise' && (
            <motion.div
              key="surprise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-[calc(100vh-80px)]"
            >
              {/* Surprise Sub-Navigation — compact top bar */}
              <div className="z-30 bg-lily-cream/90 backdrop-blur-md border-b border-lily-pink/10 px-4 pt-3 pb-2.5 flex-shrink-0">
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
                      {surprisePages[currentPageIndex].label}
                    </h2>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                      {currentPageIndex + 1} / {surprisePages.length}
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
                      onClick={() => setSurprisePage(page.id)}
                      className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                        i === currentPageIndex
                          ? 'w-8 h-2 bg-lily-pink-dark'
                          : 'w-2 h-2 bg-lily-pink/40 hover:bg-lily-pink-dark/50'
                      }`}
                      title={page.label}
                    />
                  ))}
                </div>
              </div>

              {/* Page Content */}
              <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={surprisePage}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full max-w-2xl"
                  >
                    {renderSurprisePage()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Compact bottom nav hint */}
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
            </motion.div>
          )}

          {/* ===== OPEN WHEN TAB ===== */}
          {activeTab === 'openwhen' && (
            <motion.div
              key="openwhen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OpenWhen />
            </motion.div>
          )}

          {/* ===== DEDICATED GALERI ALBUM TAB ===== */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GalleryPage />
            </motion.div>
          )}

          {/* ===== DIARY TAB ===== */}
          {activeTab === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Diary />
            </motion.div>
          )}

          {/* ===== DEDICATED LILY AI TAB ===== */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VirtualFriendPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
