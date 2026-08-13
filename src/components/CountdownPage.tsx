'use client';

import React, { useEffect } from 'react';
import PasswordGate from './PasswordGate';

interface CountdownPageProps {
  onComplete: () => void;
}

export default function CountdownPage({ onComplete }: CountdownPageProps) {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return <PasswordGate onSuccess={onComplete} />;
}
