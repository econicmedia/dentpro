# Document Structure
## Dentist Appointment Management Platform

### 📁 Project Directory Structure

```
dentist-appointment-platform/
├── 📁 frontend/                          # Next.js Frontend Application
│   ├── 📁 public/                        # Static assets
│   │   ├── 📁 icons/                     # SVG icons and favicons
│   │   ├── 📁 images/                    # Static images
│   │   └── 📁 fonts/                     # Custom font files
│   ├── 📁 src/                           # Source code
│   │   ├── 📁 app/                       # Next.js App Router
│   │   │   ├── 📁 (auth)/                # Auth route group
│   │   │   │   ├── 📁 login/
│   │   │   │   └── 📁 register/
│   │   │   ├── 📁 (dashboard)/           # Dashboard route group
│   │   │   │   ├── 📁 appointments/
│   │   │   │   ├── 📁 patients/
│   │   │   │   ├── 📁 documents/
│   │   │   │   └── 📁 profile/
│   │   │   ├── 📁 (admin)/               # Admin route group
│   │   │   │   ├── 📁 manage-appointments/
│   │   │   │   ├── 📁 patient-management/
│   │   │   │   └── 📁 settings/
│   │   │   ├── 📁 api/                   # API routes
│   │   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 appointments/
│   │   │   │   ├── 📁 patients/
│   │   │   │   └── 📁 documents/
│   │   │   ├── layout.tsx                # Root layout
│   │   │   ├── page.tsx                  # Home page
│   │   │   ├── loading.tsx               # Global loading UI
│   │   │   ├── error.tsx                 # Global error UI
│   │   │   └── not-found.tsx             # 404 page
│   │   ├── 📁 components/                # React components
│   │   │   ├── 📁 ui/                    # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── select.tsx
│   │   │   ├── 📁 common/                # Reusable components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   ├── 📁 forms/                 # Form components
│   │   │   │   ├── AppointmentForm.tsx
│   │   │   │   ├── PatientProfileForm.tsx
│   │   │   │   └── DocumentUploadForm.tsx
│   │   │   ├── 📁 layout/                # Layout components
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   └── AdminLayout.tsx
│   │   │   └── 📁 features/              # Feature-specific components
│   │   │       ├── 📁 appointments/
│   │   │       │   ├── AppointmentCard.tsx
│   │   │       │   ├── AppointmentList.tsx
│   │   │       │   ├── CalendarView.tsx
│   │   │       │   └── BookingModal.tsx
│   │   │       ├── 📁 patients/
│   │   │       │   ├── PatientCard.tsx
│   │   │       │   ├── PatientList.tsx
│   │   │       │   └── PatientProfile.tsx
│   │   │       └── 📁 documents/
│   │   │           ├── DocumentCard.tsx
│   │   │           ├── DocumentList.tsx
│   │   │           └── DocumentViewer.tsx
│   │   ├── 📁 lib/                       # Utility libraries
│   │   │   ├── auth.ts                   # Authentication utilities
│   │   │   ├── db.ts                     # Database connection
│   │   │   ├── utils.ts                  # General utilities
│   │   │   ├── validations.ts            # Zod schemas
│   │   │   └── constants.ts              # App constants
│   │   ├── 📁 hooks/                     # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAppointments.ts
│   │   │   ├── usePatients.ts
│   │   │   └── useDocuments.ts
│   │   ├── 📁 store/                     # State management
│   │   │   ├── authStore.ts              # Zustand auth store
│   │   │   ├── appointmentStore.ts       # Appointment state
│   │   │   └── uiStore.ts                # UI state
│   │   ├── 📁 styles/                    # Styling files
│   │   │   ├── globals.css               # Global styles
│   │   │   ├── components.css            # Component styles
│   │   │   └── animations.css            # Animation definitions
│   │   └── 📁 types/                     # TypeScript type definitions
│   │       ├── auth.ts
│   │       ├── appointment.ts
│   │       ├── patient.ts
│   │       └── document.ts
│   ├── 📄 package.json                   # Dependencies and scripts
│   ├── 📄 next.config.js                 # Next.js configuration
│   ├── 📄 tailwind.config.js             # Tailwind CSS configuration
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   └── 📄 .env.local                     # Environment variables
├── 📁 backend/                           # Express.js Backend API
│   ├── 📁 src/                           # Source code
│   │   ├── 📁 controllers/               # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── appointmentController.ts
│   │   │   ├── patientController.ts
│   │   │   └── documentController.ts
│   │   ├── 📁 middleware/                # Express middleware
│   │   │   ├── auth.ts                   # Authentication middleware
│   │   │   ├── validation.ts             # Request validation
│   │   │   ├── errorHandler.ts           # Error handling
│   │   │   └── rateLimiter.ts            # Rate limiting
│   │   ├── 📁 routes/                    # API routes
│   │   │   ├── auth.ts
│   │   │   ├── appointments.ts
│   │   │   ├── patients.ts
│   │   │   └── documents.ts
│   │   ├── 📁 services/                  # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── appointmentService.ts
│   │   │   ├── patientService.ts
│   │   │   ├── documentService.ts
│   │   │   └── emailService.ts
│   │   ├── 📁 models/                    # Database models (Prisma)
│   │   │   └── schema.prisma
│   │   ├── 📁 utils/                     # Utility functions
│   │   │   ├── logger.ts
│   │   │   ├── encryption.ts
│   │   │   ├── fileUpload.ts
│   │   │   └── dateUtils.ts
│   │   ├── 📁 config/                    # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── aws.ts
│   │   └── 📄 server.ts                  # Express server entry point
│   ├── 📁 prisma/                        # Prisma database files
│   │   ├── 📄 schema.prisma              # Database schema
│   │   ├── 📁 migrations/                # Database migrations
│   │   └── 📄 seed.ts                    # Database seeding
│   ├── 📄 package.json                   # Dependencies and scripts
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   └── 📄 .env                           # Environment variables
├── 📁 docs/                              # Project documentation
│   ├── 📄 Project_Requirement_Document.md
│   ├── 📄 Tech_Stack_Document.md
│   ├── 📄 Front_End_Guidelines.md
│   ├── 📄 Document_Structure.md
│   ├── 📄 Security_Guidelines.md
│   ├── 📄 Project_Rules.md
│   ├── 📄 Project_Progress_Log.md
│   ├── 📄 Task_Queue.md
│   └── 📄 API_Documentation.md
├── 📁 tests/                             # Test files
│   ├── 📁 frontend/                      # Frontend tests
│   │   ├── 📁 __tests__/                 # Jest tests
│   │   ├── 📁 e2e/                       # Playwright E2E tests
│   │   └── 📁 components/                # Component tests
│   └── 📁 backend/                       # Backend tests
│       ├── 📁 unit/                      # Unit tests
│       ├── 📁 integration/               # Integration tests
│       └── 📁 fixtures/                  # Test data
├── 📁 .github/                           # GitHub workflows
│   └── 📁 workflows/                     # CI/CD pipelines
│       ├── 📄 frontend-deploy.yml
│       ├── 📄 backend-deploy.yml
│       └── 📄 tests.yml
├── 📄 docker-compose.yml                 # Docker development setup
├── 📄 .gitignore                         # Git ignore rules
├── 📄 README.md                          # Project documentation
└── 📄 LICENSE                            # Project license
```

