# Front End Guidelines
## Dentist Appointment Management Platform

### 🎨 Design Philosophy
Creating a premium, professional healthcare interface that combines modern aesthetics with exceptional usability, featuring dark mode and glassmorphism design principles.

---

## 🌙 Dark Mode Design Principles

### **Color Palette**
```css
/* Primary Dark Theme Colors */
--bg-primary: #0a0a0b;           /* Main background */
--bg-secondary: #1a1a1b;         /* Card backgrounds */
--bg-tertiary: #2a2a2b;          /* Elevated surfaces */
--bg-glass: rgba(255, 255, 255, 0.05); /* Glass effect base */

/* Accent Colors */
--accent-primary: #3b82f6;       /* Primary blue */
--accent-secondary: #10b981;     /* Success green */
--accent-warning: #f59e0b;       /* Warning amber */
--accent-danger: #ef4444;        /* Error red */
--accent-info: #06b6d4;          /* Info cyan */

/* Text Colors */
--text-primary: #f8fafc;         /* Primary text */
--text-secondary: #cbd5e1;       /* Secondary text */
--text-muted: #64748b;           /* Muted text */
--text-disabled: #475569;        /* Disabled text */

/* Border Colors */
--border-primary: rgba(255, 255, 255, 0.1);
--border-secondary: rgba(255, 255, 255, 0.05);
--border-accent: rgba(59, 130, 246, 0.3);
```

### **Glassmorphism Implementation**
```css
/* Glass Card Base */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Glass Button */
.glass-button {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-button:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}
```

---

## 🎭 Component Library Standards

### **Primary Choice: shadcn/ui**
- **Installation**: `npx shadcn-ui@latest init`
- **Customization**: Full theme customization for dark mode
- **Components**: Button, Card, Dialog, Form, Input, Select, etc.
- **Accessibility**: WCAG 2.1 AA compliant out of the box

### **Component Customization Strategy**
```typescript
// tailwind.config.js - Custom theme extension
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Custom glass colors
        glass: {
          primary: 'rgba(255, 255, 255, 0.05)',
          secondary: 'rgba(255, 255, 255, 0.1)',
          accent: 'rgba(59, 130, 246, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      }
    }
  }
}
```

### **Alternative: Aceternity UI**
- **Use Case**: Advanced animations and glassmorphism effects
- **Integration**: Selective component adoption
- **Customization**: Theme adaptation for healthcare context

---

## 🔤 Typography System

### **Font Selection**
- **Primary Font**: `Inter` (Google Fonts)
  - Modern, highly legible sans-serif
  - Excellent for UI and body text
  - Multiple weights and styles available
- **Secondary Font**: `JetBrains Mono` (Code/Data)
  - Monospace font for appointment times, IDs
  - High readability for technical information
- **Accent Font**: `Poppins` (Headings)
  - Friendly, professional appearance
  - Great for marketing and hero sections

### **Typography Scale**
```css
/* Font Size Scale */
.text-xs    { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
.text-sm    { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base  { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl    { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-2xl   { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl   { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl   { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */

/* Font Weight Scale */
.font-light     { font-weight: 300; }
.font-normal    { font-weight: 400; }
.font-medium    { font-weight: 500; }
.font-semibold  { font-weight: 600; }
.font-bold      { font-weight: 700; }
```

### **Typography Usage Guidelines**
- **Headings**: Use Poppins with semibold/bold weights
- **Body Text**: Use Inter with normal/medium weights
- **UI Elements**: Use Inter for consistency
- **Data/Code**: Use JetBrains Mono for appointment times, IDs
- **Line Height**: 1.5x for body text, 1.2x for headings
- **Letter Spacing**: Slight increase for all-caps text

---

## ✨ Animation & Interaction Guidelines

### **Animation Library**
- **Framer Motion** for complex animations
- **CSS Transitions** for simple hover effects
- **Lottie** for micro-interactions and loading states

### **Animation Principles**
```typescript
// Framer Motion Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const glassHover = {
  whileHover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  },
  whileTap: {
    scale: 0.98
  }
};
```

### **Interaction States**
- **Hover**: Subtle scale (1.02x) and elevation
- **Active**: Scale down (0.98x) for tactile feedback
- **Focus**: Visible focus ring with accent color
- **Loading**: Skeleton screens and progress indicators
- **Error**: Shake animation for form validation

### **Page Transitions**
```typescript
// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4, ease: "easeInOut" }
};
```

---

