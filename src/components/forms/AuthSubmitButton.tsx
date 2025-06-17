'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  onClick?: () => void;
  loadingText?: string;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  type = 'submit',
  variant = 'default',
  size = 'default',
  className,
  onClick,
  loadingText = 'Please wait...',
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'glass-button w-full relative',
        'transition-all duration-300 ease-in-out',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default AuthSubmitButton;
