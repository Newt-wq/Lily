'use client';

import React, { useState, useEffect, useRef } from 'react';
import { aiConfig } from '../config/content';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  animate?: boolean;
}

function TypewriterText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsDone(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsDone(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isDone && <span className="animate-pulse ml-0.5 inline-block text-rose-400 font-bold">|</span>}
    </span>
  );
}

const quickPrompts = [
  { text: 'Hibur aku dong', label: 'Hibur aku' },
  { text: 'Kutipan semangat hari ini', label: 'Kutipan' },
  { text: 'Cerita tentang pacarku', label: 'Cerita' },
  { text: 'Aku butuh teman cerita', label: 'Teman cerita' },
];

export default function VirtualFriendPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Clear invalid cached keys from localStorage
    const storedKey = localStorage.getItem('gemini_api_key') || '';
    if (storedKey.startsWith('AIzaSyAQ.')) {
      localStorage.removeItem('gemini_api_key');
    }

    const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    const validStored = localStorage.getItem('gemini_api_key') || '';
    const keyToUse = (validStored || envKey).trim();
    setActiveKey(keyToUse);

    // Initial typing animation effect
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([{
        id: 'greet',
        sender: 'bot',
        text: aiConfig.welcomeMessage,
        animate: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    localStorage.setItem('gemini_api_key', trimmed);
    setActiveKey(trimmed);
    setShowKeyModal(false);
  };

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;
    const userText = textToSend.trim();
    setInputVal('');
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = { id: Math.random().toString(36).slice(2, 9), sender: 'user', text: userText, timestamp: ts };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const keyToUse = (activeKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();

    if (!keyToUse) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Math.random().toString(36).slice(2, 9),
          sender: 'bot',
          text: 'Lily belum memiliki API Key untuk menjawab. Klik tombol 🔑 di kanan atas header untuk memasukkan Gemini API Key kamu ya! 🌸',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 600);
      return;
    }

    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
    ];

    let responseText = '';
    let errorLog = '';

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(keyToUse);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: aiConfig.systemPrompt,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          },
        });

        const promptText = `User: ${userText}`;
        const result = await model.generateContent(promptText);
        const res = result.response.text();
        if (res && res.trim()) {
          responseText = res.trim();
          break;
        }
      } catch (err: any) {
        console.error(`Gemini model ${modelName} error:`, err);
        errorLog = err?.message || String(err);
      }
    }

    setIsTyping(false);

    if (responseText) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2, 9),
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).slice(2, 9),
        sender: 'bot',
        text: `Maaf, Lily belum bisa menjawab saat ini... 🥺\n\nDetail Error: ${errorLog}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageText(inputVal);
  };

  return (
    <div className="w-full h-[calc(100vh-110px)] flex">

      {/* ═══ LEFT: Character Panel (md screens and up) ═══ */}
      <div className="hidden md:flex w-[320px] lg:w-[420px] xl:w-[480px] 2xl:w-[540px] flex-col items-center justify-between py-6 px-4 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-[420px] lg:h-[420px] bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

        {/* Speech Bubble */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 my-2 max-w-[260px] lg:max-w-[320px] xl:max-w-[360px]"
        >
          <div className="bg-white/95 backdrop-blur-xs border border-rose-100 shadow-md rounded-2xl px-5 py-3.5">
            <p className="text-[13px] lg:text-[14.5px] text-gray-700 leading-relaxed text-center" style={{ fontFamily: 'Georgia, serif' }}>
              <TypewriterText text="Aku siap mendengarkan cerita Kamilah hari ini 🌸" speed={35} />
            </p>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-b border-r border-rose-100" />
        </motion.div>

        {/* Character Avatar - Scaled to fill height alongside chat box */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 w-full max-h-[64vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lily-avatar.png"
            alt="Lily AI"
            className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[390px] xl:max-w-[460px] 2xl:max-w-[520px] max-h-[58vh] h-auto object-contain pointer-events-none select-none drop-shadow-sm transition-all duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
          <div className="w-52 md:w-64 lg:w-80 xl:w-96 h-4 bg-gray-300/20 rounded-[100%] blur-md -mt-4" />
        </motion.div>

        {/* Status Badge */}
        <div className="relative z-10 mt-2 flex items-center gap-2.5 px-5 py-2 bg-white/90 backdrop-blur-xs border border-rose-100 rounded-full shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>Lily AI</span>
          <span className="text-[10px] text-gray-400 border-l border-gray-200 pl-2">Online</span>
        </div>
      </div>

      {/* ═══ RIGHT: Full Chat Area ═══ */}
      <div className="flex-1 flex flex-col min-w-0 p-2 sm:p-3 lg:p-4">
        <div className="flex-1 flex flex-col bg-white rounded-[24px] shadow-[0_2px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100">

          {/* Chat Header */}
          <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-rose-100 bg-rose-50 flex-shrink-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lily-avatar.png" alt="Lily" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Lily</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-gray-400">Selalu ada untukmu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4" style={{ backgroundColor: '#FDFCFB' }}>
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-100 flex-shrink-0 mt-0.5 bg-rose-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/lily-avatar.png" alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[80%] sm:max-w-[72%]`}>
                      <div
                        className={`px-4 py-2.5 text-[14px] leading-[1.65] whitespace-pre-wrap ${
                          isBot
                            ? 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'
                            : 'bg-rose-400 text-white rounded-2xl rounded-tr-sm'
                        }`}
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      >
                        {m.animate ? <TypewriterText text={m.text} speed={8} /> : m.text}
                      </div>
                      <span className={`text-[10px] text-gray-300 mt-1 block ${isBot ? 'pl-1' : 'pr-1 text-right'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-100 flex-shrink-0 mt-0.5 bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/lily-avatar.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 sm:px-6 py-2.5 border-t border-gray-50 overflow-x-auto flex gap-2 no-scrollbar bg-white">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessageText(prompt.text)}
                disabled={isTyping}
                className="whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] bg-gray-50 border border-gray-100 text-gray-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50 active:scale-[0.97] transition-all flex-shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="px-4 sm:px-5 py-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 px-4 py-2.5 text-[16px] sm:text-[14px] rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-300 focus:bg-white text-gray-700 placeholder:text-gray-400 transition-all"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-rose-400 hover:bg-rose-500 disabled:bg-gray-200 text-white flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </form>
        </div>
      </div>

      {/* ── API KEY MODAL ── */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
            >
              <h4 className="text-base font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Pengaturan Gemini API Key 🔑
              </h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed font-light">
                Tempel Gemini API Key kamu di bawah ini (Key tersimpan aman di browser kamu):
              </p>

              <input
                type="text"
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
                placeholder="Tempel API Key di sini (misal: AQ.Ab8RN...)"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-300 text-gray-700 mb-4 font-mono"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => saveApiKey(customKey)}
                  disabled={!customKey.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-rose-400 hover:bg-rose-500 disabled:bg-gray-200 text-white text-xs font-semibold transition-colors"
                >
                  Simpan & Gunakan
                </button>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
