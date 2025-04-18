import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, images, and API routes
  if (
    pathname.startsWith('/_next') || // Next.js static files
    pathname.startsWith('/images') || // Image files
    pathname.startsWith('/favicon.ico') || // Favicon
    pathname.startsWith('/api') // API routes
  ) {
    return NextResponse.next();
  }

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/', '/products', '/about', '/contact'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Handle auth pages (login/register)
  if (isAuthPage) {
    // If user is already logged in, redirect to home page
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to login/register pages
    return NextResponse.next();
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // For all other routes, require authentication
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/products',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/admin/:path*',
    '/cart',
    '/checkout',
    '/profile',
    '/orders/:path*',
  ],
}; 