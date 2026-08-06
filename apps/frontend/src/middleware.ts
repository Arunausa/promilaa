import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes at the edge
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value || request.cookies.get('accessToken')?.value;
    
    // If no auth token in cookies, redirect to login immediately before rendering HTML
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
