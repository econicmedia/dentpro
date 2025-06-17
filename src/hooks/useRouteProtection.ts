'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthActions } from '@/store/authStore';
import { UserRole } from '@/types/auth';

interface UseRouteProtectionOptions {
  requiredRole?: UserRole;
  requiredPermissions?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export const useRouteProtection = (options: UseRouteProtectionOptions = {}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { checkPermission, hasRole } = useAuthActions();

  const {
    requiredRole,
    requiredPermissions = [],
    redirectTo = '/auth/login',
    onUnauthorized,
  } = options;

  useEffect(() => {
    // Don't check while still loading
    if (isLoading) return;

    // Check authentication
    if (!isAuthenticated || !user) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.push(redirectTo);
      }
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Redirect to appropriate dashboard based on user's actual role
        const userDashboard = getUserDashboard(user.role);
        router.push(userDashboard);
      }
      return;
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        checkPermission(permission)
      );

      if (!hasAllPermissions) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          router.push('/unauthorized');
        }
        return;
      }
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requiredRole,
    requiredPermissions,
    redirectTo,
    onUnauthorized,
    router,
    checkPermission,
    hasRole,
  ]);

  return {
    isAuthenticated,
    user,
    isLoading,
    isAuthorized: isAuthenticated && 
      (!requiredRole || hasRole(requiredRole)) &&
      (requiredPermissions.length === 0 || requiredPermissions.every(p => checkPermission(p))),
  };
};

// Helper function to get appropriate dashboard for user role
const getUserDashboard = (role: UserRole): string => {
  switch (role) {
    case UserRole.PATIENT:
      return '/patient/dashboard';
    case UserRole.DENTIST:
      return '/dentist/dashboard';
    case UserRole.ADMIN:
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

// Convenience hooks for specific roles
export const usePatientRoute = (options?: Omit<UseRouteProtectionOptions, 'requiredRole'>) => {
  return useRouteProtection({ ...options, requiredRole: UserRole.PATIENT });
};

export const useDentistRoute = (options?: Omit<UseRouteProtectionOptions, 'requiredRole'>) => {
  return useRouteProtection({ ...options, requiredRole: UserRole.DENTIST });
};

export const useAdminRoute = (options?: Omit<UseRouteProtectionOptions, 'requiredRole'>) => {
  return useRouteProtection({ ...options, requiredRole: UserRole.ADMIN });
};

// Hook for checking specific permissions
export const usePermissionCheck = (permissions: string[]) => {
  const { checkPermission } = useAuthActions();
  
  return {
    hasPermissions: permissions.every(permission => checkPermission(permission)),
    checkPermission,
  };
};
