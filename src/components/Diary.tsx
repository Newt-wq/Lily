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

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 mt-3 font-light">Membuka catatan harian...</p>
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

      {/* ── VIEW FULL ENTRY MODAL (Journal Reader) ── */}
      <AnimatePresence>
        {viewingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setViewingEntry(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-xl bg-[#FAF8F5] border border-stone-200/90 p-6 sm:p-9 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.14)] max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Paper Decorative Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300" />

              {/* Modal Top Metadata Bar */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1.5">
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
                      <span className="text-stone-300">•</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-100/70 text-rose-600 border border-rose-200/60">
                        {viewingEntry.mood}
                      </span>
                    </>
                  )}

                  <span className="text-stone-300">•</span>
                  <span className="text-[11px] text-stone-400">
                    {Math.max(1, Math.ceil(viewingEntry.content.split(/\s+/).length / 200))} mnt baca
                  </span>
                </div>

                <button
                  onClick={() => setViewingEntry(null)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 border border-stone-200/60 shadow-2xs transition-colors flex items-center justify-center flex-shrink-0"
                  title="Tutup"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Entry Title */}
              <h3 className="text-2xl sm:text-3xl text-stone-900 font-semibold tracking-tight leading-snug mb-5 pb-4 border-b border-stone-200/70" style={{ fontFamily: 'Georgia, serif' }}>
                {viewingEntry.title}
              </h3>

              {/* Modal Scrollable Reader Content */}
              <div className="flex-1 overflow-y-auto pr-2 text-base text-stone-800 leading-[1.85] font-normal whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {viewingEntry.content}
              </div>

              {/* Modal Action Toolbar */}
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-between">
                <button
                  onClick={() => {
                    const target = viewingEntry;
                    setViewingEntry(null);
                    deleteEntry(target.id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <TrashIcon />
                  <span>Hapus</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingEntry(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 bg-white border border-stone-200/80 hover:bg-stone-50 transition-colors shadow-2xs"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      const target = viewingEntry;
                      setViewingEntry(null);
                      handleEdit(target);
                    }}
                    className="px-4.5 py-2 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <EditIcon />
                    <span>Sunting</span>
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
