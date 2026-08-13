import mongoose, { Schema, Document } from 'mongoose';

export interface ILetterStatus extends Document {
  letterId: string;
  opened: boolean;
  openedAt: string;
}

const LetterStatusSchema = new Schema<ILetterStatus>({
  letterId: { type: String, required: true, unique: true },
  opened: { type: Boolean, default: false },
  openedAt: { type: String, default: '' },
});

export default mongoose.models.LetterStatus || mongoose.model<ILetterStatus>('LetterStatus', LetterStatusSchema);
