'use client';

import React, { useState } from 'react';
import { DiaryEntry as EntryType } from '../hooks/useDiary';
import { motion } from 'framer-motion';

interface DiaryEntryProps {
  entry: EntryType;
  onEdit: (entry: EntryType) => void;
  onDelete: (id: string) => void;
  onView: (entry: EntryType) => void;
}

// Clean SVG Icons
function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

export default function DiaryEntry({ entry, onEdit, onDelete, onView }: DiaryEntryProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(entry.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry);
  };

  return (
    <motion.div
      layout
      onClick={() => onView(entry)}
      className="group bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header row: Date & Mood badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <CalendarIcon />
            <span>{formatDate(entry.date)}</span>
          </div>

          {entry.mood && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-500 border border-rose-150">
              {entry.mood}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-gray-900 group-hover:text-rose-600 transition-colors mb-2 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
          {entry.title}
        </h4>

        {/* Content Snippet */}
        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
          {entry.content}
        </p>
      </div>

      {/* Footer & Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 font-medium group-hover:text-rose-400 transition-colors">
          Baca selengkapnya →
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Edit Catatan"
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition-colors ${
              confirmDelete
                ? 'bg-rose-50 text-rose-600 font-medium text-[11px] px-2'
                : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Hapus Catatan"
          >
            {confirmDelete ? 'Yakin hapus?' : <TrashIcon />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
