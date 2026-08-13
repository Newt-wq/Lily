import mongoose from 'mongoose';
import DiaryEntry from './src/models/DiaryEntry';
import Album from './src/models/Album';
import LetterStatus from './src/models/LetterStatus';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/birthday-mila';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log('Inserting initial default albums into MongoDB...');
  await Album.deleteMany({});
  await Album.create([
    {
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
      title: 'Album Kejutan & Senyuman',
      description: 'Foto-foto penuh kehangatan dan kenangan manis',
      coverSrc: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
      createdAt: Date.now() + 2,
      photos: [
        { id: 'p3', src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop', caption: 'Hari yang indah penuh kebahagiaan', addedAt: Date.now() + 2 },
      ],
    },
  ]);

  console.log('Inserting initial welcome diary into MongoDB...');
  const existingDiaries = await DiaryEntry.countDocuments();
  if (existingDiaries === 0) {
    await DiaryEntry.create({
      title: 'Selamat Datang di Catatan Harian Kamilah 🌸',
      content: 'Ini adalah tempat aman untuk menuliskan semua perasaan, cerita, dan kenangan indahmu.',
      mood: 'bahagia',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  console.log('DATABASE SETUP SUCCESSFUL!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Database setup error:', err);
  process.exit(1);
});
