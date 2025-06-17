import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth';

// Mock user data for testing
const mockUsers = [
  {
    id: '1',
    email: 'patient@test.com',
    password: 'password123',
    name: 'Test Patient',
    role: UserRole.PATIENT,
    image: null,
  },
  {
    id: '2',
    email: 'dentist@test.com',
    password: 'password123',
    name: 'Dr. Test Dentist',
    role: UserRole.DENTIST,
    image: null,
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: 'password123',
    name: 'Test Admin',
    role: UserRole.ADMIN,
    image: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: 'mock-jwt-token', // In real app, generate actual JWT
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