## 📱 Responsive Design System

### **Breakpoint Strategy**
```css
/* Tailwind CSS Breakpoints */
sm: '640px',   /* Small devices (landscape phones) */
md: '768px',   /* Medium devices (tablets) */
lg: '1024px',  /* Large devices (laptops) */
xl: '1280px',  /* Extra large devices (desktops) */
2xl: '1536px'  /* 2X large devices (large desktops) */
```

### **Mobile-First Approach**
- Design for mobile screens first
- Progressive enhancement for larger screens
- Touch-friendly interface elements (44px minimum)
- Optimized navigation for mobile devices

### **Layout Patterns**
- **Mobile**: Single column, stacked layout
- **Tablet**: Two-column layout for forms and lists
- **Desktop**: Multi-column dashboard layout
- **Large Desktop**: Sidebar navigation with main content area

---

## 🧩 Component Architecture

### **Component Hierarchy**
```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── common/          # Reusable components
│   ├── forms/           # Form-specific components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
```

### **Component Naming Convention**
- **PascalCase** for component names
- **Descriptive names**: `AppointmentCard`, `PatientProfile`
- **Prefix for variants**: `GlassButton`, `GlassCard`
- **Suffix for containers**: `AppointmentList`, `PatientGrid`

### **Component Props Pattern**
```typescript
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

---

## 🎯 UI Consistency Rules

### **Spacing System**
```css
/* Tailwind Spacing Scale */
.space-1  { margin/padding: 0.25rem; }  /* 4px */
.space-2  { margin/padding: 0.5rem; }   /* 8px */
.space-3  { margin/padding: 0.75rem; }  /* 12px */
.space-4  { margin/padding: 1rem; }     /* 16px */
.space-6  { margin/padding: 1.5rem; }   /* 24px */
.space-8  { margin/padding: 2rem; }     /* 32px */
.space-12 { margin/padding: 3rem; }     /* 48px */
```

### **Border Radius Standards**
- **Small**: `rounded-md` (6px) for buttons, inputs
- **Medium**: `rounded-lg` (8px) for cards, modals
- **Large**: `rounded-xl` (12px) for major containers
- **Extra Large**: `rounded-2xl` (16px) for hero sections

### **Shadow System**
```css
/* Custom Shadow Scale */
.shadow-glass-sm {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.shadow-glass-md {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.shadow-glass-lg {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

---

## 🔧 Development Guidelines

### **Code Organization**
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Feature-based**: Group related components by feature
- **Shared Components**: Reusable UI components in common folder

### **Styling Approach**
- **Utility-first**: Use Tailwind classes primarily
- **Component-scoped**: CSS modules for complex components
- **CSS Variables**: For theme customization
- **Avoid inline styles**: Use className prop instead

### **Performance Optimization**
- **Lazy Loading**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Bundle Splitting**: Separate vendor and app bundles
- **Tree Shaking**: Remove unused CSS and JavaScript

### **Accessibility Standards**
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: For complex interactions
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader**: Compatible component structure
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)

---

## 📋 Component Checklist

### **Every Component Must Have:**
- [ ] TypeScript interface for props
- [ ] Default props where applicable
- [ ] Responsive design implementation
- [ ] Dark mode compatibility
- [ ] Accessibility attributes
- [ ] Loading and error states
- [ ] Hover and focus states
- [ ] Consistent spacing and typography
- [ ] Glass effect styling (where appropriate)
- [ ] Animation/transition effects

### **Form Components Must Have:**
- [ ] Validation states (error, success, warning)
- [ ] Clear error messages
- [ ] Loading states during submission
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Consistent styling with design system

---

## 🎨 Design Tokens

### **CSS Custom Properties**
```css
:root {
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Transitions */
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.3s ease-out;
  --transition-slow: 0.5s ease-out;
  
  /* Z-index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}
```

---

## 🚀 Performance Guidelines

### **Loading States**
- **Skeleton Screens**: For content loading
- **Spinner**: For actions and form submissions
- **Progress Bars**: For file uploads and multi-step processes
- **Shimmer Effects**: For card and list loading

### **Image Optimization**
- **Next.js Image**: Automatic optimization and lazy loading
- **WebP Format**: Modern image format support
- **Responsive Images**: Multiple sizes for different screens
- **Placeholder**: Blur or skeleton while loading

### **Bundle Optimization**
- **Code Splitting**: Route-based and component-based
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Load components on demand
- **Vendor Splitting**: Separate third-party libraries
