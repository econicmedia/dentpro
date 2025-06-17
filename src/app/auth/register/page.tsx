'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

import AuthLayout from '@/components/layout/AuthLayout';
import { 
  AuthFormField, 
  AuthSubmitButton, 
  OAuthButton, 
  FormDivider,
  RoleSelector,
  TermsCheckbox 
} from '@/components/forms';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual registration API call
      console.log('Registration data:', data);
      
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account.',
      });
      
      router.push('/auth/login?message=registration-success');
    } catch (error) {
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsOAuthLoading(true);

      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        toast.error('OAuth registration failed', {
          description: 'Please try again or use the registration form.',
        });
      } else if (result?.url) {
        toast.success('Registration successful!', {
          description: 'Welcome to DentCare Pro!',
        });
        router.push(result.url);
      }
    } catch (oauthError) {
      console.error('OAuth registration error:', oauthError);
      toast.error('OAuth registration failed', {
        description: 'Please try again or use the registration form.',
      });
    } finally {
      setIsOAuthLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join DentCare Pro and start managing your dental care"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OAuth Button */}
        <OAuthButton
          provider="google"
          isLoading={isOAuthLoading}
          disabled={isLoading || isOAuthLoading}
          onClick={handleGoogleRegister}
        >
          Sign up with Google
        </OAuthButton>

        {/* Divider */}
        <FormDivider text="or sign up with email" />

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthFormField
            label="First name"
            type="text"
            placeholder="Enter your first name"
            value={watchedValues.firstName}
            onChange={(value) => setValue('firstName', value)}
            error={errors.firstName?.message}
            required
            autoComplete="given-name"
          />
          
          <AuthFormField
            label="Last name"
            type="text"
            placeholder="Enter your last name"
            value={watchedValues.lastName}
            onChange={(value) => setValue('lastName', value)}
            error={errors.lastName?.message}
            required
            autoComplete="family-name"
          />
        </div>

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

        {/* Phone Field */}
        <AuthFormField
          label="Phone number"
          type="tel"
          placeholder="Enter your phone number (optional)"
          value={watchedValues.phone || ''}
          onChange={(value) => setValue('phone', value)}
          error={errors.phone?.message}
          autoComplete="tel"
        />

        {/* Role Selection */}
        <RoleSelector
          value={watchedValues.role}
          onChange={(role) => setValue('role', role as any)}
          error={errors.role?.message}
          disabled={isLoading || isOAuthLoading}
        />

        {/* Password Fields */}
        <div className="space-y-4">
          <AuthFormField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={watchedValues.password}
            onChange={(value) => setValue('password', value)}
            error={errors.password?.message}
            required
            autoComplete="new-password"
          />
          
          <AuthFormField
            label="Confirm password"
            type="password"
            placeholder="Confirm your password"
            value={watchedValues.confirmPassword}
            onChange={(value) => setValue('confirmPassword', value)}
            error={errors.confirmPassword?.message}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Terms Checkbox */}
        <TermsCheckbox
          checked={watchedValues.acceptTerms}
          onChange={(checked) => setValue('acceptTerms', checked)}
          error={errors.acceptTerms?.message}
          disabled={isLoading || isOAuthLoading}
        />

        {/* Submit Button */}
        <AuthSubmitButton
          isLoading={isLoading}
          disabled={isLoading || isOAuthLoading}
          loadingText="Creating account..."
        >
          Create account
        </AuthSubmitButton>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
