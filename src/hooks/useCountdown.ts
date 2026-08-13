import { useState, useEffect } from 'react';
import { TARGET_DATE } from '../lib/constants';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export function useCountdown(): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  useEffect(() => {
    // Check local storage for debug bypass
    const checkBypass = () => {
      if (typeof window !== 'undefined') {
        const bypass = localStorage.getItem('bypass_countdown') === 'true';
        if (bypass) {
          setTimeLeft(prev => ({ ...prev, isFinished: true }));
          return true;
        }
      }
      return false;
    };

    if (checkBypass()) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = TARGET_DATE.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isFinished: true,
        });
        return true;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isFinished: false,
      });
      return false;
    };

    // Run once immediately
    const finished = calculateTime();
    if (finished) return;

    const interval = setInterval(() => {
      const isDone = calculateTime();
      if (isDone) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
