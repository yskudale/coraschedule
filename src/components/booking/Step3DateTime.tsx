// ============================================
// Step3DateTime.tsx
// Third step of booking wizard.
// User picks a date and an available time slot.
// Available slots come from mock data.
// Unavailable slots are shown but disabled.
// ============================================

import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useBooking } from '@/features/booking/context/BookingContext';
import { MOCK_TIME_SLOTS } from '@/features/booking/mock/bookingData';
import type { TimeSlot } from '@/features/booking/types/index';
import styles from './Step3DateTime.module.scss';

export function Step3DateTime() {
  const { formData, updateForm } = useBooking();

  // ── Get today's date as minimum selectable date ───────────────────────────
  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When date changes reset time slot — slots may differ by date
    updateForm({ date: e.target.value, timeSlot: null });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    updateForm({ timeSlot: slot });
  };

  return (
    <div className={styles.wrapper}>

      {/* Date picker */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Select a date</p>

        <div className={styles.dateWrapper}>
          <Calendar size={18} className={styles.dateIcon} />
          <input
            type="date"
            className={styles.dateInput}
            value={formData.date}
            min={today}
            onChange={handleDateChange}
          />
        </div>

        <p className={styles.dateHint}>
          Available from today onwards. Weekends may have limited slots.
        </p>
      </div>

      {/* Time slots */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Select a time slot</p>

        <div className={styles.slotsGrid}>
          {MOCK_TIME_SLOTS.map((slot) => {
            const isSelected    = formData.timeSlot?.id === slot.id;
            const isUnavailable = !slot.available;

            return (
              <button
                key={slot.id}
                className={`${styles.slot} ${
                  isSelected    ? styles.slotSelected    : ''
                } ${
                  isUnavailable ? styles.slotUnavailable : ''
                }`}
                onClick={() => handleSlotSelect(slot)}
                disabled={isUnavailable}
                aria-pressed={isSelected}
                aria-label={`${slot.time} ${
                  isUnavailable ? '— unavailable' : '— available'
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected summary — shows when both date and time are picked */}
      {formData.date && formData.timeSlot && (
        <div className={styles.selectedSummary}>
          <CheckCircle size={18} className={styles.summaryIcon} />
          <span>
            Appointment set for{' '}
            <strong>{formData.date}</strong> at{' '}
            <strong>{formData.timeSlot.time}</strong>
          </span>
          <Clock size={14} className={styles.summaryIcon} />
        </div>
      )}

    </div>
  );
}