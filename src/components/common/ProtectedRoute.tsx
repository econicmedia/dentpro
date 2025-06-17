'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/authStore';
import { UserRole } from '@/types/auth';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: string[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = [],
  fallbackPath = '/auth/login',
  loadingComponent,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If still loading, don't redirect yet
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push(fallbackPath);
      return;
    }

    // Check role requirement
    if (requiredRole && user.role !== requiredRole) {
      // Redirect based on user role
      switch (user.role) {
        case UserRole.PATIENT:
          router.push('/patient/dashboard');
          break;
        case UserRole.DENTIST:
          router.push('/dentist/dashboard');
          break;
        case UserRole.ADMIN:
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
      return;
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(() => {
        // This would use the checkPermission method from auth store
        // For now, we'll implement basic role-based checks
        if (user.role === UserRole.ADMIN) return true;

        // Add more specific permission checks here
        return false;
      });

      if (!hasAllPermissions) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, requiredPermissions, router, fallbackPath]);

  // Show loading while checking authentication
  if (isLoading) {
    return loadingComponent || <Loading />;
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated || !user) {
    return loadingComponent || <Loading />;
  }

  // If role check fails, don't render children (will redirect)
  if (requiredRole && user.role !== requiredRole) {
    return loadingComponent || <Loading />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
