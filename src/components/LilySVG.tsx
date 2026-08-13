'use client';

import React from 'react';

interface LilySVGProps {
  className?: string;
  size?: number;
  variant?: 'bud' | 'half' | 'full';
  animated?: boolean;
}

export default function LilySVG({
  className = '',
  size = 120,
  variant = 'full',
  animated = false,
}: LilySVGProps) {
  // Common style for swaying animation
  const swayStyle = animated ? { animation: 'gentle-sway 6s ease-in-out infinite' } : {};

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size, ...swayStyle }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft gradients for realistic and beautiful Lily petals */}
          <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="70%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#FCE1E4" /> {/* lily-pink */}
          </linearGradient>
          <linearGradient id="petalBackGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCE1E4" />
            <stop offset="100%" stopColor="#EAE6F8" /> {/* lily-lavender */}
          </linearGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B5C4B1" />
            <stop offset="100%" stopColor="#8DA399" />
          </linearGradient>
          <linearGradient id="stamenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EAC435" /> {/* lily-gold */}
            <stop offset="100%" stopColor="#C49A0F" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Stem (Tangkai) */}
        <path
          d="M100 110 C98 140, 94 170, 90 200"
          stroke="url(#stemGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Leaves (Daun) */}
        <path
          d="M97 145 C120 145, 140 135, 150 120 C130 130, 110 135, 96 142"
          fill="url(#stemGrad)"
        />
        <path
          d="M93 165 C70 165, 50 155, 40 140 C60 150, 80 155, 94 162"
          fill="url(#stemGrad)"
        />

        {variant === 'bud' && (
          // Bud (Kuncup Lily)
          <g filter="url(#softShadow)">
            {/* Center bud petal */}
            <path
              d="M100 60 C80 80, 85 115, 100 130 C115 115, 120 80, 100 60 Z"
              fill="url(#petalGrad)"
              stroke="#FCE1E4"
              strokeWidth="1.5"
            />
            {/* Left wrap petal */}
            <path
              d="M100 60 C75 85, 80 120, 96 128 C85 115, 85 95, 100 60 Z"
              fill="url(#petalBackGrad)"
              opacity="0.9"
            />
            {/* Right wrap petal */}
            <path
              d="M100 60 C125 85, 120 120, 104 128 C115 115, 115 95, 100 60 Z"
              fill="url(#petalBackGrad)"
              opacity="0.9"
            />
          </g>
        )}

        {variant === 'half' && (
          // Half Bloom (Mekar Setengah)
          <g filter="url(#softShadow)">
            {/* Stamens */}
            <path d="M100 110 C100 95, 95 85, 85 70" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="85" cy="70" r="3" fill="url(#stamenGrad)" />
            
            <path d="M100 110 C100 95, 100 80, 100 65" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="65" r="3" fill="url(#stamenGrad)" />
            
            <path d="M100 110 C100 95, 105 85, 115 70" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
            <circle cx="115" cy="70" r="3" fill="url(#stamenGrad)" />

            {/* Petals */}
            {/* Back Petals */}
            <path d="M100 60 C70 80, 75 115, 100 125 Z" fill="url(#petalBackGrad)" />
            
            {/* Left petal */}
            <path
              d="M100 120 C70 110, 60 85, 65 70 C75 85, 85 105, 100 120 Z"
              fill="url(#petalGrad)"
              stroke="#FFF"
              strokeWidth="0.5"
            />
            {/* Right petal */}
            <path
              d="M100 120 C130 110, 140 85, 135 70 C125 85, 115 105, 100 120 Z"
              fill="url(#petalGrad)"
              stroke="#FFF"
              strokeWidth="0.5"
            />
            {/* Main Center Petal */}
            <path
              d="M100 55 C85 80, 85 110, 100 125 C115 110, 115 80, 100 55 Z"
              fill="url(#petalGrad)"
              stroke="#FCE1E4"
              strokeWidth="1"
            />
          </g>
        )}

        {variant === 'full' && (
          // Full Bloom (Mekar Penuh)
          <g filter="url(#softShadow)">
            {/* Stamens (Benang Sari) */}
            <g opacity="0.9">
              <path d="M100 110 C95 100, 85 95, 75 90" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
              <rect x="71" y="87" width="8" height="4" rx="1.5" transform="rotate(-20 71 87)" fill="url(#stamenGrad)" />

              <path d="M100 110 C98 98, 92 88, 88 75" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
              <rect x="85" y="72" width="8" height="4" rx="1.5" transform="rotate(-45 85 72)" fill="url(#stamenGrad)" />

              <path d="M100 110 C100 95, 100 80, 100 68" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
              <rect x="96" y="66" width="8" height="4" rx="1.5" fill="url(#stamenGrad)" />

              <path d="M100 110 C102 98, 108 88, 112 75" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
              <rect x="109" y="72" width="8" height="4" rx="1.5" transform="rotate(45 109 72)" fill="url(#stamenGrad)" />

              <path d="M100 110 C105 100, 115 95, 125 90" stroke="#8DA399" strokeWidth="2" strokeLinecap="round" />
              <rect x="121" y="87" width="8" height="4" rx="1.5" transform="rotate(20 121 87)" fill="url(#stamenGrad)" />
            </g>

            {/* Back petals (Kelopak belakang) */}
            <path d="M100 115 C55 90, 50 65, 55 55 C65 65, 85 90, 100 115 Z" fill="url(#petalBackGrad)" />
            <path d="M100 115 C145 90, 150 65, 145 55 C135 65, 115 90, 100 115 Z" fill="url(#petalBackGrad)" />
            <path d="M100 115 C100 60, 90 40, 100 30 C110 40, 100 60, 100 115 Z" fill="url(#petalBackGrad)" />

            {/* Front Petals (Kelopak depan, lebih terang) */}
            {/* Bottom-left petal */}
            <path
              d="M100 115 C75 115, 45 125, 35 110 C50 100, 75 105, 100 115 Z"
              fill="url(#petalGrad)"
              stroke="#FFF"
              strokeWidth="0.5"
            />
            {/* Bottom-right petal */}
            <path
              d="M100 115 C125 115, 155 125, 165 110 C150 100, 125 105, 100 115 Z"
              fill="url(#petalGrad)"
              stroke="#FFF"
              strokeWidth="0.5"
            />
            {/* Center Front Petal */}
            <path
              d="M100 120 C80 90, 75 60, 100 45 C125 60, 120 90, 100 120 Z"
              fill="url(#petalGrad)"
              stroke="#FCE1E4"
              strokeWidth="1.5"
            />
            
            {/* Petal detail lines */}
            <path d="M100 100 C93 85, 90 70, 100 52" stroke="#FCE1E4" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <path d="M100 110 C96 112, 85 110, 70 106" stroke="#FFF" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
            <path d="M100 110 C104 112, 115 110, 130 106" stroke="#FFF" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
}
