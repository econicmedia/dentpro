import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Notification, NotificationType } from '@/types/common';

interface UIState {
  // Theme and Layout
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  sidebarOpen: boolean; // For mobile
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string;
  
  // Notifications
  notifications: Notification[];
  
  // Modals and Dialogs
  modals: Record<string, boolean>;
  
  // Page state
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
  
  reset: () => void;
}

interface Breadcrumb {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// Helper function to generate notification ID
const generateNotificationId = () => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'dark', // Default to dark theme
      sidebarCollapsed: false,
      sidebarOpen: false,
      globalLoading: false,
      loadingMessage: '',
      notifications: [],
      modals: {},
      pageTitle: 'Dentist Appointment Platform',
      breadcrumbs: [],

      // Theme and Layout Actions
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
          } else {
            root.classList.add(theme);
          }
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarOpen: (sidebarOpen) => {
        set({ sidebarOpen });
      },

      setSidebarCollapsed: (sidebarCollapsed) => {
        set({ sidebarCollapsed });
      },

      // Loading Actions
      setGlobalLoading: (globalLoading, loadingMessage = '') => {
        set({ globalLoading, loadingMessage });
      },

      // Notification Actions
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: generateNotificationId(),
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [...state.notifications, notification],
        }));

        // Auto-remove notification after duration (if specified)
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(notification.id);
          }, notification.duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Modal Actions
      openModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        }));
      },

      closeModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        }));
      },

      toggleModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: !state.modals[modalId] },
        }));
      },

      isModalOpen: (modalId) => {
        return get().modals[modalId] || false;
      },

      // Page State Actions
      setPageTitle: (pageTitle) => {
        set({ pageTitle });
        
        // Update document title
        if (typeof window !== 'undefined') {
          document.title = `${pageTitle} | Dentist Appointment Platform`;
        }
      },

      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },

      addBreadcrumb: (breadcrumb) => {
        set((state) => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb],
        }));
      },

      reset: () => {
        set({
          sidebarCollapsed: false,
          sidebarOpen: false,
          globalLoading: false,
          loadingMessage: '',
          notifications: [],
          modals: {},
          pageTitle: 'Dentist Appointment Platform',
          breadcrumbs: [],
        });
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Convenience hooks for specific UI features
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  return { theme, setTheme };
};

export const useSidebar = () => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  
  return {
    sidebarCollapsed,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    setSidebarCollapsed,
  };
};

export const useNotifications = () => {
  const notifications = useUIStore((state) => state.notifications);
  const addNotification = useUIStore((state) => state.addNotification);
  const removeNotification = useUIStore((state) => state.removeNotification);
  const clearNotifications = useUIStore((state) => state.clearNotifications);
  
  // Convenience methods for different notification types
  const showSuccess = (title: string, message?: string, duration = 5000) => {
    addNotification({
      type: NotificationType.SUCCESS,
      title,
      message,
      duration,
    });
  };

  const showError = (title: string, message?: string, duration = 0) => {
    addNotification({
      type: NotificationType.ERROR,
      title,
      message,
      duration,
    });
  };

  const showWarning = (title: string, message?: string, duration = 7000) => {
    addNotification({
      type: NotificationType.WARNING,
      title,
      message,
      duration,
    });
  };

  const showInfo = (title: string, message?: string, duration = 5000) => {
    addNotification({
      type: NotificationType.INFO,
      title,
      message,
      duration,
    });
  };
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export const useModals = () => {
  const modals = useUIStore((state) => state.modals);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const toggleModal = useUIStore((state) => state.toggleModal);
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  
  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
  };
};

export const usePageState = () => {
  const pageTitle = useUIStore((state) => state.pageTitle);
  const breadcrumbs = useUIStore((state) => state.breadcrumbs);
  const setPageTitle = useUIStore((state) => state.setPageTitle);
  const setBreadcrumbs = useUIStore((state) => state.setBreadcrumbs);
  const addBreadcrumb = useUIStore((state) => state.addBreadcrumb);
  
  return {
    pageTitle,
    breadcrumbs,
    setPageTitle,
    setBreadcrumbs,
    addBreadcrumb,
  };
};
