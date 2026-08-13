import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import DiaryEntry from '../../../../models/DiaryEntry';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await DiaryEntry.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: (updated as any)._id.toString(),
      title: (updated as any).title,
      content: (updated as any).content,
      mood: (updated as any).mood,
      date: (updated as any).date,
      createdAt: (updated as any).createdAt,
      updatedAt: (updated as any).updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await DiaryEntry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
