'use client';

import React from 'react';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';
import { User, Stethoscope } from 'lucide-react';

interface RoleSelectorProps {
  value: UserRole | '' | 'PATIENT' | 'DENTIST';
  onChange: (role: UserRole) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  className,
}) => {
  const roles = [
    {
      value: UserRole.PATIENT,
      label: 'Patient',
      description: 'Book appointments and manage your dental care',
      icon: User,
    },
    {
      value: UserRole.DENTIST,
      label: 'Dentist',
      description: 'Manage practice, patients, and appointments',
      icon: Stethoscope,
    },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium text-foreground">
        I am a <span className="text-destructive">*</span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.value;
          
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => !disabled && onChange(role.value)}
              disabled={disabled}
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-200',
                'text-left hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border/40 bg-background/50 text-muted-foreground hover:text-foreground',
                error && 'border-destructive'
              )}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-medium text-sm',
                    isSelected ? 'text-foreground' : 'text-foreground'
                  )}>
                    {role.label}
                  </h3>
                  <p className={cn(
                    'text-xs mt-1',
                    isSelected ? 'text-muted-foreground' : 'text-muted-foreground'
                  )}>
                    {role.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
