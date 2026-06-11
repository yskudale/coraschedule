// ============================================
// ProtectedRoute.tsx
// The keycard security guard.
// Checks Redux auth state on every navigation.
// Logged in  → let them through to the page.
// Not logged in → send them back to /login.
// ============================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}