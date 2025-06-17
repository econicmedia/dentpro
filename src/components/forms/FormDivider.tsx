'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormDividerProps {
  text?: string;
  className?: string;
}

const FormDivider: React.FC<FormDividerProps> = ({
  text = 'or',
  className,
}) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex-1 border-t border-border/40" />
      <div className="px-4">
        <span className="text-sm text-muted-foreground bg-background px-2">
          {text}
        </span>
      </div>
      <div className="flex-1 border-t border-border/40" />
    </div>
  );
};

export default FormDivider;
