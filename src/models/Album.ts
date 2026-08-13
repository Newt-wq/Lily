import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto {
  id: string;
  src: string;
  caption: string;
  addedAt: number;
}

export interface IAlbum extends Document {
  title: string;
  description: string;
  coverSrc: string;
  createdAt: number;
  photos: IPhoto[];
}

const PhotoSchema = new Schema<IPhoto>({
  id: { type: String, required: true },
  src: { type: String, required: true },
  caption: { type: String, default: '' },
  addedAt: { type: Number, required: true },
}, { _id: false });

const AlbumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  coverSrc: { type: String, default: '' },
  createdAt: { type: Number, required: true },
  photos: { type: [PhotoSchema], default: [] },
});

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
