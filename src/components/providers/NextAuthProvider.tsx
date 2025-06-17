'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import SessionSync from './SessionSync';

interface NextAuthProviderProps {
  children: ReactNode;
}

export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
