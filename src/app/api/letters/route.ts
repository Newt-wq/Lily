import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data: statuses, error } = await supabase
      .from('letter_statuses')
      .select('*');

    if (error) throw error;

    const map: Record<string, boolean> = {};
    (statuses || []).forEach((s: any) => {
      map[s.letter_id] = s.opened;
    });
    return NextResponse.json(map);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error } = await supabase
      .from('letter_statuses')
      .upsert(
        {
          letter_id: body.letterId,
          opened: true,
          opened_at: new Date().toISOString(),
        },
        { onConflict: 'letter_id' }
      );

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
