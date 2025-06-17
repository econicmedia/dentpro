'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/store/authStore';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    // Redirect to appropriate dashboard based on user role
    if (user) {
      switch (user.role) {
        case 'PATIENT':
          router.push('/patient/dashboard');
          break;
        case 'DENTIST':
          router.push('/dentist/dashboard');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
      <Card className="glass-card w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Access Denied
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              This page requires specific permissions that your account doesn&apos;t have.
              Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="flex-1 glass-button"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>

          {user && (
            <div className="mt-6 p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Role: <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
