import mongoose, { Schema, Document } from 'mongoose';

export interface IDiaryEntry extends Document {
  title: string;
  content: string;
  mood?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const DiaryEntrySchema = new Schema<IDiaryEntry>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  date: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

export default mongoose.models.DiaryEntry || mongoose.model<IDiaryEntry>('DiaryEntry', DiaryEntrySchema);
