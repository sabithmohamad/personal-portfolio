import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

import { buildModelInput, buildSystemPrompt, chunkText, DEFAULT_MODEL, getFallbackStreamText, sanitizeMessages } from '@/lib/chat';
import { buildDonePayload, detectIntent, isBlockedPrompt } from '@/lib/portfolio-data';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();

const getIpAddress = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'local';
};

const sse = (event: string, data: unknown) =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

const streamingHeaders = (limit: Awaited<ReturnType<typeof rateLimit>>) => ({
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-RateLimit-Limit': String(limit.limit),
  'X-RateLimit-Remaining': String(limit.remaining),
  'X-RateLimit-Reset': String(limit.reset),
});

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const ipAddress = getIpAddress(request);
  const rate = await rateLimit(ipAddress);

  if (!rate.success) {
    return NextResponse.json(
      { error: 'Too many requests right now. Please try again in a few minutes.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000))),
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.reset),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  const latestUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content ?? '';

  if (!latestUserMessage) {
    return NextResponse.json({ error: 'Please send a message first.' }, { status: 400 });
  }

  const intent = detectIntent(latestUserMessage);
  const donePayload = buildDonePayload(intent, latestUserMessage);
  const shouldRefuse = isBlockedPrompt(latestUserMessage) || intent === 'unknown';

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const send = async (event: string, data: unknown) => {
    await writer.write(sse(event, data));
  };

  const streamFallback = async (text: string) => {
    for (const delta of chunkText(text)) {
      await send('chunk', { delta });
    }
  };

  void (async () => {
    try {
      if (shouldRefuse || !process.env.GEMINI_API_KEY) {
        const text = getFallbackStreamText(intent, latestUserMessage);
        await streamFallback(text);
        await send('done', donePayload);
        return;
      }

      const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const responseStream = await client.models.generateContentStream({
        model: DEFAULT_MODEL,
        contents: buildModelInput(intent, messages),
        config: {
          systemInstruction: buildSystemPrompt(intent),
          maxOutputTokens: 320,
        },
      });

      let output = '';

      for await (const chunk of responseStream as AsyncIterable<{ text?: string }>) {
        if (chunk.text) {
          output += chunk.text;
          await send('chunk', { delta: chunk.text });
        }
      }

      if (!output.trim()) {
        await streamFallback(getFallbackStreamText(intent, latestUserMessage));
      }

      await send('done', donePayload);
    } catch (error) {
      console.error('chat_route_error', error);
      await streamFallback(getFallbackStreamText(intent, latestUserMessage));
      await send('done', donePayload);
    } finally {
      await writer.close();
      console.info('chat_request_complete', {
        durationMs: Date.now() - startedAt,
        intent,
        ipAddress,
        mode: process.env.GEMINI_API_KEY ? 'gemini_or_fallback' : 'local_fallback',
      });
    }
  })();

  return new NextResponse(stream.readable, {
    headers: streamingHeaders(rate),
  });
}
