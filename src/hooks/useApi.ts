import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/store/uiStore';
import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface ApiOptions {
  immediate?: boolean;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
  successMessage?: string;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (params?: any) => Promise<T | null>;
  reset: () => void;
  refresh: () => Promise<T | null>;
}

// Generic API hook
export function useApi<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    timeout = API_TIMEOUT,
    retries = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const { session } = useAuthStore();
  const { showSuccess, showError } = useNotifications();
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<any>(null);

  // Create API client with authentication
  const createApiClient = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return {
      headers,
      timeout,
    };
  }, [session?.accessToken, timeout]);

  // Execute API call with retry logic
  const executeWithRetry = useCallback(
    async (url: string, config: RequestInit, attempt: number = 0): Promise<Response> => {
      try {
        const response = await fetch(url, {
          ...config,
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (attempt < retries && !abortControllerRef.current?.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          return executeWithRetry(url, config, attempt + 1);
        }
        throw error;
      }
    },
    [retries, retryDelay]
  );

  // Main execute function
  const execute = useCallback(
    async (params?: any): Promise<T | null> => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      lastParamsRef.current = params;

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const client = createApiClient();
        let url = `${API_BASE_URL}${endpoint}`;
        let config: RequestInit = {
          headers: client.headers,
        };

        // Handle different HTTP methods and parameters
        if (params) {
          if (typeof params === 'object' && params.method) {
            config.method = params.method;
            
            if (params.method === 'GET' && params.query) {
              const searchParams = new URLSearchParams(params.query);
              url += `?${searchParams.toString()}`;
            } else if (params.body) {
              config.body = JSON.stringify(params.body);
            }
          } else {
            // Default to GET with query params
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
          }
        }

        const response = await executeWithRetry(url, config);
        const data = await response.json();

        setState({
          data,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });

        // Handle success
        if (onSuccess) {
          onSuccess(data);
        }

        if (showSuccessNotification && successMessage) {
          showSuccess('Success', successMessage);
        }

        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        
        // Don't set error state if request was aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));

          // Handle error
          if (onError) {
            onError(errorMessage);
          }

          if (showErrorNotification) {
            showError('Error', errorMessage);
          }
        }

        return null;
      }
    },
    [
      endpoint,
      createApiClient,
      executeWithRetry,
      onSuccess,
      onError,
      showSuccessNotification,
      showErrorNotification,
      successMessage,
      showSuccess,
      showError,
    ]
  );

  // Reset state
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  // Refresh with last parameters
  const refresh = useCallback(() => {
    return execute(lastParamsRef.current);
  }, [execute]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    refresh,
  };
}

// Specialized hooks for common operations
export function useGet<T = any>(endpoint: string, options: ApiOptions = {}) {
  return useApi<T>(endpoint, { ...options, immediate: true });
}

export function usePost<T = any>(endpoint: string, options: ApiOptions = {}) {
  const api = useApi<T>(endpoint, options);
  
  const post = useCallback(
    (data: any) => {
      return api.execute({
        method: 'POST',
        body: data,
      });
    },
    [api.execute]
  );

  return {
    ...api,
    post,
  };
}

export function usePut<T = any>(endpoint: string, options: ApiOptions = {}) {
  const api = useApi<T>(endpoint, options);
  
  const put = useCallback(
    (data: any) => {
      return api.execute({
        method: 'PUT',
        body: data,
      });
    },
    [api.execute]
  );

  return {
    ...api,
    put,
  };
}

export function useDelete<T = any>(endpoint: string, options: ApiOptions = {}) {
  const api = useApi<T>(endpoint, options);
  
  const del = useCallback(
    (id?: string | number) => {
      const url = id ? `${endpoint}/${id}` : endpoint;
      return api.execute({
        method: 'DELETE',
      });
    },
    [api.execute, endpoint]
  );

  return {
    ...api,
    delete: del,
  };
}

// Hook for file uploads
export function useFileUpload(endpoint: string, options: ApiOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { session } = useAuthStore();
  const { showSuccess, showError } = useNotifications();

  const upload = useCallback(
    async (file: File, additionalData?: Record<string, any>): Promise<any> => {
      const formData = new FormData();
      formData.append('file', file);

      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      const headers: Record<string, string> = {};
      if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }

      try {
        setUploadProgress(0);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        setUploadProgress(100);

        if (options.showSuccessNotification) {
          showSuccess('Success', options.successMessage || 'File uploaded successfully');
        }

        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        
        if (options.showErrorNotification !== false) {
          showError('Upload Error', errorMessage);
        }

        throw error;
      }
    },
    [endpoint, session?.accessToken, options, showSuccess, showError]
  );

  return {
    upload,
    uploadProgress,
  };
}
