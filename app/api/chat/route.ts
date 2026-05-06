import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const snapshot = await prisma.engagement.findMany({ orderBy: { updatedAt: 'desc' } });
  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are a project intelligence assistant for Sogeti West Region AI Practice. You help the team track client engagements, pipeline health, and account status.
Today's date is ${today}.
You have access to ${snapshot.length} engagement records below.

${JSON.stringify(snapshot, null, 2)}

Guidelines:
- Answer concisely with specific data from the records above.
- Format monetary values as USD (e.g. $1.2M, $875K).
- When asked about dates, calculate relative durations (e.g. "14 days ago", "overdue by 3 days").
- Use markdown bullets for lists.
- Never fabricate data. If a field is null or not recorded, say so.
- You can perform aggregate analysis: totals, averages, filtering, ranking.
- When referring to people, use their full name and title.`;

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  });
}
