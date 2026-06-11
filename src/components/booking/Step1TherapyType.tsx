// ============================================
// Step1TherapyType.tsx
// First step of booking wizard.
// User selects which therapy type they need.
// Reads and writes to BookingContext.
// ============================================

import { Check } from 'lucide-react';
import { useBooking } from '@/features/booking/context/BookingContext';
import type { TherapyType } from '@/features/booking/types/index';
import styles from './Step1TherapyType.module.scss';

// ─── Therapy options with descriptions ───────────────────────────────────────
const THERAPY_OPTIONS: {
  type:  TherapyType;
  emoji: string;
  desc:  string;
}[] = [
  {
    type:  'Physical Therapy',
    emoji: '🦴',
    desc:  'Restores movement and function after injury, surgery, or illness. Helps with pain, mobility, and strength.',
  },
  {
    type:  'Occupational Therapy',
    emoji: '🖐️',
    desc:  'Helps you perform daily activities independently. Focuses on fine motor skills and functional recovery.',
  },
  {
    type:  'Speech Therapy',
    emoji: '🗣️',
    desc:  'Addresses speech, language, and swallowing difficulties. Helps restore clear communication.',
  },
];

export function Step1TherapyType() {
  const { formData, updateForm } = useBooking();

  const handleSelect = (type: TherapyType) => {
    updateForm({ therapyType: type });
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>Choose a therapy type</p>

      <div className={styles.cards}>
        {THERAPY_OPTIONS.map(({ type, emoji, desc }) => {
          const isSelected = formData.therapyType === type;

          return (
            <button
              key={type}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => handleSelect(type)}
              aria-pressed={isSelected}
            >
              {/* Icon */}
              <div
                className={`${styles.iconWrapper} ${
                  isSelected ? styles.iconWrapperSelected : ''
                }`}
              >
                {emoji}
              </div>

              {/* Text */}
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{type}</p>
                <p className={styles.cardDesc}>{desc}</p>
              </div>

              {/* Check circle */}
              <div
                className={`${styles.checkCircle} ${
                  isSelected ? styles.checkCircleSelected : ''
                }`}
              >
                {isSelected && <Check size={14} />}
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}