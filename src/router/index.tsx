// ============================================
// router/index.tsx
// The complete navigation map of the app.
// Three things happen here together:
// 1. React.lazy  → pages load only when visited
// 2. Suspense    → shows spinner during load
// 3. ProtectedRoute → blocks private pages
// ============================================

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { PageSpinner } from '../components/ui/PageSpinner';

// ─── Lazy load every page ─────────────────────────────────────────────────────
// These are NOT imported normally — each becomes a separate JS chunk.
// The chunk downloads only when the user first visits that route.
const LoginPage     = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AppLayout     = lazy(() => import('../components/layout/AppLayout'));
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'));

// ─── Suspense wrapper ─────────────────────────────────────────────────────────
// Reusable wrapper — every lazy page needs this
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSpinner />}>{children}</Suspense>;
}

// ─── Route definitions ────────────────────────────────────────────────────────
export const router = createBrowserRouter([

  // Public route — no auth needed
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },

  // Protected routes — must be logged in
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <SuspenseWrapper>
            <AppLayout />
          </SuspenseWrapper>
        ),
        children: [
          // / redirects to /dashboard automatically
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // Dashboard page
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          { path: 'appointments', element: <SuspenseWrapper><AppointmentsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // Catch-all — any unknown URL goes to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },

]);