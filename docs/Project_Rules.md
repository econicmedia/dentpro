# Project Rules
## Dentist Appointment Management Platform

### 🚨 CRITICAL EXECUTION PROTOCOL
**These rules are MANDATORY and must be followed without exception during development.**

---

## 🧠 Anti-Hallucination Rules

### **🔴 ABSOLUTE PROHIBITIONS**
1. **NO FABRICATED DATA**: Never create fake patient data, appointment records, or medical information
2. **NO ASSUMED ENDPOINTS**: Never assume API endpoints exist without verification
3. **NO INVENTED LIBRARIES**: Only use documented, verified npm packages and libraries
4. **NO FICTIONAL FEATURES**: Only implement features explicitly defined in requirements
5. **NO MADE-UP CONFIGURATIONS**: All config values must be documented or environment-based
6. **NO PHANTOM DEPENDENCIES**: Every import must correspond to an actual installed package
7. **NO IMAGINARY DATABASE FIELDS**: All database fields must be defined in Prisma schema
8. **NO FAKE ENVIRONMENT VARIABLES**: All env vars must be documented in .env.example

### **✅ VERIFICATION REQUIREMENTS**
```typescript
// ALWAYS verify before using:
// ❌ BAD: Assuming an endpoint exists
const response = await fetch('/api/patients/mysterious-endpoint');

// ✅ GOOD: Using documented endpoints only
const response = await fetch('/api/patients', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});

// ❌ BAD: Using undocumented library features
import { magicalFunction } from 'some-library';

// ✅ GOOD: Using documented features only
import { documentedFunction } from 'some-library';
```

### **🔍 MANDATORY CHECKS**
Before implementing ANY feature:
- [ ] Verify the feature exists in Project_Requirement_Document.md
- [ ] Check if the API endpoint is defined in the backend routes
- [ ] Confirm all imports correspond to installed packages
- [ ] Validate all database operations against Prisma schema
- [ ] Ensure all environment variables are documented

---

## 📝 Naming Conventions

### **🎯 Component Naming**
```typescript
// ✅ CORRECT: PascalCase for components
export const AppointmentCard = () => { /* ... */ };
export const PatientProfileForm = () => { /* ... */ };
export const DocumentUploadModal = () => { /* ... */ };

// ❌ INCORRECT: Other cases
export const appointmentCard = () => { /* ... */ };
export const patient_profile_form = () => { /* ... */ };
export const documentuploadmodal = () => { /* ... */ };
```

### **🔧 Function & Variable Naming**
```typescript
// ✅ CORRECT: camelCase for functions and variables
const fetchAppointments = async () => { /* ... */ };
const patientData = await getPatientProfile();
const isLoading = true;

// ❌ INCORRECT: Other cases
const FetchAppointments = async () => { /* ... */ };
const patient_data = await getPatientProfile();
const IsLoading = true;
```

### **📁 File Naming**
```
✅ CORRECT:
- AppointmentCard.tsx (Components)
- useAuth.ts (Hooks)
- authService.ts (Services)
- appointment.types.ts (Types)
- API_ENDPOINTS.ts (Constants)

❌ INCORRECT:
- appointmentCard.tsx
- UseAuth.ts
- auth_service.ts
- appointment-types.ts
- api_endpoints.ts
```

### **🗄️ Database Naming**
```prisma
// ✅ CORRECT: PascalCase for models, camelCase for fields
model PatientProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  dateOfBirth     DateTime?
  emergencyContact String?
  
  @@map("patient_profiles") // snake_case for table names
}

// ❌ INCORRECT: Inconsistent naming
model patient_profile {
  ID              String    @id @default(cuid())
  user_id         String    @unique
  DateOfBirth     DateTime?
}
```

---

## 🎨 UI Consistency Rules

### **🌙 Dark Mode Compliance**
```css
/* ✅ CORRECT: Always use CSS variables for colors */
.appointment-card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

/* ❌ INCORRECT: Hard-coded colors */
.appointment-card {
  background: #1a1a1b;
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### **✨ Glassmorphism Standards**
```css
/* ✅ CORRECT: Consistent glass effect */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* ❌ INCORRECT: Inconsistent glass effects */
.some-card {
  background: rgba(255, 255, 255, 0.1); /* Different opacity */
  backdrop-filter: blur(10px); /* Different blur */
  border-radius: 8px; /* Different radius */
}
```

### **📱 Responsive Design Rules**
```typescript
// ✅ CORRECT: Mobile-first responsive design
<div className="
  w-full 
  p-4 
  sm:p-6 
  md:p-8 
  lg:max-w-4xl 
  lg:mx-auto
