import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('admin_session');
    
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

