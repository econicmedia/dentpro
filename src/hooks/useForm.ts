import { useState, useCallback, useRef } from 'react';
import { validationUtils } from '@/lib/utils';

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  password?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormConfig {
  initialValues: Record<string, any>;
  validationRules?: Record<string, ValidationRule>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Field operations
  setValue: (name: string, value: any) => void;
  setError: (name: string, error: string | null) => void;
  setTouched: (name: string, touched?: boolean) => void;
  setFieldState: (name: string, field: Partial<FormField>) => void;
  
  // Form operations
  setValues: (values: Record<string, any>) => void;
  setErrors: (errors: Record<string, string | null>) => void;
  reset: (newValues?: Record<string, any>) => void;
  validate: (fieldName?: string) => boolean;
  validateField: (name: string, value: any) => string | null;
  
  // Event handlers
  handleChange: (name: string) => (value: any) => void;
  handleBlur: (name: string) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  
  // Utilities
  getFieldProps: (name: string) => {
    value: any;
    error: string | null;
    onChange: (value: any) => void;
    onBlur: () => void;
  };
}

export function useForm(config: FormConfig): UseFormReturn {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
  } = config;

  // Initialize form state
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  // Validate a single field
  const validateField = useCallback((name: string, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required validation
    if (rules.required) {
      const error = validationUtils.validateRequired(value);
      if (error) return error;
    }

    // Skip other validations if value is empty and not required
    if (!rules.required && (value === '' || value == null)) {
      return null;
    }

    // Email validation
    if (rules.email) {
      const error = validationUtils.validateEmail(value);
      if (error) return error;
    }

    // Phone validation
    if (rules.phone) {
      const error = validationUtils.validatePhone(value);
      if (error) return error;
    }

    // Password validation
    if (rules.password) {
      const error = validationUtils.validatePassword(value);
      if (error) return error;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be less than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rules.custom) {
      const error = rules.custom(value);
      if (error) return error;
    }

    return null;
  }, [validationRules]);

  // Validate entire form or single field
  const validate = useCallback((fieldName?: string): boolean => {
    if (fieldName) {
      const field = formState[fieldName];
      if (!field) return true;
      
      const error = validateField(fieldName, field.value);
      setFormState(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], error },
      }));
      
      return !error;
    }

    // Validate all fields
    let isValid = true;
    const newState = { ...formState };

    Object.keys(formState).forEach(name => {
      const error = validateField(name, formState[name].value);
      newState[name] = { ...newState[name], error };
      if (error) isValid = false;
    });

    setFormState(newState);
    return isValid;
  }, [formState, validateField]);

  // Set field value
  const setValue = useCallback((name: string, value: any) => {
    setFormState(prev => {
      const field = prev[name] || { value: '', error: null, touched: false, dirty: false };
      const isDirty = value !== initialValuesRef.current[name];
      const error = validateOnChange ? validateField(name, value) : field.error;

      return {
        ...prev,
        [name]: {
          ...field,
          value,
          dirty: isDirty,
          error,
        },
      };
    });
  }, [validateField, validateOnChange]);

  // Set field error
  const setError = useCallback((name: string, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);

  // Set field touched
  const setTouched = useCallback((name: string, touched: boolean = true) => {
    setFormState(prev => {
      const field = prev[name];
      if (!field) return prev;

      const error = validateOnBlur && touched ? validateField(name, field.value) : field.error;

      return {
        ...prev,
        [name]: { ...field, touched, error },
      };
    });
  }, [validateField, validateOnBlur]);

  // Set field state
  const setFieldState = useCallback((name: string, fieldUpdate: Partial<FormField>) => {
    setFormState(prev => ({
      ...prev,
      [name]: { ...prev[name], ...fieldUpdate },
    }));
  }, []);

  // Set multiple values
  const setValues = useCallback((values: Record<string, any>) => {
    setFormState(prev => {
      const newState = { ...prev };
      Object.keys(values).forEach(name => {
        const field = newState[name] || { value: '', error: null, touched: false, dirty: false };
        const isDirty = values[name] !== initialValuesRef.current[name];
        
        newState[name] = {
          ...field,
          value: values[name],
          dirty: isDirty,
        };
      });
      return newState;
    });
  }, []);

  // Set multiple errors
  const setErrors = useCallback((errors: Record<string, string | null>) => {
    setFormState(prev => {
      const newState = { ...prev };
      Object.keys(errors).forEach(name => {
        if (newState[name]) {
          newState[name] = { ...newState[name], error: errors[name] };
        }
      });
      return newState;
    });
  }, []);

  // Reset form
  const reset = useCallback((newValues?: Record<string, any>) => {
    const valuesToUse = newValues || initialValues;
    initialValuesRef.current = valuesToUse;
    
    const newState: FormState = {};
    Object.keys(valuesToUse).forEach(key => {
      newState[key] = {
        value: valuesToUse[key],
        error: null,
        touched: false,
        dirty: false,
      };
    });
    
    setFormState(newState);
    setIsSubmitting(false);
  }, [initialValues]);

  // Event handlers
  const handleChange = useCallback((name: string) => (value: any) => {
    setValue(name, value);
  }, [setValue]);

  const handleBlur = useCallback((name: string) => () => {
    setTouched(name, true);
  }, [setTouched]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isValid = validate();
    if (!isValid || !onSubmit) return;

    setIsSubmitting(true);
    try {
      const values = Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].value;
        return acc;
      }, {} as Record<string, any>);

      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validate, onSubmit]);

  // Get field props helper
  const getFieldProps = useCallback((name: string) => {
    const field = formState[name] || { value: '', error: null, touched: false, dirty: false };
    
    return {
      value: field.value,
      error: field.error,
      onChange: handleChange(name),
      onBlur: handleBlur(name),
    };
  }, [formState, handleChange, handleBlur]);

  // Computed values
  const values = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].value;
    return acc;
  }, {} as Record<string, any>);

  const errors = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].error;
    return acc;
  }, {} as Record<string, string | null>);

  const touched = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].touched;
    return acc;
  }, {} as Record<string, boolean>);

  const dirty = Object.keys(formState).reduce((acc, key) => {
    acc[key] = formState[key].dirty;
    return acc;
  }, {} as Record<string, boolean>);

  const isValid = Object.values(formState).every(field => !field.error);
  const isDirty = Object.values(formState).some(field => field.dirty);

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setError,
    setTouched,
    setFieldState,
    setValues,
    setErrors,
    reset,
    validate,
    validateField,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  };
}
