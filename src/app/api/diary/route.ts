import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import DiaryEntry from '../../../models/DiaryEntry';

export async function GET() {
  try {
    await dbConnect();
    const entries = await DiaryEntry.find({}).sort({ date: -1, createdAt: -1 }).lean();
    const formatted = entries.map((e: any) => ({
      id: e._id.toString(),
      title: e.title,
      content: e.content,
      mood: e.mood || undefined,
      date: e.date,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
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
    const entry = await DiaryEntry.create({
      title: body.title || `Catatan ${body.date || new Date().toISOString().split('T')[0]}`,
      content: body.content,
      mood: body.mood,
      date: body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      id: entry._id.toString(),
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      date: entry.date,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
