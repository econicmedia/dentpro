'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  showHome = true,
  maxItems = 5,
}) => {
  const router = useRouter();

  // Add home item if showHome is true and not already present
  const allItems = showHome && items[0]?.label !== 'Home'
    ? [{ label: 'Home', href: '/dashboard', icon: Home, current: false }, ...items]
    : items;

  // Truncate items if there are too many
  const displayItems = allItems.length > maxItems
    ? [
        allItems[0],
        { label: '...', href: undefined, current: false },
        ...allItems.slice(-maxItems + 2)
      ]
    : allItems;

  const handleClick = (item: BreadcrumbItem) => {
    if (item.href && !item.current) {
      router.push(item.href);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCurrent = item.current || isLast;
          const isEllipsis = item.label === '...';

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 flex-shrink-0">
                  {separator}
                </span>
              )}

              {isEllipsis ? (
                <span className="text-muted-foreground px-2">...</span>
              ) : (
                <div className="flex items-center">
                  {item.href && !isCurrent ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-1 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground',
                        'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(item);
                      }}
                    >
                      {item.icon && (
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        'flex items-center space-x-1 px-2 py-1 rounded-md',
                        isCurrent
                          ? 'text-foreground font-medium bg-accent/50'
                          : 'text-muted-foreground'
                      )}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {item.icon && (
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {item.label}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Hook to generate breadcrumbs from pathname
export const useBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
  
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  return { generateBreadcrumbs };
};

// Predefined breadcrumb configurations for common pages
export const breadcrumbConfigs: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Dashboard', current: true }
  ],
  '/appointments': [
    { label: 'Appointments', current: true }
  ],
  '/appointments/book': [
    { label: 'Appointments', href: '/appointments' },
    { label: 'Book Appointment', current: true }
  ],
  '/appointments/schedule': [
    { label: 'Appointments', href: '/appointments' },
    { label: 'Schedule', current: true }
  ],
  '/patients': [
    { label: 'Patients', current: true }
  ],
  '/patients/add': [
    { label: 'Patients', href: '/patients' },
    { label: 'Add Patient', current: true }
  ],
  '/documents': [
    { label: 'Documents', current: true }
  ],
  '/documents/upload': [
    { label: 'Documents', href: '/documents' },
    { label: 'Upload Document', current: true }
  ],
  '/profile': [
    { label: 'Profile', current: true }
  ],
  '/settings': [
    { label: 'Settings', current: true }
  ],
  '/practice': [
    { label: 'Practice Management', current: true }
  ],
  '/practice/hours': [
    { label: 'Practice Management', href: '/practice' },
    { label: 'Working Hours', current: true }
  ],
  '/practice/services': [
    { label: 'Practice Management', href: '/practice' },
    { label: 'Services', current: true }
  ],
  '/practice/staff': [
    { label: 'Practice Management', href: '/practice' },
    { label: 'Staff', current: true }
  ],
  '/admin': [
    { label: 'Administration', current: true }
  ],
  '/admin/users': [
    { label: 'Administration', href: '/admin' },
    { label: 'User Management', current: true }
  ],
  '/admin/settings': [
    { label: 'Administration', href: '/admin' },
    { label: 'System Settings', current: true }
  ],
  '/admin/audit': [
    { label: 'Administration', href: '/admin' },
    { label: 'Audit Logs', current: true }
  ],
};

// Component for automatic breadcrumb generation
export const AutoBreadcrumbs: React.FC<{
  pathname: string;
  className?: string;
}> = ({ pathname, className }) => {
  const { generateBreadcrumbs } = useBreadcrumbs();
  
  // Use predefined config if available, otherwise generate from pathname
  const items = breadcrumbConfigs[pathname] || generateBreadcrumbs(pathname);
  
  if (items.length === 0) return null;
  
  return <Breadcrumbs items={items} className={className} />;
};

export default Breadcrumbs;
