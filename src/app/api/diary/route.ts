import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: entries, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (entries || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      content: e.content,
      mood: e.mood || undefined,
      date: e.date,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data: entry, error } = await supabase
      .from('diary_entries')
      .insert({
        title: body.title || `Catatan ${body.date || new Date().toISOString().split('T')[0]}`,
        content: body.content,
        mood: body.mood,
        date: body.date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      date: entry.date,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
