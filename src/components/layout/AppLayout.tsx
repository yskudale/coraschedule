// ============================================
// AppLayout.tsx
// The shell for all private pages.
// Contains: sidebar + main content area.
// ============================================

import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, LogOut, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logoutUser } from '@/features/auth/authSlice';
import styles from './AppLayout.module.scss';

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((state) => state.auth.user);

  return (
    <div className={styles.shell}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>

        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <div>
            <span className={styles.logoText}>CORA</span>
            <span className={styles.logoSub}>Physical Therapy</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Calendar size={20} />
            <span>Appointments</span>
          </NavLink>
        </nav>

        {/* User info + logout */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <User size={18} />
            </div>
            <div className={styles.userText}>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userRole}>{user?.role}</p>
            </div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={() => dispatch(logoutUser())}

            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}