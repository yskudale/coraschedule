// ============================================
// Step2ClinicTherapist.tsx
// Second step of booking wizard.
// User selects clinic and therapist.
// Therapists filter by:
//   1. therapy type selected in Step 1
//   2. clinic selected in this step
// ============================================

import { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { useBooking } from '@/features/booking/context/BookingContext';
import { MOCK_CLINICS, MOCK_THERAPISTS } from '@/features/booking/mock/bookingData';
import type { Clinic, Therapist } from '@/features/booking/types/index';
import styles from './Step2ClinicTherapist.module.scss';

export function Step2ClinicTherapist() {
  const { formData, updateForm } = useBooking();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleClinicSelect = (clinic: Clinic) => {
    // When clinic changes reset therapist — previous selection invalid
    updateForm({ clinic, therapist: null });
  };

  const handleTherapistSelect = (therapist: Therapist) => {
    updateForm({ therapist });
  };

  // ── Filter therapists ──────────────────────────────────────────────────────
  // Only show therapists that match BOTH:
  // - therapy type from Step 1
  // - clinic selected in this step
  const availableTherapists = useMemo(() => {
    if (!formData.clinic) return [];

    return MOCK_THERAPISTS.filter(
      (t) =>
        t.clinicId        === formData.clinic?.id &&
        t.specialization  === formData.therapyType
    );
  }, [formData.clinic, formData.therapyType]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>

      {/* Section 1 — Clinic selection */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Select a clinic</p>

        {MOCK_CLINICS.map((clinic) => {
          const isSelected = formData.clinic?.id === clinic.id;

          return (
            <button
              key={clinic.id}
              className={`${styles.clinicCard} ${
                isSelected ? styles.clinicCardSelected : ''
              }`}
              onClick={() => handleClinicSelect(clinic)}
              aria-pressed={isSelected}
            >
              <div className={styles.clinicIcon}>
                <MapPin size={20} />
              </div>
              <div className={styles.clinicInfo}>
                <p className={styles.clinicName}>{clinic.name}</p>
                <p className={styles.clinicAddress}>{clinic.address}</p>
                <p className={styles.clinicPhone}>{clinic.phone}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section 2 — Therapist selection */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          Select a therapist
          {formData.therapyType && ` — ${formData.therapyType}`}
        </p>

        {!formData.clinic && (
          <div className={styles.empty}>
            Please select a clinic first to see available therapists.
          </div>
        )}

        {formData.clinic && availableTherapists.length === 0 && (
          <div className={styles.empty}>
            No therapists available at this clinic for {formData.therapyType}.
            Please try a different clinic.
          </div>
        )}

        {availableTherapists.length > 0 && (
          <div className={styles.therapistGrid}>
            {availableTherapists.map((therapist) => {
              const isSelected = formData.therapist?.id === therapist.id;

              return (
                <button
                  key={therapist.id}
                  className={`${styles.therapistCard} ${
                    isSelected ? styles.therapistCardSelected : ''
                  }`}
                  onClick={() => handleTherapistSelect(therapist)}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`${styles.avatar} ${
                      isSelected ? styles.avatarSelected : ''
                    }`}
                  >
                    {therapist.avatar}
                  </div>
                  <p className={styles.therapistName}>{therapist.name}</p>
                  <p className={styles.therapistExp}>{therapist.experience}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}