// Application Constants

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const SESSION_STORAGE_KEY = 'user_session';
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// User Roles
export const USER_ROLES = {
  PATIENT: 'PATIENT',
  DENTIST: 'DENTIST',
  ADMIN: 'ADMIN',
} as const;

// Appointment Configuration
export const APPOINTMENT_DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
];

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'CONSULTATION',
  CLEANING: 'CLEANING',
  FILLING: 'FILLING',
  ROOT_CANAL: 'ROOT_CANAL',
  EXTRACTION: 'EXTRACTION',
  CROWN: 'CROWN',
  BRIDGE: 'BRIDGE',
  IMPLANT: 'IMPLANT',
  ORTHODONTICS: 'ORTHODONTICS',
  EMERGENCY: 'EMERGENCY',
  FOLLOW_UP: 'FOLLOW_UP',
  CHECKUP: 'CHECKUP',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
  RESCHEDULED: 'RESCHEDULED',
} as const;

export const APPOINTMENT_PRIORITY = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

// Document Configuration
export const DOCUMENT_CATEGORIES = {
  XRAY: 'XRAY',
  PHOTO: 'PHOTO',
  REPORT: 'REPORT',
  PRESCRIPTION: 'PRESCRIPTION',
  INSURANCE: 'INSURANCE',
  CONSENT_FORM: 'CONSENT_FORM',
  TREATMENT_PLAN: 'TREATMENT_PLAN',
  INVOICE: 'INVOICE',
  RECEIPT: 'RECEIPT',
  LAB_RESULT: 'LAB_RESULT',
  REFERRAL: 'REFERRAL',
  OTHER: 'OTHER',
} as const;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/dicom',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_UPLOAD = 5;

// UI Configuration
export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 80;
export const HEADER_HEIGHT = 64;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Notification Configuration
export const NOTIFICATION_DURATION = {
  SUCCESS: 5000,
  ERROR: 0, // Persistent
  WARNING: 7000,
  INFO: 5000,
} as const;

// Date and Time Configuration
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const TIME_ZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
] as const;

// Working Hours Configuration
export const DEFAULT_WORKING_HOURS = {
  monday: [{ start: '09:00', end: '17:00' }],
  tuesday: [{ start: '09:00', end: '17:00' }],
  wednesday: [{ start: '09:00', end: '17:00' }],
  thursday: [{ start: '09:00', end: '17:00' }],
  friday: [{ start: '09:00', end: '17:00' }],
  saturday: [],
  sunday: [],
};

export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const time = `${hour.toString().padStart(2, '0')}:${minute}`;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const display = `${displayHour}:${minute} ${ampm}`;
  return { value: time, label: display };
});

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 2000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`,
  NOTES_TOO_LONG: `Notes must be less than ${VALIDATION_RULES.NOTES_MAX_LENGTH} characters`,
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'File type not supported',
  TOO_MANY_FILES: `Maximum ${MAX_FILES_PER_UPLOAD} files allowed`,
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: 'Appointment created successfully',
  APPOINTMENT_UPDATED: 'Appointment updated successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_CHAT: false,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_PAYMENT_PROCESSING: false,
  ENABLE_INSURANCE_INTEGRATION: false,
} as const;

// Environment Configuration
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

// External Service URLs
export const EXTERNAL_URLS = {
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  SUPPORT: '/support',
  DOCUMENTATION: '/docs',
  STATUS_PAGE: 'https://status.example.com',
} as const;