---

## 📝 File Naming Conventions

### **General Rules**
- Use **PascalCase** for React components: `AppointmentCard.tsx`
- Use **camelCase** for utilities and hooks: `useAuth.ts`, `dateUtils.ts`
- Use **kebab-case** for pages and routes: `manage-appointments/page.tsx`
- Use **UPPER_CASE** for constants: `API_ENDPOINTS.ts`
- Use **lowercase** for configuration files: `next.config.js`

### **Component Files**
```
✅ Good Examples:
- AppointmentCard.tsx
- PatientProfileForm.tsx
- DocumentUploadModal.tsx
- CalendarView.tsx

❌ Bad Examples:
- appointmentCard.tsx
- patient-profile-form.tsx
- documentuploadmodal.tsx
```

### **Utility Files**
```
✅ Good Examples:
- authUtils.ts
- dateHelpers.ts
- apiClient.ts
- validationSchemas.ts

❌ Bad Examples:
- AuthUtils.ts
- date-helpers.ts
- api_client.ts
```

### **Page Files (Next.js App Router)**
```
✅ Good Examples:
- page.tsx (for route pages)
- layout.tsx (for layouts)
- loading.tsx (for loading UI)
- error.tsx (for error UI)
- not-found.tsx (for 404 pages)
```

---

## 🧩 Component Organization

### **Component Structure Pattern**
```typescript
// AppointmentCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentCardProps } from '@/types/appointment';

// Component interface
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
}

// Main component
export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onCancel,
  className
}) => {
  // Component logic here
  return (
    <Card className={className}>
      {/* Component JSX */}
    </Card>
  );
};

// Default export
export default AppointmentCard;
```

