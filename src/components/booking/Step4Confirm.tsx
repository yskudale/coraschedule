// ============================================
// Step4Confirm.tsx
// Final step of booking wizard.
// Shows complete summary of all selections.
// User can add notes then confirm booking.
// On confirm — dispatches to Redux store.
// ============================================

import { CheckCircle, Activity, MapPin, User, Calendar, Clock } from 'lucide-react';
import { useBooking } from '@/features/booking/context/BookingContext';
import { useAppDispatch } from '@/hooks/redux';
import { addAppointment } from '@/features/appointments/appointmentsSlice';
import type { Appointment } from '@/features/appointments/types/index';
import styles from './Step4Confirm.module.scss';

interface Step4ConfirmProps {
  onConfirm: () => void;
}

export function Step4Confirm({ onConfirm }: Step4ConfirmProps) {
  const { formData, updateForm } = useBooking();
  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    // Build a new Appointment object from the booking form data
    const newAppointment: Appointment = {
      id:             `apt-${Date.now()}`,
      patientName:    'John Smith',
      therapistName:  formData.therapist?.name    ?? '',
      therapyType:    formData.therapyType        ?? 'Physical Therapy',
      date:           formData.date,
      time:           formData.timeSlot?.time     ?? '',
      duration:       60,
      status:         'scheduled',
      location:       formData.clinic?.name       ?? '',
      notes:          formData.notes || undefined,
    };

    // Add to Redux appointments store
    dispatch(addAppointment(newAppointment));

    // Close the modal
    onConfirm();
  };

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