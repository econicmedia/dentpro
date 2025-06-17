'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // This would typically send to a service like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to error reporting service
    // errorReportingService.captureException(errorData);
    console.log('Error logged:', errorData);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorDetails = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const { level = 'component', showDetails = false } = this.props;

      // Critical error - full page
      if (level === 'critical') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl glass-card">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Critical Error</CardTitle>
                <CardDescription>
                  A critical error has occurred that prevents the application from functioning properly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showDetails && error && (
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="font-medium mb-2">Error Details:</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {error.message}
                    </p>
                    {errorId && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Error ID: {errorId}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={this.handleReload} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload Page
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                  {showDetails && (
                    <Button variant="outline" onClick={this.copyErrorDetails}>
                      <Bug className="mr-2 h-4 w-4" />
                      Copy Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Page-level error
      if (level === 'page') {
        return (
          <div className="flex min-h-[400px] items-center justify-center p-4">
            <Card className="w-full max-w-lg glass-card">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>
                  We encountered an error while loading this page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showDetails && error && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm text-muted-foreground font-mono">
                      {error.message}
                    </p>
                    {errorId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Error ID: {errorId}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Component-level error (inline)
      return (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-medium text-destructive">
                Component Error
              </h4>
              <p className="text-sm text-muted-foreground">
                This component failed to render properly.
              </p>
              {showDetails && error && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Show details
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-xs bg-muted p-2 rounded">
                    {error.message}
                  </pre>
                </details>
              )}
              <Button size="sm" variant="outline" onClick={this.handleRetry}>
                <RefreshCw className="mr-1 h-3 w-3" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error boundary (for functional components)
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // This would typically integrate with your error reporting service
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You could also trigger a state update to show an error UI
    throw error; // Re-throw to be caught by ErrorBoundary
  };
}

// Simple error fallback components
export const SimpleErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ 
  error, 
  retry 
}) => (
  <div className="text-center p-4">
    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
    <h3 className="font-medium mb-1">Something went wrong</h3>
    <p className="text-sm text-muted-foreground mb-3">
      {error?.message || 'An unexpected error occurred'}
    </p>
    {retry && (
      <Button size="sm" onClick={retry}>
        Try again
      </Button>
    )}
  </div>
);

export const MinimalErrorFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8 text-muted-foreground">
    <AlertTriangle className="h-4 w-4 mr-2" />
    <span className="text-sm">Unable to load content</span>
  </div>
);

export default ErrorBoundary;
