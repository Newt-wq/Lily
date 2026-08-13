'use client';

import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../hooks/useDiary';
import { motion } from 'framer-motion';

interface DiaryEditorProps {
  entry?: DiaryEntry | null; // If provided: EDIT mode, else: CREATE mode
  onSave: (title: string, content: string, mood?: string, date?: string) => void;
  onUpdate: (id: string, updates: { title: string; content: string; mood?: string; date: string }) => void;
  onClose: () => void;
}

const moodOptions = ['Tenang', 'Bahagia', 'Semangat', 'Sedih', 'Refleksi'];

// Clean SVG Vector Icons
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function DiaryEditor({ entry, onSave, onUpdate, onClose }: DiaryEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setDate(entry.date);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);

      const draft = localStorage.getItem('kamilah-diary-draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setTitle(parsed.title || '');
          setContent(parsed.content || '');
          setMood(parsed.mood || undefined);
        } catch {
          // ignore
        }
      }
    }
  }, [entry]);

  // Draft Autosave
  useEffect(() => {
    if (entry) return;
    const timer = setInterval(() => {
      if (content.trim()) {
        localStorage.setItem('kamilah-diary-draft', JSON.stringify({ title, content, mood }));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [title, content, mood, entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    if (entry) {
      onUpdate(entry.id, { title, content, mood, date });
    } else {
      onSave(title, content, mood, date);
      localStorage.removeItem('kamilah-diary-draft');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg bg-white border border-gray-200/80 p-6 md:p-7 rounded-3xl shadow-xl"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 block mb-0.5">
              {entry ? 'Sunting Catatan' : 'Catatan Baru'}
            </span>
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              {entry ? 'Edit Catatan Harian' : 'Tulis Jurnal Baru'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Judul Catatan
              </label>
              <input
                type="text"
                placeholder="Judul (opsional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Tanggal Jurnal
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 transition-all"
              />
            </div>
          </div>

          {/* Mood Selector Pills */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Suasana Hati (Mood)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {moodOptions.map(m => {
                const isSelected = m === mood;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(isSelected ? undefined : m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-rose-200 hover:bg-rose-50/50'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
              Isi Catatan
            </label>
            <textarea
              required
              rows={7}
              placeholder="Tuliskan pikiran, perasaan, atau cerita harimu di sini..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 placeholder:text-gray-400 font-sans leading-relaxed transition-all"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 italic">
              {!entry && content.trim() ? 'Draft tersimpan otomatis' : ''}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckIcon />
                <span>{entry ? 'Simpan Perubahan' : 'Tambah Catatan'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
