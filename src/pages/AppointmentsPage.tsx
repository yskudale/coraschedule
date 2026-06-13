// ============================================
// AppointmentsPage.tsx
// Shows all appointments in a filterable table.
// Uses: Redux (fetch + cancel appointments)
//       useState (filter bar — local UI state)
//       useMemo (filtered list — performance)
// ============================================

import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAppointments, cancelAppointment } from '@/features/appointments/appointmentsSlice';
import type { AppointmentFilters, AppointmentStatus, TherapyType } from '@/features/appointments/types/index';
import styles from './AppointmentsPage.module.scss';

import { BookingModal } from '@/components/booking/BookingModal';

// ─── Initial filter state ─────────────────────────────────────────────────────
const initialFilters: AppointmentFilters = {
  search:      '',
  status:      'all',
  therapyType: 'all',
};

export default function AppointmentsPage() {
  const dispatch     = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.appointments
  );
  console.log('appointments in store:', items.length, items);

  // Local UI state — filters live here, not in Redux
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);
  const [showBooking, setShowBooking] = useState(false);


  const handleBookingClose = () => {
    setShowBooking(false);
    setFilters(initialFilters);
    };

  // Fetch appointments when page first loads
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, items.length]);

  // ── Filtered list ───────────────────────────────────────────────────────────
  // useMemo means this only recalculates when items or filters change.
  // Without useMemo it recalculates on every single render — wasteful.
  const filtered = useMemo(() => {
    return items.filter((apt) => {
      const matchesSearch =
        filters.search === '' ||
        apt.therapistName.toLowerCase().includes(filters.search.toLowerCase()) ||
        apt.therapyType.toLowerCase().includes(filters.search.toLowerCase()) ||
        apt.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === 'all' || apt.status === filters.status;

      const matchesType =
        filters.therapyType === 'all' || apt.therapyType === filters.therapyType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [items, filters]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value as AppointmentStatus | 'all',
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      therapyType: e.target.value as TherapyType | 'all',
    }));
  };

  const handleCancel = (id: string) => {
    dispatch(cancelAppointment(id));
  };

  // ── Badge class helper ───────────────────────────────────────────────────────
  const getBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      scheduled:   styles['badge__scheduled'],
      completed:   styles['badge__completed'],
      cancelled:   styles['badge__cancelled'],
      'in-progress': styles['badge__inProgress'],
    };
    return `${styles.badge} ${map[status] ?? ''}`;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Appointments</h1>
          <p>Manage and track all your therapy sessions</p>
        </div>
        <button className={styles.bookBtn}  onClick={() => setShowBooking(true)}>
        <Plus size={18} />
        Book Appointment
        </button>
      </div>

      {/* Filter bar */}
      <div className={styles.filters}>

        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search therapist, type, location..."
            className={styles.searchInput}
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <select
          className={styles.select}
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className={styles.select}
          value={filters.therapyType}
          onChange={handleTypeChange}
        >
          <option value="all">All Therapy Types</option>
          <option value="Physical Therapy">Physical Therapy</option>
          <option value="Occupational Therapy">Occupational Therapy</option>
          <option value="Speech Therapy">Speech Therapy</option>
        </select>

      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>

        {isLoading && (
          <p className={styles.loading}>Loading appointments...</p>
        )}

        {error && (
          <p className={styles.loading}>{error}</p>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <Calendar size={48} className={styles.emptyIcon} />
            <h3>No appointments found</h3>
            <p>Try adjusting your filters or book a new appointment.</p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Date &amp; Time</th>
                <th>Therapy Type</th>
                <th>Therapist</th>
                <th>Location</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} className={styles.tableRow}>

                  <td>
                    <div>{apt.date}</div>
                    <div className={styles.therapistName}>{apt.time}</div>
                  </td>

                  <td>
                    <div className={styles.therapyType}>{apt.therapyType}</div>
                  </td>

                  <td>
                    <div>{apt.therapistName}</div>
                  </td>

                  <td>{apt.location}</td>

                  <td>
                    <span className={styles.duration}>{apt.duration} min</span>
                  </td>

                  <td>
                    <span className={getBadgeClass(apt.status)}>
                      {apt.status}
                    </span>
                  </td>

                  <td>
                    {apt.status === 'scheduled' && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancel(apt.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
 {showBooking && (
        <BookingModal onClose={handleBookingClose} />
      )}

    </div>
  );
}