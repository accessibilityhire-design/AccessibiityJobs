import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await verifyAdmin(username, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, createSessionToken(admin.username), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return NextResponse.json(
      { message: 'Login successful', admin: { username: admin.username } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
