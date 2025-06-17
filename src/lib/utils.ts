import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { format, parseISO, isValid, differenceInMinutes, addMinutes, startOfDay, endOfDay } from 'date-fns';
import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and Time Utilities (temporarily commented out due to date-fns issues)
// TODO: Re-enable when date-fns is properly configured
export const dateUtils = {
  format: (date: Date | string, formatStr: string = 'MMM dd, yyyy') => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  },

  formatTime: (time: string) => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
  },

  formatDateTime: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  },

  isToday: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      return dateObj.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  },

  isFuture: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj > new Date();
    } catch {
      return false;
    }
  },

  isPast: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj < new Date();
    } catch {
      return false;
    }
  },

  getDuration: (startTime: string, endTime: string) => {
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    } catch {
      return 0;
    }
  },

  addMinutesToTime: (time: string, minutes: number) => {
    try {
      const [hours, mins] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, mins, 0, 0);
      date.setMinutes(date.getMinutes() + minutes);
      return date.toTimeString().slice(0, 5);
    } catch {
      return time;
    }
  },

  getStartOfDay: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const start = new Date(dateObj);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  getEndOfDay: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const end = new Date(dateObj);
    end.setHours(23, 59, 59, 999);
    return end;
  },
};

// String Utilities
export const stringUtils = {
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  capitalizeWords: (str: string) => {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  truncate: (str: string, length: number, suffix: string = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  initials: (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  formatPhoneNumber: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  maskEmail: (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  },
};

// Number Utilities
export const numberUtils = {
  formatCurrency: (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatNumber: (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  clamp: (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
  },

  randomBetween: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

// Array Utilities
export const arrayUtils = {
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

// Validation Utilities
export const validationUtils = {
  isEmail: (email: string): boolean => {
    return VALIDATION_RULES.EMAIL.test(email);
  },

  isPhone: (phone: string): boolean => {
    return VALIDATION_RULES.PHONE.test(phone);
  },

  isStrongPassword: (password: string): boolean => {
    return (
      password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  },

  validateRequired: (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return ERROR_MESSAGES.REQUIRED;
    }
    return null;
  },

  validateEmail: (email: string): string | null => {
    if (!email) return ERROR_MESSAGES.REQUIRED;
    if (!validationUtils.isEmail(email)) return ERROR_MESSAGES.INVALID_EMAIL;
    return null;
  },

  validatePhone: (phone: string): string | null => {
    if (!phone) return ERROR_MESSAGES.REQUIRED;
    if (!validationUtils.isPhone(phone)) return ERROR_MESSAGES.INVALID_PHONE;
    return null;
  },

  validatePassword: (password: string): string | null => {
    if (!password) return ERROR_MESSAGES.REQUIRED;
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }
    return null;
  },
};

// Debounce and Throttle Utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
