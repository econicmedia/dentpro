'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';

/**
 * Component to sync NextAuth session with Zustand auth store
 */
const SessionSync: React.FC = () => {
  const { data: session, status } = useSession();
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    // Set loading state based on NextAuth status
    setLoading(status === 'loading');

    if (status === 'authenticated' && session?.user) {
      // Sync NextAuth session with Zustand store
      const user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        image: session.user.image,
        createdAt: new Date(), // Default value
        updatedAt: new Date(), // Default value
      };

      const authSession = {
        user,
        accessToken: session.accessToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      setUser(user);
      setSession(authSession);
    } else if (status === 'unauthenticated') {
      // Clear store when unauthenticated
      setUser(null);
      setSession(null);
    }
  }, [session, status, setUser, setSession, setLoading]);

  return null; // This component doesn't render anything
};

export default SessionSync;
