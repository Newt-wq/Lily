import { useState, useEffect, useCallback } from 'react';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

const LOCAL_CACHE_KEY = 'kamilah-diary-entries';

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const sortEntries = (list: DiaryEntry[]) =>
    [...list].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Load entries: try API first, fallback/sync with localStorage
  const loadEntries = useCallback(async () => {
    let localData: DiaryEntry[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_CACHE_KEY);
      if (stored) {
        try {
          localData = JSON.parse(stored) as DiaryEntry[];
        } catch { /* ignore */ }
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/diary', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const dbData = await res.json();
        
        // If DB has data, use it & update local cache
        if (Array.isArray(dbData) && dbData.length > 0) {
          const sorted = sortEntries(dbData);
          setEntries(sorted);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(sorted));
          }
          setIsLoaded(true);
          return;
        }

        // If DB is empty BUT we have local data, MIGRATE local data to MongoDB!
        if (localData.length > 0) {
          for (const item of localData) {
            await fetch('/api/diary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: item.title, content: item.content, mood: item.mood, date: item.date }),
            }).catch(() => {});
          }
          // Fetch updated DB list
          const freshRes = await fetch('/api/diary').catch(() => null);
          if (freshRes && freshRes.ok) {
            const freshData = await freshRes.json();
            if (Array.isArray(freshData)) {
              setEntries(sortEntries(freshData));
              setIsLoaded(true);
              return;
            }
          }
        }
      }
    } catch {
      // API unavailable or timed out, use localStorage fallback
    }

    setEntries(sortEntries(localData));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (title: string, content: string, mood?: string, customDate?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: DiaryEntry = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      title: title.trim() || `Catatan ${customDate || today}`,
      content,
      mood,
      date: customDate || today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic UI update
    const updated = sortEntries([newEntry, ...entries]);
    setEntries(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
    }

    // Persist to API
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newEntry.title, content, mood, date: newEntry.date }),
      });
      if (res.ok) {
        // Refresh from API to sync IDs
        await loadEntries();
      }
    } catch {
      // Stays in localStorage as fallback
    }
  };

  const updateEntry = async (id: string, updates: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>) => {
    // Optimistic UI update
    const updated = entries.map(entry => {
      if (entry.id === id) {
        return { ...entry, ...updates, updatedAt: new Date().toISOString() };
      }
      return entry;
    });
    const sorted = sortEntries(updated);
    setEntries(sorted);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(sorted));
    }

    // Persist to API
    try {
      await fetch(`/api/diary/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Stays in localStorage
    }
  };

  const deleteEntry = async (id: string) => {
    // Optimistic UI update
    const filtered = entries.filter(entry => entry.id !== id);
    setEntries(filtered);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(filtered));
    }

    // Persist to API
    try {
      await fetch(`/api/diary/${id}`, { method: 'DELETE' });
    } catch {
      // Already removed from local state
    }
  };

  const exportDiary = () => {
    if (entries.length === 0) return;
    
    let text = `DIARY KAMILAH 🌸\n`;
    text += `Di-export pada: ${new Date().toLocaleString()}\n`;
    text += `=========================================\n\n`;

    entries.forEach((entry, index) => {
      text += `Catatan #${entries.length - index}\n`;
      text += `Tanggal: ${entry.date} ${entry.mood ? `| Mood: ${entry.mood}` : ''}\n`;
      text += `Judul  : ${entry.title}\n`;
      text += `-----------------------------------------\n`;
      text += `${entry.content}\n`;
      text += `=========================================\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diary_kamilah_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    entries,
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    exportDiary,
  };
}
