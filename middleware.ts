import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define types for route configuration
type UserRole = 'PATIENT' | 'DENTIST' | 'ADMIN';

interface BaseRouteConfig {
  requireAuth: boolean;
}

interface RouteConfigWithRoles extends BaseRouteConfig {
  roles: UserRole[];
}

interface RouteConfigWithoutRoles extends BaseRouteConfig {
  roles?: never;
}

type RouteConfig = RouteConfigWithRoles | RouteConfigWithoutRoles;

// Type guard to check if config has roles
function hasRoles(config: RouteConfig): config is RouteConfigWithRoles {
  return 'roles' in config && Array.isArray(config.roles);
}

// Define protected routes and their requirements
const protectedRoutes: Record<string, RouteConfig> = {
  // Dashboard routes
  '/dashboard': { requireAuth: true },
  '/patient': { requireAuth: true, roles: ['PATIENT'] },
  '/dentist': { requireAuth: true, roles: ['DENTIST'] },
  '/admin': { requireAuth: true, roles: ['ADMIN'] },

  // Profile and settings
  '/profile': { requireAuth: true },
  '/settings': { requireAuth: true },

  // Appointments
  '/appointments': { requireAuth: true },

  // Patients (dentist/admin only)
  '/patients': { requireAuth: true, roles: ['DENTIST', 'ADMIN'] },

  // Documents
  '/documents': { requireAuth: true },

  // Reports (dentist/admin only)
  '/reports': { requireAuth: true, roles: ['DENTIST', 'ADMIN'] },
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/legal/terms',
  '/legal/privacy',
  '/help',
  '/contact',
];

// Auth routes that should redirect if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Get authentication status from cookies/headers
  // Note: In a real implementation, you'd verify the JWT token here
  const authToken = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value as UserRole | undefined;
  const isAuthenticated = !!authToken;

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle auth routes (redirect if already authenticated)
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check protected routes
  const matchedRoute = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const [, config] = matchedRoute;

    // Check authentication requirement
    if (config.requireAuth && !isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role requirements using type guard
    if (hasRoles(config) && userRole && !config.roles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user role
      let redirectPath = '/dashboard';
      switch (userRole) {
        case 'PATIENT':
          redirectPath = '/patient/dashboard';
          break;
        case 'DENTIST':
          redirectPath = '/dentist/dashboard';
          break;
        case 'ADMIN':
          redirectPath = '/admin/dashboard';
          break;
      }
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Default: allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
