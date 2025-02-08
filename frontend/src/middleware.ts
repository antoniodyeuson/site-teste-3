import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas que requerem autenticação
  const protectedPaths = ['/dashboard', '/subscriber-dashboard', '/admin', '/settings'];

  // Se está tentando acessar uma rota protegida sem token
  if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está logado e tenta acessar login/register, redireciona para home
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apenas protege rotas específicas
    '/dashboard/:path*',
    '/subscriber-dashboard/:path*',
    '/admin/:path*',
    '/settings/:path*',
    '/login',
    '/register'
  ]
}; 