import { User } from './auth';
import { Appointment } from './appointment';

// Document Category Enum
export enum DocumentCategory {
  XRAY = 'XRAY',
  PHOTO = 'PHOTO',
  REPORT = 'REPORT',
  PRESCRIPTION = 'PRESCRIPTION',
  INSURANCE = 'INSURANCE',
  CONSENT_FORM = 'CONSENT_FORM',
  TREATMENT_PLAN = 'TREATMENT_PLAN',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  LAB_RESULT = 'LAB_RESULT',
  REFERRAL = 'REFERRAL',
  OTHER = 'OTHER'
}

// Document Status
export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

// Document Access Level
export enum DocumentAccessLevel {
  PRIVATE = 'PRIVATE',     // Only patient and assigned dentist
  PRACTICE = 'PRACTICE',   // All dentists in practice
  PUBLIC = 'PUBLIC'        // Patient can share with others
}

// Main Document Interface
export interface Document {
  id: string;
  patientId: string;
  uploadedById: string; // User who uploaded (patient or dentist)
  appointmentId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  category: DocumentCategory;
  status: DocumentStatus;
  accessLevel: DocumentAccessLevel;
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: DocumentMetadata;
  url: string;
  thumbnailUrl?: string;
  downloadCount: number;
  isEncrypted: boolean;
  encryptionKey?: string;
  checksum: string; // For integrity verification
  virusScanResult?: VirusScanResult;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // Relations
  patient: User;
  uploadedBy: User;
  appointment?: Appointment;
  versions?: DocumentVersion[];
  shares?: DocumentShare[];
}

// Document Metadata
export interface DocumentMetadata {
  width?: number;
  height?: number;
  pages?: number;
  duration?: number; // for videos
  resolution?: string;
  colorSpace?: string;
  compression?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  createdDate?: Date;
  modifiedDate?: Date;
  application?: string;
  [key: string]: any; // Allow additional metadata
}

// Virus Scan Result
export interface VirusScanResult {
  isClean: boolean;
  scanDate: Date;
  engine: string;
  version: string;
  threats?: string[];
}

// Document Version (for version control)
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  filename: string;
  size: number;
  url: string;
  checksum: string;
  uploadedById: string;
  changeLog?: string;
  createdAt: Date;
  
  // Relations
  document: Document;
  uploadedBy: User;
}

// Document Sharing
export interface DocumentShare {
  id: string;
  documentId: string;
  sharedById: string;
  sharedWithId?: string; // Specific user
  sharedWithEmail?: string; // External email
  accessLevel: 'VIEW' | 'DOWNLOAD' | 'EDIT';
  expiresAt?: Date;
  password?: string;
  downloadLimit?: number;
  downloadCount: number;
  isActive: boolean;
  createdAt: Date;
  lastAccessedAt?: Date;
  
  // Relations
  document: Document;
  sharedBy: User;
  sharedWith?: User;
}

// Document Upload Types
export interface DocumentUploadData {
  file: File;
  patientId: string;
  appointmentId?: string;
  category: DocumentCategory;
  title?: string;
  description?: string;
  tags?: string[];
  accessLevel?: DocumentAccessLevel;
}

export interface DocumentUpdateData {
  title?: string;
  description?: string;
  tags?: string[];
  category?: DocumentCategory;
  accessLevel?: DocumentAccessLevel;
  status?: DocumentStatus;
}

// Document Search and Filters
export interface DocumentFilters {
  category?: DocumentCategory[];
  status?: DocumentStatus[];
  accessLevel?: DocumentAccessLevel[];
  patientId?: string;
  appointmentId?: string;
  uploadedById?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  mimeType?: string[];
  search?: string;
}

export interface DocumentSearchParams {
  query?: string;
  filters?: DocumentFilters;
  sortBy?: 'name' | 'date' | 'size' | 'category' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Document Statistics
export interface DocumentStats {
  total: number;
  byCategory: Record<DocumentCategory, number>;
  byStatus: Record<DocumentStatus, number>;
  totalSize: number; // in bytes
  recentUploads: number;
  sharedDocuments: number;
  expiringSoon: number;
}

// Bulk Operations
export interface BulkDocumentOperation {
  documentIds: string[];
  operation: 'delete' | 'archive' | 'approve' | 'reject' | 'updateCategory' | 'updateTags';
  data?: {
    category?: DocumentCategory;
    tags?: string[];
    reason?: string;
  };
}

// Document Template (for generating documents)
export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  template: string; // HTML template
  variables: TemplateVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  label: string;
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Document Generation
export interface GenerateDocumentData {
  templateId: string;
  patientId: string;
  appointmentId?: string;
  variables: Record<string, any>;
  title?: string;
  description?: string;
}

// API Response Types
export interface DocumentResponse {
  success: boolean;
  document?: Document;
  message?: string;
  errors?: string[];
}

export interface DocumentsListResponse {
  success: boolean;
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  uploadProgress?: number;
  message?: string;
  errors?: string[];
}

export interface DocumentShareResponse {
  success: boolean;
  share?: DocumentShare;
  shareUrl?: string;
  message?: string;
  errors?: string[];
}

// File Upload Progress
export interface UploadProgress {
  documentId?: string;
  filename: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  estimatedTimeRemaining?: number; // in seconds
}