">

// ❌ INCORRECT: Desktop-first or inconsistent breakpoints
<div className="
  max-w-4xl 
  mx-auto 
  p-8 
  sm:p-4
">
```

### **🎭 Animation Consistency**
```typescript
// ✅ CORRECT: Consistent animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// ❌ INCORRECT: Random animation values
const someAnimation = {
  initial: { opacity: 0, y: 50 }, // Different y value
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "linear" } // Different duration/easing
};
```

---

## 🔄 Sequential Execution Flow

### **📋 MANDATORY SEQUENCE**
Every development task MUST follow this exact order:

1. **📖 READ REQUIREMENTS**
   - Review Project_Requirement_Document.md
   - Check Tech_Stack_Document.md for approved technologies
   - Verify feature exists in specifications

2. **🔍 ANALYZE DEPENDENCIES**
   - Check existing components and services
   - Verify database schema requirements
   - Identify required API endpoints

3. **📝 PLAN IMPLEMENTATION**
   - Write detailed implementation steps
   - Identify potential issues and solutions
   - Plan testing strategy

4. **🏗️ IMPLEMENT STEP-BY-STEP**
   - Create/modify files one at a time
   - Test each component individually
   - Verify integration with existing code

5. **✅ VALIDATE & TEST**
   - Run type checking (TypeScript)
   - Test component functionality
   - Verify responsive design
   - Check accessibility compliance

6. **📊 LOG PROGRESS**
   - Update Project_Progress_Log.md
   - Mark tasks complete in Task_Queue.md
   - Document any issues or decisions

### **🚫 PROHIBITED ACTIONS**
- **NO PARALLEL DEVELOPMENT**: Complete one feature before starting another
- **NO SKIPPING STEPS**: Every step in the sequence is mandatory
- **NO ASSUMPTIONS**: Always verify before implementing
- **NO SHORTCUTS**: Follow the full process every time

---

## 🔒 Data Integrity Rules

### **🏥 Medical Data Handling**
```typescript
// ✅ CORRECT: Always encrypt sensitive medical data
const encryptedMedicalHistory = encryptMedicalData({
  conditions: patient.conditions,
  medications: patient.medications,
  allergies: patient.allergies
});

// ❌ INCORRECT: Storing sensitive data in plain text
const medicalHistory = {
  conditions: patient.conditions, // Unencrypted sensitive data
  medications: patient.medications
};
```

### **🔐 Authentication Validation**
```typescript
// ✅ CORRECT: Always validate user permissions
const hasPermission = await checkUserPermission(userId, 'appointments:read:all');
if (!hasPermission) {
  throw new SecurityError('Insufficient permissions');
}

// ❌ INCORRECT: Assuming user has permissions
const appointments = await getAppointments(); // No permission check
```

### **📊 Database Operations**
```typescript
// ✅ CORRECT: Always use transactions for related operations
await prisma.$transaction(async (tx) => {
  const appointment = await tx.appointment.create({ data: appointmentData });
  await tx.auditLog.create({ 
    data: { action: 'APPOINTMENT_CREATED', resourceId: appointment.id }
  });
});

// ❌ INCORRECT: Separate operations without transaction
const appointment = await prisma.appointment.create({ data: appointmentData });
await prisma.auditLog.create({ data: { action: 'APPOINTMENT_CREATED' } });
```

---

## 🎯 Component Development Rules

### **🧩 Component Structure**
```typescript
// ✅ CORRECT: Consistent component structure
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  className?: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onCancel,
  className
}) => {
  // 1. Hooks
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 2. Event handlers
  const handleEdit = () => {
    onEdit?.(appointment.id);
  };

  // 3. Render
  return (
    <Card className={cn("glass-card", className)}>
      {/* Component JSX */}
    </Card>
  );
};

// ❌ INCORRECT: Inconsistent structure, missing types
export const AppointmentCard = ({ appointment, onEdit }) => {
  return <div>{/* ... */}</div>;
};
```

### **🎨 Styling Rules**
```typescript
// ✅ CORRECT: Use Tailwind classes with cn() utility
<Button 
  className={cn(
    "glass-button",
    "hover:scale-105 transition-transform",
    isLoading && "opacity-50 cursor-not-allowed",
    className
  )}
