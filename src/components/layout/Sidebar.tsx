'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/uiStore';
import { useAuth } from '@/store/authStore';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  FileText,
  Settings,
  Home,
  User,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: UserRole[];
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
    children: [
      {
        name: 'My Appointments',
        href: '/appointments',
        icon: Calendar,
        roles: [UserRole.PATIENT],
      },
      {
        name: 'Book Appointment',
        href: '/appointments/book',
        icon: Calendar,
        roles: [UserRole.PATIENT],
      },
      {
        name: 'All Appointments',
        href: '/appointments',
        icon: Calendar,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
      {
        name: 'Schedule',
        href: '/appointments/schedule',
        icon: ClipboardList,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Users,
    roles: [UserRole.DENTIST, UserRole.ADMIN],
    children: [
      {
        name: 'All Patients',
        href: '/patients',
        icon: Users,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
      {
        name: 'Add Patient',
        href: '/patients/add',
        icon: User,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
    children: [
      {
        name: 'My Documents',
        href: '/documents',
        icon: FileText,
        roles: [UserRole.PATIENT],
      },
      {
        name: 'Patient Documents',
        href: '/documents',
        icon: FileText,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
      {
        name: 'Upload Document',
        href: '/documents/upload',
        icon: FileText,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: 3,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: [UserRole.DENTIST, UserRole.ADMIN],
  },
  {
    name: 'Practice Management',
    href: '/practice',
    icon: Stethoscope,
    roles: [UserRole.DENTIST, UserRole.ADMIN],
    children: [
      {
        name: 'Working Hours',
        href: '/practice/hours',
        icon: Calendar,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
      {
        name: 'Services',
        href: '/practice/services',
        icon: ClipboardList,
        roles: [UserRole.DENTIST, UserRole.ADMIN],
      },
      {
        name: 'Staff',
        href: '/practice/staff',
        icon: Users,
        roles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Administration',
    href: '/admin',
    icon: Shield,
    roles: [UserRole.ADMIN],
    children: [
      {
        name: 'User Management',
        href: '/admin/users',
        icon: Users,
        roles: [UserRole.ADMIN],
      },
      {
        name: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
        roles: [UserRole.ADMIN],
      },
      {
        name: 'Audit Logs',
        href: '/admin/audit',
        icon: FileText,
        roles: [UserRole.ADMIN],
      },
    ],
  },
];

const bottomNavigation: NavigationItem[] = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    roles: [UserRole.PATIENT, UserRole.DENTIST, UserRole.ADMIN],
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuth();

  const filterNavigationByRole = (items: NavigationItem[]): NavigationItem[] => {
    if (!user) return [];

    return items.filter(item => {
      if (!item.roles || item.roles.includes(user.role)) {
        if (item.children) {
          item.children = filterNavigationByRole(item.children);
        }
        return true;
      }
      return false;
    });
  };

  const filteredNavigation = filterNavigationByRole(navigation);
  const filteredBottomNavigation = filterNavigationByRole(bottomNavigation);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const NavItem: React.FC<{ item: NavigationItem; level?: number }> = ({ 
    item, 
    level = 0 
  }) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isParentActive = hasChildren && item.children?.some(child => isActive(child.href));

    return (
      <div>
        <Link
          href={item.href}
          className={cn(
            'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
            level > 0 && 'ml-4 pl-6',
            active || isParentActive
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground',
            sidebarCollapsed && level === 0 && 'justify-center px-2'
          )}
          onClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        >
          <item.icon
            className={cn(
              'h-5 w-5 shrink-0',
              sidebarCollapsed && level === 0 ? 'mr-0' : 'mr-3'
            )}
          />
          {(!sidebarCollapsed || level > 0) && (
            <>
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </Link>

        {/* Render children if not collapsed or if it's a nested item */}
        {hasChildren && (!sidebarCollapsed || level > 0) && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-background border-r border-border transition-all duration-300 ease-in-out hidden md:flex flex-col',
          sidebarCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Logo and toggle */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">DentistApp</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-border p-4 space-y-2">
          {filteredBottomNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 bg-background border-r border-border transition-transform duration-300 ease-in-out md:hidden flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">DentistApp</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-border p-4 space-y-2">
          {filteredBottomNavigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
