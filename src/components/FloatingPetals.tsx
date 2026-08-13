'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number; // percentage
  top: number; // percentage
  size: number; // px
  delay: number; // seconds
  duration: number; // seconds
  spinSpeed: number; // seconds
  opacity: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals only on client-side to prevent SSR hydration errors
    const generated: Petal[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 20, // start above screen
      size: 10 + Math.random() * 15,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      spinSpeed: 5 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <svg
          key={petal.id}
          className="absolute petal-particle"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}px`,
            width: petal.size,
            height: petal.size,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            '--petal-opacity': petal.opacity,
            opacity: 0,
          } as React.CSSProperties}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Petal shape: curvy oval */}
          <path
            d="M15 0 C25 10, 30 20, 20 28 C15 30, 10 30, 5 25 C0 20, 5 10, 15 0 Z"
            fill="#FFF1F2" // very soft pink
            stroke="#FCE1E4" // soft pink border
            strokeWidth="0.5"
          />
          {/* Center line detail */}
          <path
            d="M15 0 C15 10, 12 18, 12 25"
            stroke="#FAD4D8"
            strokeWidth="0.3"
          />
        </svg>
      ))}
    </div>
  );
}
