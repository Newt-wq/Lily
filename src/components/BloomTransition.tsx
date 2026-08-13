'use client';

import React, { useEffect, useState } from 'react';
import LilySVG from './LilySVG';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from './AudioProvider';

interface BloomTransitionProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
}

export default function BloomTransition({ onComplete }: BloomTransitionProps) {
  const { fadeIn } = useAudio();
  const [stage, setStage] = useState<'fade-in' | 'bloom' | 'burst' | 'done'>('fade-in');
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Start music fade in
    fadeIn();

    // Sequence timing
    // 1. Initial fade to white/cream
    const bloomTimeout = setTimeout(() => {
      setStage('bloom');
    }, 400);

    // 2. Lily blooms (stays for 1.8s)
    const burstTimeout = setTimeout(() => {
      setStage('burst');
      // Generate burst particles
      const newParticles = Array.from({ length: 35 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 250; // pixels to travel
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotate: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.8,
          delay: Math.random() * 0.2,
        };
      });
      setParticles(newParticles);
    }, 2200);

    // 3. Complete and reveal page
    const doneTimeout = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(bloomTimeout);
      clearTimeout(burstTimeout);
      clearTimeout(doneTimeout);
    };
  }, [fadeIn, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lily-cream overflow-hidden">
      <AnimatePresence>
        {stage === 'bloom' && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(5px)' }}
            transition={{
              duration: 1.6,
              ease: [0.34, 1.56, 0.64, 1], // bouncy elastic feel
            }}
            className="flex flex-col items-center justify-center"
          >
            {/* SVG morphs from bud to full lily (we can use variant="full" and animate its scale) */}
            <LilySVG size={220} variant="full" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 font-serif text-sm italic text-lily-pink-dark tracking-widest"
            >
              Membuka dunia kejutan... 🌸
            </motion.p>
          </motion.div>
        )}

        {stage === 'burst' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p) => (
              <motion.svg
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.5 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  rotate: p.rotate,
                  scale: p.scale,
                }}
                transition={{
                  duration: 1.0,
                  ease: 'easeOut',
                  delay: p.delay,
                }}
                className="absolute w-8 h-8"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Petal particle shape */}
                <path
                  d="M15 0 C25 10, 30 20, 20 28 C15 30, 10 30, 5 25 C0 20, 5 10, 15 0 Z"
                  fill={p.id % 2 === 0 ? '#FFFDF9' : '#FCE1E4'}
                  stroke="#FAD4D8"
                  strokeWidth="0.5"
                />
              </motion.svg>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
