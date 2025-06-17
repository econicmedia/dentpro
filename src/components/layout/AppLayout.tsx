'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar, usePageState } from '@/store/uiStore';
import { useAuth } from '@/store/authStore';
import { UserRole } from '@/types/auth';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen } = useSidebar();
  const { breadcrumbs } = usePageState();
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile, setSidebarOpen]);

  // Don't render layout for auth pages
  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/register';
  
  if (isAuthPage || !isAuthenticated) {
    return (
      <ErrorBoundary level="critical">
        <div className="min-h-screen bg-background">
          {children}
          <Toaster />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary level="critical">
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={cn(
            'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
            isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-72'
          )}
        >
          {/* Header */}
          <Header />

          {/* Main content area */}
          <main className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3">
                  <Breadcrumbs items={breadcrumbs} />
                </div>
              </div>
            )}

            {/* Page content */}
            <div className="flex-1 container mx-auto px-4 py-6">
              <ErrorBoundary level="page">
                {children}
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

// Layout wrapper for different user roles
interface RoleBasedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({
  children,
  allowedRoles = [],
  fallback,
}) => {
  const { user } = useAuth();

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Layout for patient dashboard
export const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedLayout allowedRoles={[UserRole.PATIENT]}>
    <AppLayout>{children}</AppLayout>
  </RoleBasedLayout>
);

// Layout for dentist dashboard
export const DentistLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedLayout allowedRoles={[UserRole.DENTIST, UserRole.ADMIN]}>
    <AppLayout>{children}</AppLayout>
  </RoleBasedLayout>
);

// Layout for admin dashboard
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedLayout allowedRoles={[UserRole.ADMIN]}>
    <AppLayout>{children}</AppLayout>
  </RoleBasedLayout>
);

// Simple layout without sidebar (for auth pages, etc.)
export const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary level="critical">
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  </ErrorBoundary>
);

// Full-width layout (for landing pages, etc.)
export const FullWidthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary level="critical">
    <div className="min-h-screen bg-background">
      <main className="w-full">
        {children}
      </main>
      <Toaster />
    </div>
  </ErrorBoundary>
);

// Centered layout (for forms, modals, etc.)
export const CenteredLayout: React.FC<{ 
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}> = ({ children, maxWidth = 'md' }) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <ErrorBoundary level="page">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className={cn('w-full', maxWidthClasses[maxWidth])}>
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
