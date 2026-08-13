'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PhotoItem {
  id: string;
  src: string;
  caption: string;
  addedAt: number;
}

export interface AlbumItem {
  id: string;
  title: string;
  description: string;
  coverSrc: string;
  createdAt: number;
  photos: PhotoItem[];
}

const STORAGE_KEY = 'birthday-mila-albums-v3';

// Clean SVG Vector Icons
function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
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

function MaximizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Modals state
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState('');

  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoPreview, setNewPhotoPreview] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editPhotoCaption, setEditPhotoCaption] = useState('');

  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  const albumCoverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load albums: API first, fallback to localStorage
  useEffect(() => {
    const loadAlbums = async () => {
      const hasBeenInitialized = localStorage.getItem('birthday-mila-albums-initialized') === 'true';

      try {
        const res = await fetch('/api/albums');
        if (res.ok) {
          const data = await res.json();
          // If DB has albums OR if user already initialized before (even if 0 albums left)
          if (data.length > 0 || hasBeenInitialized) {
            setAlbums(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem('birthday-mila-albums-initialized', 'true');
            setIsLoaded(true);
            return;
          }
        }
      } catch { /* API unavailable */ }

      // Fallback: localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed = JSON.parse(stored) as AlbumItem[];
          setAlbums(parsed);
          localStorage.setItem('birthday-mila-albums-initialized', 'true');
          setIsLoaded(true);
          return;
        }
      } catch { /* ignore */ }

      // Very first run: default albums
      if (!hasBeenInitialized) {
        const defaults: AlbumItem[] = [
          {
            id: 'album-memories',
            title: 'Momen Spesial Kamilah',
            description: 'Kumpulan foto kenangan manis dan perayaan indah',
            coverSrc: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
            createdAt: Date.now(),
            photos: [
              { id: 'p1', src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', caption: 'Momen bahagia bersama penuh senyum', addedAt: Date.now() },
              { id: 'p2', src: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop', caption: 'Keindahan di setiap sudut perayaan', addedAt: Date.now() + 1 },
            ],
          },
          {
            id: 'album-celebration',
            title: 'Album Kejutan & Senyuman',
            description: 'Foto-foto penuh kehangatan dan kenangan manis',
            coverSrc: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
            createdAt: Date.now() + 2,
            photos: [
              { id: 'p3', src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop', caption: 'Hari yang indah penuh kebahagiaan', addedAt: Date.now() + 2 },
            ],
          },
        ];
        setAlbums(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        localStorage.setItem('birthday-mila-albums-initialized', 'true');
      }
      setIsLoaded(true);
    };

    loadAlbums();
  }, []);

  // Sync to localStorage whenever albums state changes (even if empty)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
      localStorage.setItem('birthday-mila-albums-initialized', 'true');
    }
  }, [albums, isLoaded]);

  // CRUD: Cover photo select
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewAlbumCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  // CRUD: Create Album
  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) return;
    const newAlbum: AlbumItem = {
      id: `album-${Date.now()}`,
      title: newAlbumTitle.trim(),
      description: newAlbumDesc.trim() || 'Album kenangan manis',
      coverSrc: newAlbumCover || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      createdAt: Date.now(),
      photos: [],
    };

    // Optimistic update
    setAlbums(prev => [newAlbum, ...prev]);
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setNewAlbumCover('');
    setShowCreateAlbumModal(false);

    // Persist to API
    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newAlbum.title, description: newAlbum.description, coverSrc: newAlbum.coverSrc }),
      });
      if (res.ok) {
        const created = await res.json();
        // Replace temp ID with real MongoDB ID
        setAlbums(prev => prev.map(a => a.id === newAlbum.id ? { ...a, id: created.id } : a));
      }
    } catch { /* stays in localStorage */ }
  };

  // CRUD: Delete Album
  const handleDeleteAlbum = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah kamu yakin ingin menghapus album ini?')) return;
    setAlbums(prev => prev.filter(a => a.id !== id));
    if (selectedAlbumId === id) setSelectedAlbumId(null);

    try {
      await fetch(`/api/albums/${id}`, { method: 'DELETE' });
    } catch { /* already removed locally */ }
  };

  // CRUD: Add Photo select
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewPhotoPreview(reader.result as string);
      setShowAddPhotoModal(true);
    };
    reader.readAsDataURL(file);
  };

  // CRUD: Save Photo
  const handleAddPhotoToAlbum = async () => {
    if (!selectedAlbumId || !newPhotoPreview) return;
    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      src: newPhotoPreview,
      caption: newPhotoCaption.trim() || 'Momen indah',
      addedAt: Date.now(),
    };
    setAlbums(prev => prev.map(album => {
      if (album.id === selectedAlbumId) {
        return { ...album, photos: [newPhoto, ...album.photos] };
      }
      return album;
    }));
    setShowAddPhotoModal(false);
    setNewPhotoPreview('');
    setNewPhotoCaption('');

    try {
      await fetch(`/api/albums/${selectedAlbumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'addPhoto', photo: newPhoto }),
      });
    } catch { /* stays in localStorage */ }
  };

  // CRUD: Delete Photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!selectedAlbumId) return;
    if (!confirm('Hapus foto ini dari album?')) return;
    setAlbums(prev => prev.map(album => {
      if (album.id === selectedAlbumId) {
        return { ...album, photos: album.photos.filter(p => p.id !== photoId) };
      }
      return album;
    }));
    if (lightboxPhoto?.id === photoId) setLightboxPhoto(null);

    try {
      await fetch(`/api/albums/${selectedAlbumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'deletePhoto', photoId }),
      });
    } catch { /* already removed locally */ }
  };

  // CRUD: Edit Caption
  const savePhotoCaptionEdit = async (photoId: string) => {
    if (!selectedAlbumId) return;
    setAlbums(prev => prev.map(album => {
      if (album.id === selectedAlbumId) {
        return {
          ...album,
          photos: album.photos.map(p => p.id === photoId ? { ...p, caption: editPhotoCaption } : p),
        };
      }
      return album;
    }));
    setEditingPhotoId(null);

    try {
      await fetch(`/api/albums/${selectedAlbumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'updatePhotoCaption', photoId, caption: editPhotoCaption }),
      });
    } catch { /* stays in localStorage */ }
  };

  const currentAlbum = albums.find(a => a.id === selectedAlbumId);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Hidden file inputs */}
      <input ref={albumCoverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />

      {/* ═══ VIEW 1: ALBUMS LIST ═══ */}
      {!selectedAlbumId && (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-200/70">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-500 block mb-0.5">
                Galeri Foto
              </span>
              <h2 className="text-2xl sm:text-3xl text-gray-900 font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Album Kenangan
              </h2>
            </div>

            <button
              onClick={() => setShowCreateAlbumModal(true)}
              className="px-4.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon />
              <span>Buat Album Baru</span>
            </button>
          </div>

          {/* Album Grid / Empty State */}
          {albums.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-14 text-center my-4 flex flex-col items-center justify-center shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mb-4">
                <FolderIcon />
              </div>

              <h3 className="text-xl sm:text-2xl text-gray-900 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Belum Ada Album Kenangan
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed mb-6">
                Buat album pertamamu dan simpan momen-momen indah perayaan ulang tahun Kamilah di sini.
              </p>

              <button
                onClick={() => setShowCreateAlbumModal(true)}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-2"
              >
                <PlusIcon />
                <span>Buat Album Pertama</span>
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {albums.map((album) => (
                <motion.div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-rose-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Album Cover Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={album.coverSrc}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Photo count badge */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5">
                      <FolderIcon />
                      <span>{album.photos.length} Foto</span>
                    </div>

                    {/* Delete album button */}
                    <button
                      onClick={(e) => handleDeleteAlbum(album.id, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/90 text-gray-500 hover:text-rose-600 hover:bg-white transition-all shadow-xs"
                      title="Hapus Album"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {/* Album Info Footer */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-rose-600 transition-colors mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                        {album.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2">
                        {album.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-400 group-hover:text-rose-500 transition-colors">
                      <span>Buka album ini</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ VIEW 2: ALBUM DETAIL & PHOTOS ═══ */}
      {selectedAlbumId && currentAlbum && (
        <div>
          {/* Back & Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/70">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
                title="Kembali ke semua album"
              >
                <ArrowLeftIcon />
              </button>
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">
                  Album Kenangan
                </span>
                <h2 className="text-xl sm:text-2xl text-gray-900 font-semibold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {currentAlbum.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => photoInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon />
              <span>Tambah Foto</span>
            </button>
          </div>

          {/* Photos Grid */}
          {currentAlbum.photos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-amber-50/20 border border-rose-100/80 rounded-[32px] p-8 sm:p-12 text-center shadow-[0_10px_30px_rgba(244,114,182,0.05)] max-w-lg mx-auto my-6"
            >
              <div className="w-36 h-36 bg-rose-200/30 rounded-full blur-2xl absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none" />

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md border-2 border-white flex items-center justify-center"
              >
                <ImageIcon />
              </motion.div>

              <span className="relative z-10 text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500 block mb-1">
                Album Kosong
              </span>
              <h3 className="relative z-10 text-xl sm:text-2xl text-gray-900 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Belum Ada Foto di Album Ini
              </h3>
              <p className="relative z-10 text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-xs mx-auto mb-6">
                Tambahkan foto-foto kenangan pertamamu ke album &quot;{currentAlbum.title}&quot;.
              </p>

              <button
                onClick={() => photoInputRef.current?.click()}
                className="relative z-10 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-rose-300/30 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <PlusIcon />
                <span>Upload Foto Pertama</span>
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentAlbum.photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-rose-200 transition-all duration-300 flex flex-col"
                >
                  {/* Photo Thumbnail */}
                  <div
                    onClick={() => setLightboxPhoto(photo)}
                    className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxPhoto(photo); }}
                        className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-all shadow-xs"
                        title="Lihat Foto"
                      >
                        <MaximizeIcon />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                        className="p-2 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 transition-all shadow-xs"
                        title="Hapus Foto"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* Caption Footer */}
                  <div className="p-3.5 flex items-center justify-between gap-2 border-t border-gray-100">
                    {editingPhotoId === photo.id ? (
                      <div className="w-full flex gap-1.5">
                        <input
                          type="text"
                          value={editPhotoCaption}
                          onChange={e => setEditPhotoCaption(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-rose-300 bg-white focus:outline-none text-gray-800"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && savePhotoCaptionEdit(photo.id)}
                        />
                        <button
                          onClick={() => savePhotoCaptionEdit(photo.id)}
                          className="px-3 py-1 bg-rose-500 text-white text-[11px] rounded-lg font-medium"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-700 font-light leading-snug line-clamp-2 flex-1">
                          {photo.caption}
                        </p>
                        <button
                          onClick={() => { setEditingPhotoId(photo.id); setEditPhotoCaption(photo.caption); }}
                          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                          title="Sunting Caption"
                        >
                          <EditIcon />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: CREATE ALBUM ── */}
      <AnimatePresence>
        {showCreateAlbumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setShowCreateAlbumModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  Buat Album Baru
                </h4>
                <button
                  onClick={() => setShowCreateAlbumModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 flex items-center justify-center"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Cover Select Box */}
              <div
                onClick={() => albumCoverInputRef.current?.click()}
                className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/20 transition-all overflow-hidden mb-4"
              >
                {newAlbumCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={newAlbumCover} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    <ImageIcon />
                    <p className="text-xs font-medium text-gray-600 mt-1">Pilih Foto Sampul Album</p>
                    <span className="text-[10px] text-gray-400">Klik di sini untuk upload</span>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={newAlbumTitle}
                onChange={e => setNewAlbumTitle(e.target.value)}
                placeholder="Judul Album..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 placeholder:text-gray-400 mb-3"
              />

              <input
                type="text"
                value={newAlbumDesc}
                onChange={e => setNewAlbumDesc(e.target.value)}
                placeholder="Deskripsi singkat album (opsional)..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 placeholder:text-gray-400 mb-5"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateAlbumModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateAlbum}
                  disabled={!newAlbumTitle.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 transition-colors shadow-xs"
                >
                  Buat Album
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: ADD PHOTO TO ALBUM ── */}
      <AnimatePresence>
        {showAddPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setShowAddPhotoModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  Tambah Foto Baru
                </h4>
                <button
                  onClick={() => { setShowAddPhotoModal(false); setNewPhotoPreview(''); setNewPhotoCaption(''); }}
                  className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 flex items-center justify-center"
                >
                  <CloseIcon />
                </button>
              </div>

              {newPhotoPreview && (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <input
                type="text"
                value={newPhotoCaption}
                onChange={e => setNewPhotoCaption(e.target.value)}
                placeholder="Tulis pesan / keterangan foto..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-rose-300 text-gray-800 placeholder:text-gray-400 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddPhotoModal(false); setNewPhotoPreview(''); setNewPhotoCaption(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddPhotoToAlbum}
                  className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-xs"
                >
                  Simpan Foto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setLightboxPhoto(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative z-10 max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors"
                title="Tutup"
              >
                <CloseIcon />
              </button>

              <div className="flex flex-col">
                <div className="w-full max-h-[70vh] bg-black flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lightboxPhoto.src} alt="" className="max-w-full max-h-[70vh] object-contain" />
                </div>
                {lightboxPhoto.caption && (
                  <div className="p-5 text-center bg-white border-t border-gray-100">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {lightboxPhoto.caption}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
