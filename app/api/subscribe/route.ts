import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`subscribe:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    await db
      .insert(subscribers)
      .values({ email: parsed.data.email })
      .onConflictDoNothing({ target: subscribers.email });

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
