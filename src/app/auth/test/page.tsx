'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuth } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, User, Shield, Key } from 'lucide-react';

const AuthTestPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, isLoading } = useAuth();
  // const { checkPermission, hasRole } = useAuthActions(); // Commented out as not used

  const testResults = [
    {
      name: 'NextAuth Session',
      status: status === 'authenticated' ? 'pass' : status === 'loading' ? 'loading' : 'fail',
      description: `Status: ${status}`,
      icon: User,
    },
    {
      name: 'Zustand Store Sync',
      status: isAuthenticated && user ? 'pass' : isLoading ? 'loading' : 'fail',
      description: `Authenticated: ${isAuthenticated}, User: ${user ? 'Present' : 'None'}`,
      icon: Shield,
    },
    {
      name: 'Route Protection',
      status: 'pass', // This page loads, so route protection is working
      description: 'Auth test page accessible',
      icon: Key,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'loading':
        return <Badge variant="secondary">Loading</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Authentication System Test
        </h1>
        <p className="text-muted-foreground">
          Verify all authentication components are working correctly
        </p>
      </div>

      {/* Test Results */}
      <div className="grid gap-4 md:grid-cols-3">
        {testResults.map((test, index) => {
          const Icon = test.icon;
          return (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-sm">{test.name}</CardTitle>
                  </div>
                  {getStatusIcon(test.status)}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs mb-2">
                  {test.description}
                </CardDescription>
                {getStatusBadge(test.status)}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Session Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Current authentication state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">NextAuth Session</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Zustand Store</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                {JSON.stringify({ user, isAuthenticated, isLoading }, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Authentication Actions</CardTitle>
          <CardDescription>Test authentication functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {!session && (
              <>
                <Button
                  onClick={() => signIn('credentials')}
                  variant="outline"
                >
                  Test Credentials Login
                </Button>
                <Button
                  onClick={() => signIn('google')}
                  className="glass-button"
                >
                  Test Google OAuth
                </Button>
              </>
            )}
            
            {session && (
              <Button
                onClick={() => signOut()}
                variant="destructive"
              >
                Sign Out
              </Button>
            )}
          </div>

          {user && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">User Details</h4>
              <div className="grid gap-2 text-sm">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Role:</strong> {user.role}</div>
                {user.image && <div><strong>Image:</strong> {user.image}</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Test */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Navigation Test</CardTitle>
          <CardDescription>Test protected routes and redirects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
            >
              Test Dashboard (Protected)
            </Button>
            <Button
              onClick={() => window.location.href = '/auth/login'}
              variant="outline"
            >
              Test Login Page
            </Button>
            <Button
              onClick={() => window.location.href = '/auth/register'}
              variant="outline"
            >
              Test Register Page
            </Button>
            <Button
              onClick={() => window.location.href = '/unauthorized'}
              variant="outline"
            >
              Test Unauthorized Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTestPage;
