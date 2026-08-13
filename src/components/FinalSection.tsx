'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number; // percentage left
  size: number;
  color: string;
  delay: number; // seconds
  duration: number; // seconds
}

const colors = ['#FCE1E4', '#FFCAD4', '#D8B4F8', '#BFF6C3', '#EAC435', '#FFFDF9'];

export default function FinalSection() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const triggerConfetti = () => {
    // Generate fresh confetti pieces
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 3,
    }));
    setConfetti(generated);
  };

  useEffect(() => {
    if (isInView) {
      triggerConfetti();
    }
  }, [isInView]);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.0 }}
      className="relative w-full max-w-2xl mx-auto mt-16 mb-24 px-6 py-12 rounded-3xl bg-gradient-to-br from-white/60 to-lily-pink/10 border border-lily-pink/20 shadow-xl overflow-hidden text-center"
    >
      {/* Confetti styles */}
      <style jsx global>{`
        @keyframes confetti-fall-final {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          animation-name: confetti-fall-final;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      {/* Confetti Render */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute confetti-piece pointer-events-none rounded-full"
          style={{
            left: `${c.x}%`,
            top: `-20px`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            opacity: 0,
            zIndex: 10,
          }}
        />
      ))}

      {/* Background soft glowing circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lily-pink/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Sweet content */}
      <div className="relative z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-6"
        >
          💖
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl text-lily-pink-dark font-extrabold mb-4 leading-tight tracking-wide">
          Selamat Ulang Tahun, Sayangku 🤍
        </h1>

        <p className="font-sans text-sm md:text-base text-gray-600 max-w-md mx-auto leading-relaxed font-light mb-8">
          Hari ini adalah milikmu. Semoga setiap harapan, senyuman, dan mimpimu terwujud di usia yang baru ini. Aku akan selalu ada di sini untuk menemanimu melukis kenangan indah lainnya.
        </p>

        {/* Action Button for more confetti */}
        <button
          onClick={triggerConfetti}
          className="px-8 py-3 rounded-full bg-lily-pink-dark hover:bg-rose-500 text-white font-serif text-sm font-semibold tracking-wider hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border-none shadow-md"
        >
          Tabur Kelopak Cinta 🎉🌸
        </button>

        <p className="text-[10px] text-gray-400 mt-8 tracking-widest uppercase font-light">
          Created with Love for Kamilah
        </p>
      </div>
    </motion.section>
  );
}