>

// ❌ INCORRECT: Inline styles or string concatenation
<Button 
  style={{ background: 'rgba(255,255,255,0.1)' }}
  className={"glass-button " + (isLoading ? "opacity-50" : "")}
>
```

---

## 📋 Quality Assurance Rules

### **🔍 Code Review Checklist**
Before committing ANY code, verify:
- [ ] All imports are from installed packages
- [ ] All API calls use documented endpoints
- [ ] All database operations use Prisma schema fields
- [ ] All components follow naming conventions
- [ ] All sensitive data is properly encrypted
- [ ] All user inputs are validated and sanitized
- [ ] All error cases are handled
- [ ] All loading states are implemented
- [ ] All accessibility attributes are present
- [ ] All responsive breakpoints are tested

### **🧪 Testing Requirements**
```typescript
// ✅ CORRECT: Comprehensive test coverage
describe('AppointmentCard', () => {
  it('renders appointment information correctly', () => {
    // Test implementation
  });

  it('handles edit action when user has permission', () => {
    // Test implementation
  });

  it('disables actions when user lacks permission', () => {
    // Test implementation
  });

  it('shows loading state during operations', () => {
    // Test implementation
  });
});

// ❌ INCORRECT: Minimal or missing tests
describe('AppointmentCard', () => {
  it('renders', () => {
    // Minimal test
  });
});
```

---

## 🚨 Error Prevention Protocol

### **🔴 BEFORE EVERY IMPLEMENTATION**
1. **Verify Feature Exists**: Check Project_Requirement_Document.md
2. **Check Dependencies**: Ensure all required packages are installed
3. **Validate Schema**: Confirm database fields exist in Prisma schema
4. **Review Security**: Check Security_Guidelines.md for requirements
5. **Plan Testing**: Define test cases before implementation

### **⚠️ DURING IMPLEMENTATION**
1. **One Change at a Time**: Make small, incremental changes
2. **Test Immediately**: Verify each change works before proceeding
3. **Log Everything**: Update Project_Progress_Log.md with each step
4. **Handle Errors**: Implement proper error handling for all operations
5. **Validate Inputs**: Sanitize and validate all user inputs

### **✅ AFTER IMPLEMENTATION**
1. **Run Full Tests**: Execute all relevant test suites
2. **Check Accessibility**: Verify WCAG compliance
3. **Test Responsive Design**: Check all breakpoints
4. **Validate Security**: Ensure no security vulnerabilities
5. **Update Documentation**: Reflect changes in relevant docs

---

## 📊 Progress Tracking Rules

### **📝 MANDATORY LOGGING**
Every action must be logged in Project_Progress_Log.md:
```markdown
## 2024-01-15 14:30:00
✅ **COMPLETED**: Created AppointmentCard component
- Added TypeScript interfaces
- Implemented glassmorphism styling
- Added responsive design
- Included accessibility attributes
- Added unit tests

🔄 **IN PROGRESS**: Implementing appointment booking form
- Created form validation schema
- Working on date/time picker integration

❌ **BLOCKED**: Patient document upload
- Waiting for AWS S3 configuration
- Need environment variables setup
```

### **📋 TASK QUEUE UPDATES**
Task_Queue.md must be updated after every completed task:
```markdown
| Task | Priority | Status | Dependencies | Assigned | Notes |
|------|----------|--------|--------------|----------|-------|
| Appointment Card | High | ✅ Complete | - | AI | Fully tested |
| Booking Form | High | 🔄 In Progress | AppointmentCard | AI | 60% complete |
| Document Upload | Medium | ❌ Blocked | AWS Config | AI | Waiting for setup |
```

---

## 🎯 FINAL VALIDATION CHECKLIST

Before marking ANY task as complete:
- [ ] Feature matches requirements exactly
- [ ] All naming conventions followed
- [ ] UI consistency maintained
- [ ] Security guidelines implemented
- [ ] Error handling comprehensive
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Progress logged
- [ ] No hallucinated code or data
- [ ] All dependencies verified

**🚨 REMEMBER: These rules are NON-NEGOTIABLE. Violation of any rule requires immediate correction before proceeding.**
