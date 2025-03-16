// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  console.log('Middleware intercepted request:');
  console.log('Method:', request.method);
  console.log('URL:', request.url);
  console.log('Headers:', Object.fromEntries(request.headers.entries()));

  // Optional: Modify headers or perform checks
  return NextResponse.next();
}


export const config = {
  matcher: '/api/:path*'
};