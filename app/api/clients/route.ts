import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { engagementSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status   = searchParams.get('status')   || undefined;
  const stage    = searchParams.get('stage')    || undefined;
  const search   = searchParams.get('search')   || undefined;
  const priority = searchParams.get('priority') || undefined;

  const data = await prisma.engagement.findMany({
    where: {
      ...(status   && { status }),
      ...(stage    && { stage }),
      ...(priority && { priority }),
      ...(search   && {
        OR: [
          { clientName:       { contains: search } },
          { pocName:          { contains: search } },
          { accountExecutive: { contains: search } },
          { hqCity:           { contains: search } },
          { notes:            { contains: search } },
        ],
      }),
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = engagementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { dateLastContact, nextFollowupDate, startDate, endDate, ...rest } = parsed.data;

  const record = await prisma.engagement.create({
    data: {
      ...rest,
      dateLastContact:  dateLastContact  ? new Date(dateLastContact)  : null,
      nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null,
      startDate:        startDate        ? new Date(startDate)        : null,
      endDate:          endDate          ? new Date(endDate)          : null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
