// ============================================
// Step4Confirm.tsx
// Final step of booking wizard.
// Shows complete summary of all selections.
// User can add notes then confirm booking.
// Exposes a `confirm` method via ref so the
// modal footer's Confirm button can trigger it
// directly — no boolean flag, no useEffect.
// ============================================

import { forwardRef, useImperativeHandle } from 'react';
import { CheckCircle, Activity, MapPin, User, Calendar, Clock } from 'lucide-react';
import { useBooking } from '@/features/booking/context/BookingContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addAppointment } from '@/features/appointments/appointmentsSlice';
import type { Appointment } from '@/features/appointments/types/index';
import { DEFAULT_APPOINTMENT_DURATION } from '@/constants';
import styles from './Step4Confirm.module.scss';

// ─── What this component exposes to its parent via ref ───────────────────────
export interface Step4ConfirmHandle {
  confirm: () => void;
}

interface Step4ConfirmProps {
  onConfirm: () => void;
}

export const Step4Confirm = forwardRef<Step4ConfirmHandle, Step4ConfirmProps>(
  function Step4Confirm({ onConfirm }, ref) {
    const { formData, updateForm } = useBooking();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    // ── handleConfirm — builds the appointment and dispatches it ────────────
    const handleConfirm = () => {
      const newAppointment: Appointment = {
        id:            crypto.randomUUID(),
        patientName:   user?.name ?? 'Guest',
        therapistName: formData.therapist?.name ?? '',
        therapyType:   formData.therapyType ?? 'Physical Therapy',
        date:          formData.date,
        time:          formData.timeSlot?.time ?? '',
        duration:      DEFAULT_APPOINTMENT_DURATION,
        status:        'scheduled',
        location:      formData.clinic?.name ?? '',
        notes:         formData.notes || undefined,
      };

      dispatch(addAppointment(newAppointment));
      onConfirm();
    };

    // ── Expose handleConfirm to BookingModal via ref ─────────────────────────
    // BookingModal's footer Confirm button calls ref.current.confirm()
    // directly — no boolean flag, no useEffect needed.
    useImperativeHandle(ref, () => ({
      confirm: handleConfirm,
    }));

    return (
      <div className={styles.wrapper}>

        {/* Top banner */}
        <div className={styles.successBanner}>
          <CheckCircle size={20} />
          <span>Please review your appointment details before confirming.</span>
        </div>

        {/* Summary card */}
        <div className={styles.summaryCard}>

          <div className={styles.summaryHeader}>
            <CheckCircle size={18} color="white" />
            <p className={styles.summaryHeaderTitle}>Appointment Summary</p>
          </div>

          <div className={styles.summaryBody}>

            {/* Therapy type */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <Activity size={18} />
              </div>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>Therapy Type</p>
                <p className={styles.rowValue}>{formData.therapyType}</p>
              </div>
            </div>

            {/* Therapist */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <User size={18} />
              </div>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>Therapist</p>
                <p className={styles.rowValue}>{formData.therapist?.name}</p>
                <p className={styles.rowSub}>{formData.therapist?.experience} experience</p>
              </div>
            </div>

            {/* Clinic */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <MapPin size={18} />
              </div>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>Clinic</p>
                <p className={styles.rowValue}>{formData.clinic?.name}</p>
                <p className={styles.rowSub}>{formData.clinic?.address}</p>
              </div>
            </div>

            {/* Date */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <Calendar size={18} />
              </div>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>Date</p>
                <p className={styles.rowValue}>{formData.date}</p>
              </div>
            </div>

            {/* Time */}
            <div className={styles.summaryRow}>
              <div className={styles.rowIcon}>
                <Clock size={18} />
              </div>
              <div className={styles.rowContent}>
                <p className={styles.rowLabel}>Time</p>
                <p className={styles.rowValue}>{formData.timeSlot?.time}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Notes */}
        <div className={styles.notesSection}>
          <label htmlFor="notes" className={styles.notesLabel}>
            Additional Notes (optional)
          </label>
          <textarea
            id="notes"
            className={styles.notesInput}
            placeholder="Any specific concerns or information for your therapist..."
            value={formData.notes}
            onChange={(e) => updateForm({ notes: e.target.value })}
          />
        </div>

        <p className={styles.disclaimer}>
          By confirming you agree to CORA's appointment policy.
          You can cancel up to 24 hours before your appointment.
        </p>

      </div>
    );
  }
);