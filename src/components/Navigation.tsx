'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type TabType = 'surprise' | 'openwhen' | 'gallery' | 'diary' | 'ai';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

function SurpriseIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#B5838D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function EnvelopeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#B5838D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="22,4 12,13 2,4" />
    </svg>
  );
}

function GalleryFolderIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#B5838D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function DiaryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#B5838D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="16" y2="7" />
      <line x1="9" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function SparklesAIIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#B5838D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 5.4L20 10l-5.6 2.6L12 18l-2.4-5.4L4 10l5.6-2.6z" />
      <path d="M19 15l1.2 2.7L23 19l-2.8 1.3L19 23l-1.2-2.7L15 19l2.8-1.3z" />
    </svg>
  );
}

export default function Navigation({ activeTab, onChangeTab }: NavigationProps) {
  const tabs = [
    { id: 'surprise' as TabType, label: 'Kejutan', Icon: SurpriseIcon },
    { id: 'openwhen' as TabType, label: 'Buka Saat', Icon: EnvelopeIcon },
    { id: 'gallery' as TabType, label: 'Galeri', Icon: GalleryFolderIcon },
    { id: 'diary' as TabType, label: 'Diary', Icon: DiaryIcon },
    { id: 'ai' as TabType, label: 'Lily AI', Icon: SparklesAIIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom)] bg-white/90 backdrop-blur-xl border-t border-lily-pink/15 shadow-[0_-4px_30px_rgba(229,152,155,0.12)]">
      <div className="flex w-full max-w-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute -top-2.5 w-10 h-10 rounded-full bg-gradient-to-br from-lily-pink-dark to-rose-400 shadow-lg shadow-lily-pink-dark/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex items-center justify-center w-5 h-5 transition-transform duration-300 ${isActive ? '-translate-y-1.5' : ''}`}>
                <tab.Icon active={isActive} />
              </div>

              {/* Label */}
              <span className={`relative z-10 text-[9px] sm:text-[10px] font-medium tracking-wide transition-all duration-300 ${
                isActive ? 'text-lily-pink-dark font-semibold -translate-y-0.5' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
