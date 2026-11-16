import { NextResponse } from 'next/server';

// A home muda de versão pelo User-Agent na mesma URL (ADR 0004): caches não podem servir uma pela outra.
export function middleware() {
  const response = NextResponse.next();
  response.headers.set('Vary', 'User-Agent');
  return response;
}

export const config = { matcher: ['/', '/en'] };
