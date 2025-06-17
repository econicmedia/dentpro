import { User, PatientProfile, DentistProfile } from './auth';

// Appointment Status Enum
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED'
}

// Appointment Type Enum
export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  CLEANING = 'CLEANING',
  FILLING = 'FILLING',
  ROOT_CANAL = 'ROOT_CANAL',
  EXTRACTION = 'EXTRACTION',
  CROWN = 'CROWN',
  BRIDGE = 'BRIDGE',
  IMPLANT = 'IMPLANT',
  ORTHODONTICS = 'ORTHODONTICS',
  EMERGENCY = 'EMERGENCY',
  FOLLOW_UP = 'FOLLOW_UP',
  CHECKUP = 'CHECKUP'
}

// Priority Level
export enum AppointmentPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Main Appointment Interface
export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  appointmentDate: Date;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  duration: number;  // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  title?: string;
  description?: string;
  notes?: string;
  symptoms?: string[];
  treatmentPlan?: string;
  cost?: number;
  isPaid?: boolean;
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  patient: User & { patientProfile: PatientProfile };
  dentist: User & { dentistProfile: DentistProfile };
  documents?: AppointmentDocument[];
  prescriptions?: Prescription[];
}

// Appointment Document
export interface AppointmentDocument {
  id: string;
  appointmentId: string;
  documentId: string;
  createdAt: Date;
  
  // Relations
  appointment: Appointment;
  document: Document;
}

// Prescription
export interface Prescription {
  id: string;
  appointmentId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  appointment: Appointment;
}

// Appointment Creation/Update Types
export interface CreateAppointmentData {
  patientId: string;
  dentistId: string;
  appointmentDate: Date;
  startTime: string;
  duration: number;
  type: AppointmentType;
  priority?: AppointmentPriority;
  title?: string;
  description?: string;
  notes?: string;
  symptoms?: string[];
}

export interface UpdateAppointmentData {
  appointmentDate?: Date;
  startTime?: string;
  duration?: number;
  type?: AppointmentType;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  title?: string;
  description?: string;
  notes?: string;
  symptoms?: string[];
  treatmentPlan?: string;
  cost?: number;
  isPaid?: boolean;
}

// Calendar and Scheduling Types
export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  appointmentId?: string;
}

export interface DaySchedule {
  date: Date;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
}

export interface WeekSchedule {
  startDate: Date;
  endDate: Date;
  days: DaySchedule[];
}

export interface AvailabilityQuery {
  dentistId: string;
  date: Date;
  duration: number;
  type?: AppointmentType;
}

export interface AvailableSlot {
  start: string;
  end: string;
  duration: number;
}

// Appointment Filters and Search
export interface AppointmentFilters {
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  priority?: AppointmentPriority[];
  patientId?: string;
  dentistId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface AppointmentSearchParams {
  query?: string;
  filters?: AppointmentFilters;
  sortBy?: 'date' | 'status' | 'type' | 'priority' | 'patient' | 'dentist';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Appointment Statistics
export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayAppointments: number;
  upcomingAppointments: number;
  overdueAppointments: number;
}

// Recurring Appointment Types
export enum RecurrenceType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // Every X days/weeks/months/years
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number;   // 1-31
}

export interface RecurringAppointment {
  id: string;
  patientId: string;
  dentistId: string;
  startDate: Date;
  startTime: string;
  duration: number;
  type: AppointmentType;
  recurrencePattern: RecurrencePattern;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Generated appointments
  appointments: Appointment[];
}

// API Response Types
export interface AppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  message?: string;
  errors?: string[];
}

export interface AppointmentsListResponse {
  success: boolean;
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailabilityResponse {
  success: boolean;
  availableSlots: AvailableSlot[];
  date: Date;
  dentistId: string;
}
