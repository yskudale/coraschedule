// ============================================
// App.tsx
// Root component.
// ErrorBoundary wraps the entire router —
// any crash anywhere in the app is caught here.
// ============================================

import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}