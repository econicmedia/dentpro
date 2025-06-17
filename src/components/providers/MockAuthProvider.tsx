'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth';

interface MockAuthProviderProps {
  children: React.ReactNode;
}

const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children }) => {
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    // Set up a mock user for development
    const mockUser = {
      id: 'mock-user-1',
      email: 'dentist@example.com',
      name: 'Dr. John Smith',
      image: undefined,
      role: UserRole.DENTIST,
      createdAt: new Date(),
      updatedAt: new Date(),
      dentistProfile: {
        id: 'dentist-profile-1',
        userId: 'mock-user-1',
        licenseNumber: 'DDS-12345',
        specialization: ['General Dentistry', 'Cosmetic Dentistry'],
        workingHours: {
          monday: [{ start: '09:00', end: '17:00' }],
          tuesday: [{ start: '09:00', end: '17:00' }],
          wednesday: [{ start: '09:00', end: '17:00' }],
          thursday: [{ start: '09:00', end: '17:00' }],
          friday: [{ start: '09:00', end: '17:00' }],
          saturday: [],
          sunday: [],
        },
        practiceInfo: {
          name: 'Smith Dental Practice',
          address: '123 Main St, City, State 12345',
          phone: '(555) 123-4567',
          email: 'info@smithdental.com',
          website: 'https://smithdental.com',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {} as any, // Will be filled by the relation
      },
    };

    const mockSession = {
      user: mockUser,
      accessToken: 'mock-access-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };

    setUser(mockUser);
    setSession(mockSession);
  }, [setUser, setSession]);

  return <>{children}</>;
};

export default MockAuthProvider;
