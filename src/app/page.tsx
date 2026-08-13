'use client';

import React, { useState, useEffect } from 'react';
import CountdownPage from '@/components/CountdownPage';
import PasswordGate from '@/components/PasswordGate';
import BloomTransition from '@/components/BloomTransition';
import ChoiceGate from '@/components/ChoiceGate';
import SurprisePageApp from '@/components/SurprisePageApp';
import CompanionPageApp, { CompanionTab } from '@/components/CompanionPageApp';
import { TabType } from '@/components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'countdown' | 'password' | 'transition' | 'choice' | 'surprise_app' | 'companion_app';

export default function Home() {
  const [state, setState] = useState<AppState>('countdown');
  const [initialCompanionTab, setInitialCompanionTab] = useState<CompanionTab>('ai');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChoiceSelected = (tab: TabType) => {
    if (tab === 'surprise') {
      setState('surprise_app');
    } else {
      setInitialCompanionTab('ai');
      setState('companion_app');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-lily-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lily-pink-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      <AnimatePresence mode="wait">
        {state === 'countdown' && (
          <motion.div
            key="countdown"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <CountdownPage onComplete={() => setState('password')} />
          </motion.div>
        )}

        {state === 'password' && (
          <motion.div
            key="password"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <PasswordGate onSuccess={() => setState('transition')} />
          </motion.div>
        )}

        {state === 'transition' && (
          <motion.div key="transition" className="w-full">
            <BloomTransition onComplete={() => setState('choice')} />
          </motion.div>
        )}

        {state === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ChoiceGate onSelectChoice={handleChoiceSelected} />
          </motion.div>
        )}

        {state === 'surprise_app' && (
          <motion.div
            key="surprise_app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <SurprisePageApp
              onSwitchToCompanion={() => setState('companion_app')}
              onBackToChoice={() => setState('choice')}
            />
          </motion.div>
        )}

        {state === 'companion_app' && (
          <motion.div
            key="companion_app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <CompanionPageApp
              onSwitchToSurprise={() => setState('surprise_app')}
              onBackToChoice={() => setState('choice')}
              initialTab={initialCompanionTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
