import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole, AuthSession } from '@/types/auth';
import { signOut } from 'next-auth/react';

interface AuthState {
  // State
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  clearError: () => void;
  reset: () => void;
}

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [UserRole.PATIENT]: [
    'appointments:read:own',
    'appointments:create:own',
    'appointments:update:own',
    'documents:read:own',
    'profile:read:own',
    'profile:update:own'
  ],
  [UserRole.DENTIST]: [
    'appointments:read:all',
    'appointments:create:all',
    'appointments:update:all',
    'appointments:delete:all',
    'patients:read:all',
    'patients:update:all',
    'documents:read:all',
    'documents:create:all',
    'documents:update:all',
    'documents:delete:all',
    'profile:read:own',
    'profile:update:own'
  ],
  [UserRole.ADMIN]: [
    '*' // All permissions
  ]
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        });
      },

      setSession: (session) => {
        set({ 
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          error: null
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      login: async (email: string, password: string) => {
        const { setLoading, setError, setSession } = get();
        
        try {
          setLoading(true);
          setError(null);

          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          
          if (data.success && data.user && data.token) {
            const session: AuthSession = {
              user: data.user,
              accessToken: data.token,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            };
            
            setSession(session);
          } else {
            throw new Error(data.message || 'Login failed');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
          setLoading(false);
        }
      },

      logout: async () => {
        try {
          // Use NextAuth signOut
          await signOut({ redirect: false });
        } catch (error) {
          console.error('Logout error:', error);
        }

        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        const { session, setSession, setError } = get();
        
        if (!session?.refreshToken) {
          return;
        }

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();
          
          if (data.success && data.token) {
            const newSession: AuthSession = {
              ...session,
              accessToken: data.token,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            };
            
            setSession(newSession);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Token refresh failed');
          // If refresh fails, logout user
          get().logout();
        }
      },

      updateProfile: async (data: Partial<User>) => {
        const { user, session, setUser, setError, setLoading } = get();
        
        if (!user || !session) {
          setError('User not authenticated');
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Profile update failed');
          }

          const result = await response.json();
          
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            throw new Error(result.message || 'Profile update failed');
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Profile update failed');
        } finally {
          setLoading(false);
        }
      },

      checkPermission: (permission: string) => {
        const { user } = get();
        
        if (!user) return false;
        
        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        
        // Admin has all permissions
        if (userPermissions.includes('*')) return true;
        
        return userPermissions.includes(permission);
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    session: store.session,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    logout: store.logout,
    refreshToken: store.refreshToken,
    updateProfile: store.updateProfile,
    checkPermission: store.checkPermission,
    hasRole: store.hasRole,
    clearError: store.clearError,
    reset: store.reset,
  };
};
