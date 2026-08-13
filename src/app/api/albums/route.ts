import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Album from '../../../models/Album';

export async function GET() {
  try {
    await dbConnect();
    const albums = await Album.find({}).sort({ createdAt: -1 }).lean();
    const formatted = albums.map((a: any) => ({
      id: a._id.toString(),
      title: a.title,
      description: a.description,
      coverSrc: a.coverSrc,
      createdAt: a.createdAt,
      photos: (a.photos || []).map((p: any) => ({
        id: p.id,
        src: p.src,
        caption: p.caption,
        addedAt: p.addedAt,
      })),
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const album = await Album.create({
      title: body.title,
      description: body.description || '',
      coverSrc: body.coverSrc || '',
      createdAt: Date.now(),
      photos: [],
    });
    return NextResponse.json({
      id: album._id.toString(),
      title: album.title,
      description: album.description,
      coverSrc: album.coverSrc,
      createdAt: album.createdAt,
      photos: [],
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
