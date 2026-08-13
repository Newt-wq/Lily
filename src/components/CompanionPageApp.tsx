'use client';

import React, { useState } from 'react';
import VirtualFriendPage from './VirtualFriendPage';
import Diary from './Diary';
import GalleryPage from './GalleryPage';
import OpenWhen from './OpenWhen';
import { motion, AnimatePresence } from 'framer-motion';

export type CompanionTab = 'ai' | 'diary' | 'gallery' | 'openwhen';

interface CompanionPageAppProps {
  onSwitchToSurprise: () => void;
  onBackToChoice: () => void;
  initialTab?: CompanionTab;
}

export default function CompanionPageApp({ onSwitchToSurprise, onBackToChoice, initialTab = 'ai' }: CompanionPageAppProps) {
  const [activeTab, setActiveTab] = useState<CompanionTab>(initialTab);

  const tabs: { id: CompanionTab; label: string; iconPath: string }[] = [
    {
      id: 'ai',
      label: 'Lily',
      iconPath: 'M12 2l2.4 5.4L20 10l-5.6 2.6L12 18l-2.4-5.4L4 10l5.6-2.6z',
    },
    {
      id: 'diary',
      label: 'Diary',
      iconPath: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    },
    {
      id: 'gallery',
      label: 'Album',
      iconPath: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
    },
    {
      id: 'openwhen',
      label: 'Surat',
      iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF9F7]">

      {/* Top Header Bar — clean and minimal */}
      <header className="z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={onBackToChoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs hover:bg-gray-50 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>

          <div className="h-4 w-px bg-gray-200" />

          <h1 className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
            Ruang Teman Setia
          </h1>
        </div>

        {/* Switch to Surprise */}
        <button
          onClick={onSwitchToSurprise}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          Lihat Kejutan
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 w-full pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <VirtualFriendPage />
            </motion.div>
          )}
          {activeTab === 'diary' && (
            <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Diary />
            </motion.div>
          )}
          {activeTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <GalleryPage />
            </motion.div>
          )}
          {activeTab === 'openwhen' && (
            <motion.div key="openwhen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <OpenWhen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation — clean pill style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
        <div className="flex w-full max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all"
              >
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="companion-active-dot"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full bg-rose-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={isActive ? '#E5989B' : '#B0B0B0'}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-colors"
                >
                  <path d={tab.iconPath} />
                  {/* Extra paths for specific icons */}
                  {tab.id === 'gallery' && <circle cx="12" cy="13" r="3" stroke={isActive ? '#E5989B' : '#B0B0B0'} strokeWidth="1.8" />}
                </svg>
                <span className={`text-[10px] transition-colors ${isActive ? 'text-rose-500 font-semibold' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
