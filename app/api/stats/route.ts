import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [all, activeCount, proposalCount, followupsDue, byStage] = await Promise.all([
    prisma.engagement.findMany({
      where: { status: { not: 'Closed Lost' } },
      select: { contractValue: true },
    }),
    prisma.engagement.count({ where: { status: 'Active' } }),
    prisma.engagement.count({ where: { status: 'Proposal' } }),
    prisma.engagement.findMany({
      where: { nextFollowupDate: { lte: today } },
      orderBy: { nextFollowupDate: 'asc' },
      take: 10,
    }),
    prisma.engagement.groupBy({
      by: ['stage'],
      _count: { stage: true },
    }),
  ]);

  const totalPipelineValue = all.reduce((sum: number, e: { contractValue: number }) => sum + e.contractValue, 0);
  const stageMap = Object.fromEntries(byStage.map((s: { stage: string; _count: { stage: number } }) => [s.stage, s._count.stage]));

  return NextResponse.json({
    activeCount,
    proposalCount,
    totalPipelineValue,
    followupsDueCount: followupsDue.length,
    followupsDue,
    byStage: stageMap,
  });
}
