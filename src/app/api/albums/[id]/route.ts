import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Fetch original album first for JSONB manipulation
    const { data: album, error: fetchError } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    let updatedPhotos = album.photos || [];

    // Handle photo operations
    if (body._action === 'addPhoto') {
      updatedPhotos.push({
        id: body.photo.id,
        src: body.photo.src,
        caption: body.photo.caption || '',
        addedAt: Date.now(),
      });
      
      const { error: updateError } = await supabase
        .from('albums')
        .update({ photos: updatedPhotos })
        .eq('id', id);

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, photosCount: updatedPhotos.length });
    }

    if (body._action === 'updatePhotoCaption') {
      updatedPhotos = updatedPhotos.map((p: any) => {
        if (p.id === body.photoId) {
          return { ...p, caption: body.caption };
        }
        return p;
      });

      const { error: updateError } = await supabase
        .from('albums')
        .update({ photos: updatedPhotos })
        .eq('id', id);

      if (updateError) throw updateError;
      return NextResponse.json({ success: true });
    }

    if (body._action === 'deletePhoto') {
      updatedPhotos = updatedPhotos.filter((p: any) => p.id !== body.photoId);

      const { error: updateError } = await supabase
        .from('albums')
        .update({ photos: updatedPhotos })
        .eq('id', id);

      if (updateError) throw updateError;
      return NextResponse.json({ success: true });
    }

    // Default: update album metadata
    const { data: updated, error: updateError } = await supabase
      .from('albums')
      .update({
        title: body.title,
        description: body.description,
        cover_src: body.coverSrc,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      coverSrc: updated.cover_src,
      createdAt: updated.created_at,
      photos: (updated.photos || []).map((p: any) => ({
        id: p.id,
        src: p.src,
        caption: p.caption,
        addedAt: p.addedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
