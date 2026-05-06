import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { engagementSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.engagement.findUnique({ where: { id: parseInt(id) } });
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = engagementSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { dateLastContact, nextFollowupDate, startDate, endDate, ...rest } = parsed.data;

  try {
    const record = await prisma.engagement.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        ...(dateLastContact  !== undefined && { dateLastContact:  dateLastContact  ? new Date(dateLastContact)  : null }),
        ...(nextFollowupDate !== undefined && { nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null }),
        ...(startDate        !== undefined && { startDate:        startDate        ? new Date(startDate)        : null }),
        ...(endDate          !== undefined && { endDate:          endDate          ? new Date(endDate)          : null }),
      },
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.engagement.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
