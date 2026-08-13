import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Album from '../../../../models/Album';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Handle photo operations
    if (body._action === 'addPhoto') {
      const album = await Album.findById(id);
      if (!album) return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      album.photos.push({
        id: body.photo.id,
        src: body.photo.src,
        caption: body.photo.caption || '',
        addedAt: Date.now(),
      });
      await album.save();
      return NextResponse.json({ success: true, photosCount: album.photos.length });
    }

    if (body._action === 'updatePhotoCaption') {
      const album = await Album.findById(id);
      if (!album) return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      const photo = album.photos.find((p: any) => p.id === body.photoId);
      if (photo) {
        photo.caption = body.caption;
        await album.save();
      }
      return NextResponse.json({ success: true });
    }

    if (body._action === 'deletePhoto') {
      const album = await Album.findById(id);
      if (!album) return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      album.photos = album.photos.filter((p: any) => p.id !== body.photoId);
      await album.save();
      return NextResponse.json({ success: true });
    }

    // Default: update album metadata
    const updated = await Album.findByIdAndUpdate(id, {
      title: body.title,
      description: body.description,
      coverSrc: body.coverSrc,
    }, { new: true }).lean();

    if (!updated) return NextResponse.json({ error: 'Album not found' }, { status: 404 });

    return NextResponse.json({
      id: (updated as any)._id.toString(),
      title: (updated as any).title,
      description: (updated as any).description,
      coverSrc: (updated as any).coverSrc,
      createdAt: (updated as any).createdAt,
      photos: ((updated as any).photos || []).map((p: any) => ({
        id: p.id, src: p.src, caption: p.caption, addedAt: p.addedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await Album.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
