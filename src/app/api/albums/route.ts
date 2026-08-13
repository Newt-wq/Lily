import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: albums, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (albums || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      coverSrc: a.cover_src,
      createdAt: a.created_at,
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
    const body = await request.json();
    const { data: album, error } = await supabase
      .from('albums')
      .insert({
        title: body.title,
        description: body.description || '',
        cover_src: body.coverSrc || '',
        photos: [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: album.id,
      title: album.title,
      description: album.description,
      coverSrc: album.cover_src,
      createdAt: album.created_at,
      photos: [],
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