### **Index File Pattern**
```typescript
// components/features/appointments/index.ts
export { AppointmentCard } from './AppointmentCard';
export { AppointmentList } from './AppointmentList';
export { CalendarView } from './CalendarView';
export { BookingModal } from './BookingModal';

// Usage in other files
import { AppointmentCard, AppointmentList } from '@/components/features/appointments';
```

---

## 📊 Database Schema Organization

### **Prisma Schema Structure**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(PATIENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  patientProfile PatientProfile?
  dentistProfile DentistProfile?
  appointments   Appointment[]
  documents      Document[]
  
  @@map("users")
}

// Patient-specific data
model PatientProfile {
  id           String    @id @default(cuid())
  userId       String    @unique
  dateOfBirth  DateTime?
  phone        String?
  address      String?
  emergencyContact String?
  medicalHistory Json?
  allergies    String[]
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("patient_profiles")
}

// Dentist-specific data
model DentistProfile {
  id           String @id @default(cuid())
  userId       String @unique
  licenseNumber String @unique
  specialization String[]
  workingHours Json
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("dentist_profiles")
}

enum UserRole {
  PATIENT
  DENTIST
  ADMIN
}
```

---

## 🔧 Configuration Files

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/store/*": ["./src/store/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### **Next.js Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 's3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 📋 Import/Export Standards

### **Import Order**
```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

// 2. Third-party library imports
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AppointmentService } from '@/lib/services';

// 4. Relative imports
import './ComponentName.css';

// 5. Type imports (separate from value imports)
import type { Appointment } from '@/types/appointment';
import type { ComponentProps } from './types';
```

### **Export Patterns**
```typescript
// Named exports (preferred for components)
export const AppointmentCard = () => { /* ... */ };
export const AppointmentList = () => { /* ... */ };

// Default export (for pages and main components)
const AppointmentPage = () => { /* ... */ };
export default AppointmentPage;

// Type exports
export type { AppointmentCardProps } from './types';
```

---

## 🗂️ Asset Organization

### **Static Assets Structure**
```
public/
├── icons/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── logo.svg
│   └── social-icons/
├── images/
│   ├── hero/
│   ├── testimonials/
│   └── placeholders/
└── fonts/
    ├── inter/
    ├── poppins/
    └── jetbrains-mono/
```

### **Asset Naming**
- Use **kebab-case** for file names: `hero-background.jpg`
- Include size in name when multiple sizes: `logo-32x32.png`
- Use descriptive names: `patient-dashboard-screenshot.png`
- Optimize images before adding to project

---

## 📚 Documentation Standards

### **Component Documentation**
```typescript
/**
 * AppointmentCard Component
 * 
 * Displays appointment information in a card format with actions
 * for editing and canceling appointments.
 * 
 * @param appointment - The appointment object to display
 * @param onEdit - Callback function when edit button is clicked
 * @param onCancel - Callback function when cancel button is clicked
 * @param className - Additional CSS classes to apply
 * 
 * @example
 * <AppointmentCard
 *   appointment={appointment}
 *   onEdit={(id) => handleEdit(id)}
 *   onCancel={(id) => handleCancel(id)}
 * />
 */
```

### **API Documentation**
```typescript
/**
 * GET /api/appointments
 * 
 * Retrieves appointments for the authenticated user
 * 
 * @query {string} date - Filter by specific date (YYYY-MM-DD)
 * @query {string} status - Filter by appointment status
 * @query {number} limit - Number of appointments to return (default: 10)
 * @query {number} offset - Number of appointments to skip (default: 0)
 * 
 * @returns {Appointment[]} Array of appointment objects
 * 
 * @throws {401} Unauthorized - User not authenticated
 * @throws {403} Forbidden - User doesn't have permission
 * @throws {500} Internal Server Error - Database error
 */
```

---

## 🔄 Version Control Standards

### **Git Branch Naming**
- **Feature branches**: `feature/appointment-booking`
- **Bug fixes**: `fix/calendar-display-issue`
- **Hotfixes**: `hotfix/security-patch`
- **Release branches**: `release/v1.2.0`

### **Commit Message Format**
```
type(scope): description

feat(appointments): add appointment booking functionality
fix(auth): resolve Google OAuth redirect issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): optimize database queries
test(components): add unit tests for AppointmentCard
```

### **File Organization Best Practices**
- Keep related files together in feature folders
- Use index files for clean imports
- Separate concerns (components, hooks, utilities)
- Follow consistent naming conventions
- Document complex file structures
- Regular cleanup of unused files
