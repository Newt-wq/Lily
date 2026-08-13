import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import LetterStatus from '../../../models/LetterStatus';

export async function GET() {
  try {
    await dbConnect();
    const statuses = await LetterStatus.find({}).lean();
    const map: Record<string, boolean> = {};
    statuses.forEach((s: any) => {
      map[s.letterId] = s.opened;
    });
    return NextResponse.json(map);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    await LetterStatus.findOneAndUpdate(
      { letterId: body.letterId },
      { opened: true, openedAt: new Date().toISOString() },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
