# Security Guidelines
## Dentist Appointment Management Platform

### 🔒 Security Overview
Comprehensive security framework ensuring HIPAA compliance, data protection, and secure healthcare information management for dental practice operations.

---

## 🔐 Authentication & Authorization

### **Google OAuth 2.0 Implementation**
```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};
```

### **Role-Based Access Control (RBAC)**
```typescript
// lib/rbac.ts
export enum UserRole {
  PATIENT = 'PATIENT',
  DENTIST = 'DENTIST',
  ADMIN = 'ADMIN'
}

export const permissions = {
  [UserRole.PATIENT]: [
    'appointments:read:own',
    'appointments:create:own',
    'appointments:update:own',
    'documents:read:own',
    'profile:read:own',
    'profile:update:own'
  ],
  [UserRole.DENTIST]: [
    'appointments:read:all',
    'appointments:update:all',
    'appointments:delete:all',
    'patients:read:all',
    'documents:create:all',
    'documents:read:all',
    'documents:update:all'
  ],
  [UserRole.ADMIN]: [
    '*' // All permissions
  ]
};

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const userPermissions = permissions[userRole];
  return userPermissions.includes('*') || userPermissions.includes(permission);
};
```

### **JWT Token Security**
```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check token expiration
    if (decoded.exp < Date.now() / 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    // Add user info to request headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    response.headers.set('x-user-role', decoded.role);
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

---

## 🛡️ Data Protection & HIPAA Compliance

### **Data Encryption**
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes key
const IV_LENGTH = 16; // AES block size

export class DataEncryption {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedData: string): string {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage for sensitive medical data
export const encryptMedicalData = (data: any) => {
  return DataEncryption.encrypt(JSON.stringify(data));
};

export const decryptMedicalData = (encryptedData: string) => {
  return JSON.parse(DataEncryption.decrypt(encryptedData));
};
```

### **Database Security (Prisma)**
```prisma
// prisma/schema.prisma
model PatientProfile {
  id                String    @id @default(cuid())
  userId            String    @unique
  // Encrypted fields for sensitive data
  medicalHistoryEnc String?   @map("medical_history_encrypted")
  allergiesEnc      String?   @map("allergies_encrypted")
  emergencyContactEnc String? @map("emergency_contact_encrypted")
  
  // Non-sensitive fields
  dateOfBirth       DateTime?
  phone             String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("patient_profiles")
}

// Row Level Security (RLS) policies
// Enable RLS on sensitive tables
-- SQL migration
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own data
CREATE POLICY patient_own_data ON patient_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Dentists can see all patient data
CREATE POLICY dentist_all_data ON patient_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('DENTIST', 'ADMIN')
    )
  );
```

### **Audit Logging**
```typescript
// lib/auditLog.ts
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  static async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    await prisma.auditLog.create({
      data: {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      }
    });
  }

  // Log sensitive operations
  static async logDataAccess(userId: string, resource: string, resourceId: string, request: Request) {
    await this.log({
      userId,
      action: 'DATA_ACCESS',
      resource,
      resourceId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });
  }
}
```

---

## 📁 File Upload Security

### **Secure File Upload**
```typescript
// lib/fileUpload.ts
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

// Allowed file types for medical documents
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/dicom' // Medical imaging format
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileUploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.dcm'];
    
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }
    
    cb(null, true);
  }
});

// Virus scanning integration
export const scanFile = async (fileBuffer: Buffer): Promise<boolean> => {
  // Integration with ClamAV or similar antivirus
  // Return true if file is clean, false if infected
  try {
    // Implement virus scanning logic
    return true; // Placeholder
  } catch (error) {
    console.error('Virus scan failed:', error);
    return false;
  }
};

// Secure file processing
export const processUploadedFile = async (file: Express.Multer.File, userId: string) => {
  // 1. Virus scan
  const isClean = await scanFile(file.buffer);
  if (!isClean) {
    throw new Error('File failed security scan');
  }

  // 2. Generate secure filename
  const fileExtension = path.extname(file.originalname);
  const secureFilename = `${crypto.randomUUID()}${fileExtension}`;

  // 3. Upload to secure storage (AWS S3 with encryption)
  const uploadResult = await uploadToS3({
    buffer: file.buffer,
    filename: secureFilename,
    contentType: file.mimetype,
    userId
  });

  return {
    filename: secureFilename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    url: uploadResult.url,
    key: uploadResult.key
  };
};
```

