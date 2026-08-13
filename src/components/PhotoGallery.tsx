'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GraduationPhoto {
  id: number;
  src: string;
  caption: string;
  tag: string;
}

const graduationPhotos: GraduationPhoto[] = [
  {
    id: 1,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.41.jpeg',
    caption: 'Cantik dan penuh senyuman indah 🌸✨',
    tag: 'Happy Moments',
  },
  {
    id: 2,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.42.jpeg',
    caption: 'Momen berharga yang penuh dengan kehangatan 🤍',
    tag: 'Beautiful Smile',
  },
  {
    id: 3,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.42 (1).jpeg',
    caption: 'Setiap sudut senyumanmu selalu menenangkan 🌿',
    tag: 'Precious Day',
  },
  {
    id: 4,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.42 (2).jpeg',
    caption: 'Kecantikan yang bersinar di setiap langkah ✨',
    tag: 'Bright Day',
  },
  {
    id: 5,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.43.jpeg',
    caption: 'Selalu ada kebahagiaan saat melihat tawamu 🌸',
    tag: 'Lovely Memory',
  },
  {
    id: 6,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.41.43 (1).jpeg',
    caption: 'Semoga hari-harimu selalu dipenuhi keindahan 🎓🌿',
    tag: 'Sweet Moments',
  },
  {
    id: 7,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.42.10.jpeg',
    caption: 'Hari istimewa Siti Kamilah, S.Psi.! 🎓🤍',
    tag: 'Graduation Day',
  },
  {
    id: 8,
    src: '/Kamila/WhatsApp Image 2026-08-13 at 23.42.11.jpeg',
    caption: 'Langkah awal menuju masa depan yang cerah dan indah ✨',
    tag: 'Future Ahead',
  },
];

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % graduationPhotos.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + graduationPhotos.length) % graduationPhotos.length);
  }, []);

  // Auto-slide effect every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext]);

  const current = graduationPhotos[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Title without any subtitle description */}
      <div className="text-center mb-3">
        <h3 className="font-serif text-xl md:text-2xl text-gray-800 font-bold">
          Momen Kelulusan S.Psi. 🎓
        </h3>
      </div>

      {/* Main Interactive Photo Frame */}
      <div
        onClick={goNext}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-gray-900 group cursor-pointer"
      >
        {/* Photo Animation with smooth crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.caption}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top Tag Badge */}
        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium tracking-wide">
          {current.tag}
        </div>

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium">
          {currentIndex + 1} / {graduationPhotos.length}
        </div>

        {/* Prev / Next Click Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all opacity-80 group-hover:opacity-100"
          aria-label="Previous Photo"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all opacity-80 group-hover:opacity-100"
          aria-label="Next Photo"
        >
          <ChevronRight />
        </button>

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Caption Overlay */}
        <div className="absolute bottom-4 left-5 right-5 z-20 text-white">
          <p className="font-serif text-sm sm:text-base font-semibold leading-relaxed drop-shadow-md">
            {current.caption}
          </p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="mt-3.5 flex items-center gap-2">
        {graduationPhotos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-7 h-2 bg-lily-pink-dark'
                : 'w-2 h-2 bg-lily-pink/30 hover:bg-lily-pink-dark/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
