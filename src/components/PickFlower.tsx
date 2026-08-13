'use client';

import React, { useState } from 'react';
import { flowerMessages } from '../config/content';
import LilySVG from './LilySVG';
import { motion, AnimatePresence } from 'framer-motion';

export default function PickFlower() {
  const [picked, setPicked] = useState<number[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [activeFlowerId, setActiveFlowerId] = useState<number | null>(null);

  const handlePick = (index: number) => {
    if (!picked.includes(index)) {
      setPicked([...picked, index]);
    }
    setActiveMessage(flowerMessages[index]);
    setActiveFlowerId(index);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto mt-16 px-4 py-8 rounded-3xl bg-white/40 border border-lily-pink/20 shadow-md"
    >
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl text-gray-800 font-bold mb-2">
          Petik Bunga untuk Kejutan 🌸
        </h3>
        <p className="text-xs text-gray-500 font-light max-w-xs mx-auto">
          Klik bunga lily di bawah satu-satu untuk membaca alasan mengapa kamu sangat istimewa
        </p>
        {/* Progress indicator */}
        <div className="mt-3 text-xs text-lily-pink-dark font-medium font-serif">
          {picked.length === 6
            ? '✨ Semua bunga sudah kamu petik! 🤍'
            : `${picked.length}/6 Bunga telah dipetik 🌸`}
        </div>
      </div>

      {/* Flower Bed Layout (Arc arrangement) */}
      <div className="flex justify-center items-end gap-3 md:gap-6 min-h-[140px] px-4 mb-8">
        {flowerMessages.map((_, index) => {
          const isPicked = picked.includes(index);
          const isActive = activeFlowerId === index;
          
          // Arc rotation logic (center flowers straight, outer tilted)
          const tiltAngles = [-20, -10, -3, 3, 10, 20];
          const yOffsets = [15, 5, 0, 0, 5, 15];

          return (
            <div
              key={index}
              onClick={() => handlePick(index)}
              className="cursor-pointer relative flex flex-col items-center group"
              style={{
                transform: `translateY(${yOffsets[index]}px) rotate(${tiltAngles[index]}deg)`,
              }}
            >
              {/* Highlight Glow when active */}
              {isActive && (
                <span className="absolute inset-0 bg-lily-pink/40 rounded-full blur-xl scale-120 animate-pulse pointer-events-none" />
              )}

              {/* Flower SVG */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: tiltAngles[index] * 1.5 }}
                className={`transition-all duration-500 ${
                  isPicked ? 'opacity-50 grayscale-[30%]' : 'opacity-100'
                }`}
              >
                {/* Variant mappings */}
                <LilySVG
                  size={index % 2 === 0 ? 55 : 62}
                  variant={isPicked ? 'full' : 'half'}
                  animated={!isPicked}
                />
              </motion.div>

              {/* Tooltip hint on hover */}
              {!isPicked && (
                <span className="absolute -top-6 text-[10px] text-lily-pink-dark bg-white border border-lily-pink/20 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm font-light whitespace-nowrap">
                  Petik aku ✨
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Speech bubble for displayed message */}
      <div className="min-h-[110px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeMessage ? (
            <motion.div
              key={activeFlowerId}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative p-5 rounded-2xl bg-white border border-lily-pink/20 shadow-sm text-center max-w-md mx-auto"
            >
              {/* Arrow */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-t border-l border-lily-pink/20" />
              
              <p className="relative z-10 font-serif text-sm md:text-base text-gray-700 leading-relaxed italic">
                "{activeMessage}"
              </p>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-xs text-gray-400 italic text-center"
            >
              Silakan ketuk salah satu bunga di atas... 🤍
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
