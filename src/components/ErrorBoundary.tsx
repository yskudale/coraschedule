// ============================================
// ErrorBoundary.tsx
// Catches any render error in the component tree.
// Shows a friendly fallback UI instead of blank screen.
// Must be a CLASS component — React requires lifecycle
// methods getDerivedStateFromError + componentDidCatch
// for error boundaries. Hooks cannot do this.
// ============================================

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import styles from './ErrorBoundary.module.scss';

// ─── Props and State types ────────────────────────────────────────────────────
interface Props {
  children: ReactNode;
  fallback?: ReactNode; // optional custom fallback UI
}

interface State {
  hasError:     boolean;
  error:        Error | null;
  errorInfo:    ErrorInfo | null;
}

// ─── ErrorBoundary class component ───────────────────────────────────────────
export class ErrorBoundary extends Component<Props, State> {

  // Initial state — no error
  state: State = {
    hasError:  false,
    error:     null,
    errorInfo: null,
  };

  // ── getDerivedStateFromError ────────────────────────────────────────────────
  // Called immediately when a child throws during render.
  // Returns new state — switches hasError to true.
  // This triggers the fallback UI to render.
  // Static method — no access to `this`.
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  // ── componentDidCatch ───────────────────────────────────────────────────────
  // Called after getDerivedStateFromError.
  // Receives error + component stack trace.
  // Use this for logging to an error service (Sentry etc).
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Save errorInfo to state for display
    this.setState({ errorInfo });

    // Real app: send to error tracking service
    // Sentry.captureException(error, { extra: errorInfo });
  }

  // ── handleRetry ────────────────────────────────────────────────────────────
  // Resets error state — React will attempt to re-render children.
  // Works for transient errors like network failures.
  handleRetry = () => {
    this.setState({
      hasError:  false,
      error:     null,
      errorInfo: null,
    });
  };

  // ── handleGoHome ───────────────────────────────────────────────────────────
  // Hard redirect to login — guaranteed clean slate.
  handleGoHome = () => {
    window.location.href = '/login';
  };

  // ── render ─────────────────────────────────────────────────────────────────
  render() {
    // No error — render children normally
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback provided — use it
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default CORA fallback UI
    return (
      <div className={styles.overlay}>
        <div className={styles.card}>

          {/* CORA Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>C</div>
            <span className={styles.logoText}>CORA</span>
          </div>

          {/* Error icon */}
          <div className={styles.iconWrapper}>
            <AlertTriangle size={36} />
          </div>

          {/* Message */}
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>
            An unexpected error occurred in the application.
            This has been logged and our team will look into it.
            You can try again or return to the home page.
          </p>

          {/* Error details — only in development */}
          {import.meta.env.DEV && this.state.error && (
            <div className={styles.errorBox}>
              <p className={styles.errorLabel}>Error details</p>
              <p className={styles.errorText}>
                {this.state.error.message}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.actions}>
            <button
              className={styles.retryBtn}
              onClick={this.handleRetry}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <button
              className={styles.homeBtn}
              onClick={this.handleGoHome}
            >
              <Home size={16} />
              Return to Login
            </button>
          </div>

        </div>
      </div>
    );
  }
}