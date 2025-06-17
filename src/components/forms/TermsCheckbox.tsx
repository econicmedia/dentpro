'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onChange,
  error,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <button
          type="button"
          onClick={() => !disabled && onChange(!checked)}
          disabled={disabled}
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            checked
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-border/40 bg-background hover:border-primary/50',
            error && 'border-destructive'
          )}
          aria-checked={checked}
          role="checkbox"
        >
          {checked && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 text-sm">
          <label className={cn(
            'text-muted-foreground leading-relaxed cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}>
            I agree to the{' '}
            <Link
              href="/legal/terms"
              className="text-primary hover:text-primary/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link
              href="/legal/privacy"
              className="text-primary hover:text-primary/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            {' '}
            <span className="text-destructive">*</span>
          </label>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TermsCheckbox;
