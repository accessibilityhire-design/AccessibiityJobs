import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export function proxy(request: NextRequest) {
  // Protect admin routes; the session cookie must carry a valid HMAC signature
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect from /admin to /admin/login
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
