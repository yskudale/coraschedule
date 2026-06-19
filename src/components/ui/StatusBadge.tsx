// ============================================
// StatusBadge.tsx
// Renders a colored pill badge for an
// appointment status. Used by both
// AppointmentsPage and DashboardPage —
// one definition, used everywhere.
// ============================================

import type { AppointmentStatus } from '@/features/appointments/types/index';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

// Maps each status value to its CSS module class.
// Module scope — created once, not recreated per render.
const STATUS_CLASS_MAP: Record<AppointmentStatus, string> = {
  scheduled:     styles['badge__scheduled'],
  completed:     styles['badge__completed'],
  cancelled:     styles['badge__cancelled'],
  'in-progress': styles['badge__inProgress'],
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASS_MAP[status]}`}>
      {status}
    </span>
  );
}