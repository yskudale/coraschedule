// ============================================
// StepIndicator.tsx
// Shows progress through the booking wizard.
// Step circles + connecting lines.
// Done steps → teal. Active step → green.
// Future steps → grey.
// ============================================

import { Check } from 'lucide-react';
import styles from './StepIndicator.module.scss';
import { BOOKING_STEPS } from '@/constants';


const STEP_LABELS = BOOKING_STEPS.map((s) => s.label);

interface StepIndicatorProps {
  currentStep: number;
  totalSteps:  number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isDone     = stepNumber < currentStep;
        const isActive   = stepNumber === currentStep;

        return (
          <div key={stepNumber} className={styles.step}>

            {/* Circle */}
            <div
              className={`${styles.circle} ${
                isDone   ? styles.circleDone   :
                isActive ? styles.circleActive : ''
              }`}
            >
              {isDone ? <Check size={14} /> : stepNumber}
            </div>

            {/* Label */}
            <span
              className={`${styles.label} ${
                isActive ? styles.labelActive : ''
              }`}
            >
              {STEP_LABELS[index]}
            </span>

            {/* Connecting line — not after last step */}
            {stepNumber < totalSteps && (
              <div
                className={`${styles.line} ${
                  isDone ? styles.lineDone : ''
                }`}
              />
            )}

          </div>
        );
      })}
    </div>
  );
}