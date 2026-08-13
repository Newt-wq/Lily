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
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: true,
  };
}
