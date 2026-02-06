import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type React from "react";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary für Component-Level Error Handling
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example Mit custom fallback
 * <ErrorBoundary fallback={(error, reset) => <div>Error: {error.message}</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Fehler beim Laden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {this.state.error.message ||
                "Ein unerwarteter Fehler ist aufgetreten."}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={this.reset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline Error Display Component für Query Errors
 */
interface QueryErrorProps {
  error: Error;
  reset?: () => void;
  title?: string;
}

export function QueryError({
  error,
  reset,
  title = "Fehler beim Laden",
}: QueryErrorProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive text-base">
          <AlertTriangle className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
        </p>
      </CardContent>
      {reset && (
        <CardFooter>
          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