### **AWS S3 Secure Configuration**
```typescript
// lib/aws.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async ({
  buffer,
  filename,
  contentType,
  userId
}: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  userId: string;
}) => {
  const key = `documents/${userId}/${filename}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256', // Server-side encryption
    Metadata: {
      'uploaded-by': userId,
      'upload-date': new Date().toISOString(),
    },
    // Private access by default
    ACL: 'private'
  };

  const result = await s3.upload(params).promise();
  
  return {
    url: result.Location,
    key: result.Key,
    etag: result.ETag
  };
};

// Generate presigned URLs for secure file access
export const generatePresignedUrl = async (key: string, expiresIn: number = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Expires: expiresIn // 1 hour by default
  });
};
```

---

## 🌐 API Security

### **Rate Limiting**
```typescript
// middleware/rateLimiter.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (request: NextRequest) => {
    const key = config.keyGenerator 
      ? config.keyGenerator(request)
      : request.ip || 'anonymous';
    
    const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / config.windowMs)}`;
    
    const current = await redis.incr(windowKey);
    
    if (current === 1) {
      await redis.expire(windowKey, Math.ceil(config.windowMs / 1000));
    }
    
    if (current > config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + config.windowMs).toString()
          }
        }
      );
    }
    
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (config.maxRequests - current).toString());
    
    return response;
  };
};

// Different rate limits for different endpoints
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (req) => req.ip || 'anonymous'
});

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => req.headers.get('x-user-id') || req.ip || 'anonymous'
});
```

### **Input Validation & Sanitization**
```typescript
// lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Zod schemas for API validation
export const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  dentistId: z.string().uuid(),
  appointmentDate: z.string().datetime(),
  duration: z.number().min(15).max(240), // 15 minutes to 4 hours
  type: z.enum(['CONSULTATION', 'CLEANING', 'PROCEDURE', 'EMERGENCY']),
  notes: z.string().max(1000).optional(),
});

export const patientProfileSchema = z.object({
  dateOfBirth: z.string().datetime().optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
  address: z.string().max(500).optional(),
  emergencyContact: z.string().max(200).optional(),
  allergies: z.array(z.string().max(100)).max(20).optional(),
  medicalHistory: z.string().max(5000).optional(),
});

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []
  });
};

// SQL injection prevention (using Prisma's built-in protection)
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const parsed = schema.parse(data);
  
  // Sanitize string fields
  const sanitized = Object.entries(parsed as any).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = sanitizeInput(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
  
  return sanitized;
};
```

### **CORS Configuration**
```typescript
// middleware/cors.ts
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
];

export const corsMiddleware = (request: NextRequest) => {
  const origin = request.headers.get('origin');
  
  // Check if origin is allowed
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { error: 'CORS policy violation' },
      { status: 403 }
    );
  }
  
  const response = NextResponse.next();
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
};
```

---

## 🔍 Security Monitoring

### **Security Headers**
```typescript
// middleware/security.ts
import { NextResponse } from 'next/server';

export const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // HSTS (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.yourdomain.com",
    "frame-src https://accounts.google.com"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export const addSecurityHeaders = (response: NextResponse) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
};
```

### **Error Handling & Logging**
```typescript
// lib/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from './auditLog';

export class SecurityError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403,
    public code: string = 'SECURITY_ERROR'
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

export const handleSecurityError = async (
  error: Error,
  request: NextRequest,
  userId?: string
) => {
  // Log security incidents
  await AuditLogger.log({
    userId: userId || 'anonymous',
    action: 'SECURITY_INCIDENT',
    resource: 'system',
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method
    }
  });

  // Don't expose internal error details
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction ? 'Security error occurred' : error.message;

  return NextResponse.json(
    { error: errorMessage },
    { status: error instanceof SecurityError ? error.statusCode : 500 }
  );
};
```

---

## 🔐 Environment Security

### **Environment Variables**
```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dentist_app"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Encryption
ENCRYPTION_KEY="your-32-byte-encryption-key"
JWT_SECRET="your-jwt-secret"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket-name"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"

# SMS
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
```

### **Security Checklist**
- [ ] All environment variables are properly secured
- [ ] Database connections use SSL/TLS
- [ ] API endpoints require authentication
- [ ] File uploads are scanned for viruses
- [ ] Sensitive data is encrypted at rest
- [ ] Rate limiting is implemented
- [ ] CORS is properly configured
- [ ] Security headers are set
- [ ] Input validation is comprehensive
- [ ] Audit logging is enabled
- [ ] Error handling doesn't expose sensitive information
- [ ] Regular security audits are scheduled
- [ ] Dependency vulnerabilities are monitored
- [ ] HIPAA compliance requirements are met
- [ ] Data backup and recovery procedures are in place
