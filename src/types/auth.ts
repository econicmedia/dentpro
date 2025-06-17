// Authentication and User Types
export enum UserRole {
  PATIENT = 'PATIENT',
  DENTIST = 'DENTIST',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  patientProfile?: PatientProfile;
  dentistProfile?: DentistProfile;
}

export interface PatientProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string[];
  insuranceInfo?: InsuranceInfo;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user: User;
}

export interface DentistProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string[];
  workingHours: WorkingHours;
  practiceInfo?: PracticeInfo;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user: User;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expirationDate?: Date;
}

export interface WorkingHours {
  monday?: WorkingTimeSlot[];
  tuesday?: WorkingTimeSlot[];
  wednesday?: WorkingTimeSlot[];
  thursday?: WorkingTimeSlot[];
  friday?: WorkingTimeSlot[];
  saturday?: WorkingTimeSlot[];
  sunday?: WorkingTimeSlot[];
}

export interface WorkingTimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface PracticeInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
}

// Authentication Session Types
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

// NextAuth session extension
declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

// Permission Types
export type Permission = 
  | 'appointments:read:own'
  | 'appointments:read:all'
  | 'appointments:create:own'
  | 'appointments:create:all'
  | 'appointments:update:own'
  | 'appointments:update:all'
  | 'appointments:delete:own'
  | 'appointments:delete:all'
  | 'patients:read:own'
  | 'patients:read:all'
  | 'patients:update:own'
  | 'patients:update:all'
  | 'documents:read:own'
  | 'documents:read:all'
  | 'documents:create:own'
  | 'documents:create:all'
  | 'documents:update:own'
  | 'documents:update:all'
  | 'documents:delete:own'
  | 'documents:delete:all'
  | 'profile:read:own'
  | 'profile:update:own'
  | 'practice:manage'
  | 'users:manage';

export interface RolePermissions {
  [UserRole.PATIENT]: Permission[];
  [UserRole.DENTIST]: Permission[];
  [UserRole.ADMIN]: Permission[];
}

// API Response Types
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  errors?: string[];
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  dateOfBirth?: Date;
  allergies?: string[];
  medicalHistory?: string;
  insuranceInfo?: InsuranceInfo;
}
