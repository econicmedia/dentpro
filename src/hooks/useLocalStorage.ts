import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing session storage
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing multiple localStorage keys
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
): [T, (key: keyof T, value: SetValue<T[keyof T]>) => void, (key: keyof T) => void, () => void] {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const result = { ...initialValues };
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(String(key));
        if (item) {
          result[key] = JSON.parse(item);
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${String(key)}":`, error);
      }
    });
    return result;
  });

  const setValue = useCallback(
    (key: keyof T, value: SetValue<T[keyof T]>) => {
      try {
        const valueToStore = value instanceof Function ? value(values[key]) : value;
        
        setValues(prev => ({ ...prev, [key]: valueToStore }));
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(String(key), JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${String(key)}":`, error);
      }
    },
    [values]
  );

  const removeValue = useCallback((key: keyof T) => {
    try {
      setValues(prev => ({ ...prev, [key]: initialValues[key] }));
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(String(key));
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${String(key)}":`, error);
    }
  }, [initialValues]);

  const clearAll = useCallback(() => {
    try {
      setValues(initialValues);
      if (typeof window !== 'undefined') {
        keys.forEach(key => {
          window.localStorage.removeItem(String(key));
        });
      }
    } catch (error) {
      console.error('Error clearing localStorage keys:', error);
    }
  }, [keys, initialValues]);

  return [values, setValue, removeValue, clearAll];
}

// Hook for checking if localStorage is available
export function useLocalStorageAvailable(): boolean {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
        setIsAvailable(true);
      }
    } catch {
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
}
