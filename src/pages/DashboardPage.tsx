// ============================================
// DashboardPage.tsx
// Reads from TWO Redux slices:
//   state.auth        → user name for greeting
//   state.appointments → live stats + recent list
// Uses useMemo to derive stats from raw data.
// Dispatches fetchAppointments if not yet loaded.
// ============================================

import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAppointments } from '@/features/appointments/appointmentsSlice';
import { Calendar, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import styles from './DashboardPage.module.scss';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user     = useAppSelector((state) => state.auth.user);
  const { items, isLoading } = useAppSelector((state) => state.appointments);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch appointments if not already loaded
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, items.length]);

  // ── Derived stats from appointments data ─────────────────────────────────
  // useMemo — only recalculates when items array changes
  const stats = useMemo(() => ({
    total:     items.length,
    upcoming:  items.filter((i) => i.status === 'scheduled').length,
    completed: items.filter((i) => i.status === 'completed').length,
    cancelled: items.filter((i) => i.status === 'cancelled').length,
  }), [items]);

  // ── Recent appointments — last 5 sorted by date descending ───────────────
const sortedAppointments = useMemo(() => {
  return [...items]
    .filter((i) => i.status === 'scheduled' || i.status === 'in-progress')
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
      return dateTimeA - dateTimeB;
    });
}, [items]);

const totalPages = Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE);

const paginatedAppointments = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return sortedAppointments.slice(start, start + ITEMS_PER_PAGE);
}, [sortedAppointments, currentPage]);

  // ── Stat card definitions ─────────────────────────────────────────────────
  const statCards = [
    {
      icon:  Calendar,
      label: 'Total Appointments',
      value: stats.total,
      color: 'teal',
    },
    {
      icon:  Clock,
      label: 'Upcoming',
      value: stats.upcoming,
      color: 'blue',
    },
    {
      icon:  CheckCircle,
      label: 'Completed',
      value: stats.completed,
      color: 'green',
    },
    {
      icon:  XCircle,
      label: 'Cancelled',
      value: stats.cancelled,
      color: 'red',
    },
  ];

  // ── Badge helper ──────────────────────────────────────────────────────────
  const getBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      scheduled:     styles['badge__scheduled'],
      completed:     styles['badge__completed'],
      cancelled:     styles['badge__cancelled'],
      'in-progress': styles['badge__inProgress'],
    };
    return `${styles.badge} ${map[status] ?? ''}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className={styles.sub}>
            Here is a summary of your therapy journey at CORA.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className={styles.loading}>
          <Activity size={24} className={styles.loadingIcon} />
          <p>Loading your stats...</p>
        </div>
      ) : (
        <div className={styles.statsGrid}>
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className={`${styles.statCard} ${styles[`statCard__${color}`]}`}
            >
              <div className={styles.statIcon}>
                <Icon size={24} />
              </div>
              <div>
                <p className={styles.statValue}>{value}</p>
                <p className={styles.statLabel}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent appointments */}
      {!isLoading && items.length > 0 && (
  <div className={styles.recentSection}>

    <div className={styles.recentHeader}>
      <h2 className={styles.recentTitle}>All Appointments</h2>
      <p className={styles.recentSub}>
        Showing {paginatedAppointments.length} of {sortedAppointments.length} — sorted by date and time
      </p>
    </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Date</th>
                  <th>Therapy Type</th>
                  <th>Therapist</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.map((apt) => (

                  <tr key={apt.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.dateCell}>{apt.date}</div>
                      <div className={styles.timeCell}>{apt.time}</div>
                    </td>
                    <td className={styles.therapyType}>{apt.therapyType}</td>
                    <td>{apt.therapistName}</td>
                    <td>
                      <span className={getBadgeClass(apt.status)}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageNumber} ${
                      currentPage === i + 1 ? styles.pageNumberActive : ''
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}