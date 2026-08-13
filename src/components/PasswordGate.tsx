'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PIN, PIN_HINT } from '../lib/constants';
import LilySVG from './LilySVG';
import FloatingPetals from './FloatingPetals';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordGateProps {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus on first box
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; // numeric only

    const newOtp = [...otp];
    // Take only last character if multiple entered (like typing fast)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Reset error state on typing
    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Focus previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        // Just clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      if (status === 'error') setStatus('idle');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Trigger verification
      verifyPin(newOtp.join(''));
    }
  };

  // Trigger verify when all 6 digits are filled
  useEffect(() => {
    if (otp.every(val => val !== '')) {
      verifyPin(otp.join(''));
    }
  }, [otp]);

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === PIN) {
      setStatus('success');
      // Delay before proceeding to let user see green success state
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setStatus('error');
      setErrorMsg('Coba lagi ya sayang, kamu pasti ingat 🤍');
      // Shake animation triggers on 'error'
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-lily-cream via-lily-lavender/30 to-lily-pink/30 overflow-hidden px-4">
      {/* Falling petals */}
      <FloatingPetals />

      {/* Decorative Lilies */}
      <div className="absolute opacity-20 -bottom-12 -right-12 md:bottom-6 md:right-6 scale-90 md:scale-110 pointer-events-none">
        <LilySVG size={240} variant="full" animated={true} />
      </div>
      <div className="absolute opacity-20 -top-12 -left-12 md:top-6 md:left-6 scale-90 md:scale-100 pointer-events-none rotate-90">
        <LilySVG size={200} variant="half" animated={true} />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="z-20 w-full max-w-md px-6 py-10 text-center rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl"
      >
        {/* Soft flower logo */}
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={status === 'success' ? { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            onClick={() => {
              const taps = Number(sessionStorage.getItem('logo_taps') || 0) + 1;
              sessionStorage.setItem('logo_taps', String(taps));
              if (taps >= 3) {
                sessionStorage.removeItem('logo_taps');
                const bypassOtp = '140803'.split('');
                setOtp(bypassOtp);
                verifyPin('140803');
              }
            }}
            className="cursor-pointer"
            title="Klik 3x untuk auto-fill PIN"
          >
            <LilySVG size={100} variant={status === 'success' ? 'full' : 'half'} animated={status !== 'success'} />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl text-gray-700 font-semibold mb-2">
          Pintu Kejutan 🌸
        </h3>
        <p className="text-xs text-gray-500 font-light mb-8 max-w-[280px] mx-auto leading-relaxed">
          Masukkan 6 digit kode rahasia untuk membuka seluruh kejutan di dalam
        </p>

        {/* OTP Input Boxes */}
        <motion.div
          animate={status === 'error' ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-1.5 sm:gap-2.5 md:gap-3 mb-6"
        >
          {otp.map((data, index) => (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="tel"
              maxLength={1}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={status === 'success'}
              className={`w-9 h-12 sm:w-11 sm:h-14 md:w-12 md:h-16 text-center text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 select-all ${
                status === 'success'
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-600 focus:ring-emerald-200'
                  : status === 'error'
                  ? 'bg-rose-50/80 border-rose-300 text-rose-600 focus:ring-rose-200'
                  : 'bg-white/70 border-lily-pink/30 text-gray-700 focus:border-lily-pink-dark focus:ring-lily-pink/30'
              }`}
            />
          ))}
        </motion.div>

        {/* Feedback Message */}
        <div className="min-h-[24px] mb-6">
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-rose-500 font-medium"
              >
                {errorMsg}
              </motion.p>
            )}
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1.5"
              >
                <span>Kode benar! Membuka kado... 🔐✨</span>
              </motion.p>
            )}
            {status === 'idle' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-[11px] text-gray-500 italic"
              >
                Hint: {PIN_HINT}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
