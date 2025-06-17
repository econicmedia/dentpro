'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

import AuthLayout from '@/components/layout/AuthLayout';
import { AuthFormField, AuthSubmitButton, OAuthButton, FormDivider } from '@/components/forms';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Try NextAuth credentials login first
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Login failed', {
          description: 'Please check your credentials and try again.',
        });
      } else {
        toast.success('Login successful!', {
          description: 'Welcome back to DentCare Pro.',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsOAuthLoading(true);

      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        toast.error('OAuth login failed', {
          description: 'Please try again or use email/password login.',
        });
      } else if (result?.url) {
        toast.success('Login successful!', {
          description: 'Redirecting to dashboard...',
        });
        router.push(result.url);
      }
    } catch (oauthError) {
      console.error('OAuth login error:', oauthError);
      toast.error('OAuth login failed', {
        description: 'Please try again or use email/password login.',
      });
    } finally {
      setIsOAuthLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DentCare Pro account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <AuthFormField
          label="Email address"
          type="email"
          placeholder="Enter your email"
          value={watchedValues.email}
          onChange={(value) => setValue('email', value)}
          error={errors.email?.message}
          required
          autoComplete="email"
        />

        {/* Password Field */}
        <AuthFormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={watchedValues.password}
          onChange={(value) => setValue('password', value)}
          error={errors.password?.message}
          required
          autoComplete="current-password"
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <AuthSubmitButton
          isLoading={isLoading}
          disabled={isLoading || isOAuthLoading}
          loadingText="Signing in..."
        >
          Sign in
        </AuthSubmitButton>

        {/* Divider */}
        <FormDivider />

        {/* OAuth Button */}
        <OAuthButton
          provider="google"
          isLoading={isOAuthLoading}
          disabled={isLoading || isOAuthLoading}
          onClick={handleGoogleLogin}
        />

        {/* Test Credentials */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">Test Credentials</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div><strong>Patient:</strong> patient@test.com / password123</div>
            <div><strong>Dentist:</strong> dentist@test.com / password123</div>
            <div><strong>Admin:</strong> admin@test.com / password123</div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
