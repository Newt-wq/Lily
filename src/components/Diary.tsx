'use client';

import React, { useState, useMemo } from 'react';
import { useDiary, DiaryEntry as EntryType } from '../hooks/useDiary';
import DiaryEntry from './DiaryEntry';
import DiaryEditor from './DiaryEditor';
import { motion, AnimatePresence } from 'framer-motion';

// Clean SVG Vector Icons
function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function Diary() {
  const { entries, isLoaded, addEntry, updateEntry, deleteEntry, exportDiary } = useDiary();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EntryType | null>(null);
  const [viewingEntry, setViewingEntry] = useState<EntryType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || (e.mood && e.mood.toLowerCase().includes(q))
    );
  }, [entries, searchQuery]);

  const handleEdit = (entry: EntryType) => {
    setEditingEntry(entry);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditingEntry(null);
    setEditorOpen(false);
  };

  const handleSave = (title: string, content: string, mood?: string, date?: string) => {
    addEntry(title, content, mood, date);
  };

  const handleUpdate = (id: string, updates: { title: string; content: string; mood?: string; date: string }) => {
    updateEntry(id, updates);
  };

  if (!isLoaded && entries.length === 0) {
    return (
      <div className="w-full min-h-[55vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="relative flex items-center justify-center mb-3.5">
          <div className="w-10 h-10 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-rose-400 text-xs">
            📖
          </div>
        </div>
        <p className="text-sm text-gray-700 font-serif font-medium tracking-wide">
          Membuka Catatan Harian...
        </p>
        <p className="text-[11px] text-gray-400 font-light mt-1">
          Menyiapkan kenangan indah untukmu ✨
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-200/70">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 block mb-0.5">
            Buku Harian Pribadi
          </span>
          <h2 className="text-2xl sm:text-3xl text-gray-900 font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Diary Kamilah
          </h2>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              onClick={exportDiary}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              title="Unduh semua catatan"
            >
              <DownloadIcon />
              <span className="hidden sm:inline">Ekspor</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingEntry(null);
              setEditorOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusIcon />
            <span>Tulis Catatan</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Stats */}
      {entries.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Cari catatan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-rose-300 text-gray-700 transition-all shadow-2xs"
            />
          </div>

          <span className="text-xs text-gray-400 font-medium">
            {filteredEntries.length} Catatan
          </span>
        </div>
      )}

      {/* Main List / Empty State */}
      <div>
        {entries.length === 0 ? (
          /* Full-Width Natural Empty State */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-8 sm:p-14 text-center my-4 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 shadow-2xs text-stone-700 flex items-center justify-center mb-4">
              <BookOpenIcon />
            </div>

            <h3 className="text-xl sm:text-2xl text-stone-900 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Belum Ada Catatan Harian
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed mb-6">
              Mulai simpan kenangan, pikiran, atau cerita harianmu di tempat ini. Catatanmu tersimpan rapi dan aman.
            </p>

            <button
              onClick={() => {
                setEditingEntry(null);
                setEditorOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-2"
            >
              <PlusIcon />
              <span>Tulis Catatan Pertama</span>
            </button>
          </motion.div>
        ) : filteredEntries.length === 0 ? (
          /* Search Empty State */
          <div className="py-12 text-center text-gray-400 text-xs">
            Tidak ditemukan catatan dengan kata kunci &quot;{searchQuery}&quot;.
          </div>
        ) : (
          /* Entries Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredEntries.map(entry => (
                <DiaryEntry
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={deleteEntry}
                  onView={setViewingEntry}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {editorOpen && (
          <DiaryEditor
            entry={editingEntry}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onClose={handleCloseEditor}
          />
        )}
      </AnimatePresence>

      {/* ── VIEW FULL ENTRY MODAL (Buku Bacaan / Book Reader) ── */}
      <AnimatePresence>
        {viewingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setViewingEntry(null)} />

            {/* Book Outer Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl bg-[#FDFBF7] border-2 border-[#EADFCB] rounded-[24px] md:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),inset_16px_0_24px_-12px_rgba(120,90,40,0.12)] max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Decorative Book Ribbon / Bookmark Accent */}
              <div className="absolute top-0 right-12 w-6 h-14 bg-rose-400/90 rounded-b-md shadow-md z-20 pointer-events-none flex items-end justify-center pb-2">
                <div className="w-2 h-2 bg-rose-600/60 rounded-full" />
              </div>

              {/* Book Spine Edge Bar (Left Border Accent) */}
              <div className="absolute top-0 bottom-0 left-0 w-3 md:w-4 bg-gradient-to-r from-[#D8C7AA] via-[#EAE1D0] to-transparent z-20 pointer-events-none" />

              {/* Book Header Bar */}
              <div className="relative z-10 pt-6 px-6 md:pt-8 md:px-10 flex items-center justify-between border-b border-[#E8DFD1]/80 pb-4">
                <div className="flex items-center gap-2 text-xs text-amber-900/70 font-serif">
                  <span className="font-semibold tracking-widest uppercase text-[10px] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/70">
                    📖 Jurnal Harian
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <CalendarIcon />
                    {(() => {
                      try {
                        return new Date(viewingEntry.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                      } catch {
                        return viewingEntry.date;
                      }
                    })()}
                  </span>
                  {viewingEntry.mood && (
                    <>
                      <span>•</span>
                      <span className="italic text-stone-600">Mood: {viewingEntry.mood}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setViewingEntry(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors flex items-center justify-center shadow-xs flex-shrink-0 z-30"
                  title="Tutup Buku"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Book Page Reading Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 md:px-12 py-6 md:py-8 max-w-full">
                {/* Book Title */}
                <h3 className="text-2xl md:text-3xl text-stone-900 font-bold tracking-normal leading-snug mb-6 pb-4 border-b border-dashed border-[#E3D7C3] break-words" style={{ fontFamily: 'Georgia, serif' }}>
                  {viewingEntry.title}
                </h3>

                {/* Book Page Body Text */}
                <div className="text-base md:text-lg text-stone-800 leading-[2.1] font-serif whitespace-pre-wrap break-words overflow-hidden text-justify tracking-normal">
                  {viewingEntry.content}
                </div>
              </div>

              {/* Book Footer Bar */}
              <div className="relative z-10 px-6 py-4 md:px-10 bg-[#F7F2E8] border-t border-[#E8DFD1]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const target = viewingEntry;
                      setViewingEntry(null);
                      deleteEntry(target.id);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-100/60 transition-colors flex items-center gap-1.5"
                  >
                    <TrashIcon />
                    <span>Hapus Catatan</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const target = viewingEntry;
                      setViewingEntry(null);
                      handleEdit(target);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 transition-colors shadow-2xs flex items-center gap-1.5 border border-amber-200/70"
                  >
                    <EditIcon />
                    <span>Sunting</span>
                  </button>
                  <button
                    onClick={() => setViewingEntry(null)}
                    className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-2xs"
                  >
                    Tutup Buku
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
