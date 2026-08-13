'use client';

import React, { useState, useEffect, useRef } from 'react';
import { aiConfig } from '../config/content';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  animate?: boolean;
}

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
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

// SVG Icons
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function VirtualFriend() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 'greet',
          sender: 'bot',
          text: aiConfig.welcomeMessage,
          animate: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'bot',
            text: 'Lily sedang tidur sebentar... 💤🌸 (API Key belum dikonfigurasi. Minta pacarmu untuk membangunkan Lily ya!)',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const chatHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }],
      }));

      const chat = model.startChat({
        history: [
          {
            role: 'user' as const,
            parts: [{ text: `Instruksi sistem kepribadianmu: ${aiConfig.systemPrompt}\n\nDipahami?` }],
          },
          {
            role: 'model' as const,
            parts: [{ text: 'Baik, aku paham! Aku adalah Lily 🌸, teman virtual Kak Kamilah yang imut dan penyayang. Aku siap menemaninya! 🥰🤍' }],
          },
          ...chatHistory.slice(1),
        ],
      });

      const result = await chat.sendMessage(userText);
      const replyText = result.response.text();

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'bot',
          text: 'Aduh, Lily sedikit bingung tadi... Coba kirim pesan lagi ya sayang! 🥺🌸',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-4 z-50 w-[320px] md:w-[370px] h-[440px] bg-white rounded-3xl border border-lily-pink/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-lily-pink via-lily-pink/80 to-lily-lavender px-4 py-3 flex items-center gap-3 border-b border-lily-pink/20">
              {/* Character Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-white">
                <Image
                  src="/lily-avatar.png"
                  alt="Lily"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-sm text-gray-800 font-bold leading-tight">Lily</h4>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] text-gray-600 font-medium">Teman virtualmu</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-lily-cream/40 to-white/20">
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div key={m.id} className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
                    {/* Bot avatar inline */}
                    {isBot && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-lily-pink/30 flex-shrink-0 mt-1 bg-white">
                        <Image src="/lily-avatar.png" alt="Lily" width={28} height={28} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                          isBot
                            ? 'bg-white border border-lily-pink/15 text-gray-700 rounded-2xl rounded-tl-md'
                            : 'bg-gradient-to-br from-lily-pink-dark to-rose-400 text-white rounded-2xl rounded-tr-md'
                        }`}
                      >
                        {m.animate ? <TypewriterText text={m.text} speed={25} /> : m.text}
                      </div>
                      <span className={`text-[9px] text-gray-400 mt-1 ${isBot ? 'ml-1' : 'mr-1 text-right'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-lily-pink/30 flex-shrink-0 mt-1 bg-white">
                    <Image src="/lily-avatar.png" alt="Lily" width={28} height={28} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-lily-pink/15 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-lily-pink-dark/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-lily-pink-dark/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-lily-pink-dark/60 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-lily-pink/10 bg-white flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Cerita ke Lily..."
                className="flex-1 px-4 py-2.5 text-sm rounded-full border border-lily-pink/20 bg-lily-cream/30 focus:outline-none focus:ring-2 focus:ring-lily-pink/30 text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-lily-pink-dark to-rose-400 hover:from-rose-500 hover:to-rose-400 disabled:from-gray-300 disabled:to-gray-300 text-white flex items-center justify-center transition-all shadow-md"
              >
                <SendIcon />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Character Button — positioned above bottom nav */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-[88px] right-5 z-50 w-16 h-16 rounded-full bg-white border-2 border-lily-pink/40 shadow-xl flex items-center justify-center overflow-hidden hover:border-lily-pink-dark/60 transition-colors group"
      >
        {/* Character Image */}
        <Image
          src="/lily-avatar.png"
          alt="Chat dengan Lily"
          width={56}
          height={56}
          className="w-14 h-14 object-cover rounded-full group-hover:scale-105 transition-transform"
        />

        {/* Online badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
        </span>

        {/* Speech hint on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 10 }}
          whileHover={{ opacity: 1, scale: 1, x: 0 }}
          className="absolute -left-28 top-1/2 -translate-y-1/2 bg-white border border-lily-pink/20 text-gray-600 text-[10px] font-medium px-3 py-1.5 rounded-full shadow-md pointer-events-none whitespace-nowrap hidden md:block"
        >
          Ngobrol sama Lily 🌸
        </motion.div>
      </motion.button>
    </>
  );
}
