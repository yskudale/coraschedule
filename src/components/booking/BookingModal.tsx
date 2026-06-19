// ============================================
// BookingModal.tsx
// The shell of the booking wizard.
// Controls which step renders.
// Wraps everything in BookingProvider so all
// steps share the same form state.
// Holds a ref to Step4Confirm so the footer's
// Confirm button can trigger its dispatch logic
// directly — no boolean flag, no useEffect.
// ============================================

import { useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BookingProvider, useBooking } from '@/features/booking/context/BookingContext';
import { BOOKING_STEPS } from '@/constants';
import { StepIndicator } from './StepIndicator';
import { Step1TherapyType } from './Step1TherapyType';
import { Step2ClinicTherapist } from './Step2ClinicTherapist';
import { Step3DateTime } from './Step3DateTime';
import { Step4Confirm } from './Step4Confirm';
import type { Step4ConfirmHandle } from './Step4Confirm';
import styles from './BookingModal.module.scss';

// ─── Inner modal — uses useBooking hook ──────────────────────────────────────
// Separate component because useBooking needs to be
// inside BookingProvider — cannot use it in the same
// component that renders the Provider.
function ModalInner({ onClose }: { onClose: () => void }) {
  const { currentStep, formData, goNext, goBack, resetBooking } = useBooking();

  // Ref to Step4Confirm — lets the footer button call its confirm() method
  const step4Ref = useRef<Step4ConfirmHandle>(null);

  const stepInfo  = BOOKING_STEPS[currentStep - 1];
  const isFirst   = currentStep === 1;
  const isLast    = currentStep === BOOKING_STEPS.length;

// Each step's completion rule lives here, keyed by step number.
// Adding a new step means adding one entry here — nothing else
// needs to change for validation to work correctly.
const STEP_VALIDATORS: Record<number, (data: typeof formData) => boolean> = {
  1: (data) => data.therapyType !== null,
  2: (data) => data.clinic !== null && data.therapist !== null,
  3: (data) => data.date !== '' && data.timeSlot !== null,
};

const canProceed = () => {
  const validator = STEP_VALIDATORS[currentStep];
  return validator ? validator(formData) : true;
};

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  // Called when Step4 finishes dispatching — resets wizard and closes modal
  const handleStepConfirmed = () => {
    resetBooking();
    onClose();
  };

  // Footer Confirm button — calls Step4Confirm's exposed confirm() method
  const handleFooterConfirmClick = () => {
    step4Ref.current?.confirm();
  };

  // Render the correct step component
  const renderStep = () => {
    if (currentStep === 1) return <Step1TherapyType />;
    if (currentStep === 2) return <Step2ClinicTherapist />;
    if (currentStep === 3) return <Step3DateTime />;
    return <Step4Confirm ref={step4Ref} onConfirm={handleStepConfirmed} />;
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        // Close if user clicks the dark backdrop — not the modal itself
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <p id="booking-modal-title" className={styles.modalTitle}>
              {stepInfo.title}
            </p>
            <p className={styles.modalSub}>{stepInfo.sub}</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close booking"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={BOOKING_STEPS.length} />

        {/* Step content */}
        <div className={styles.modalBody}>
          {renderStep()}
        </div>

        {/* Footer navigation */}
        <div className={styles.modalFooter}>
          {!isFirst && (
            <button className={styles.backBtn} onClick={goBack}>
              <ChevronLeft size={16} />
              Back
            </button>
          )}

          {!isLast && (
            <button
              className={styles.nextBtn}
              onClick={goNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}

          {isLast && (
            <button
              className={styles.confirmBtn}
              onClick={handleFooterConfirmClick}
            >
              <Check size={16} />
              Confirm Booking
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Main export — wraps ModalInner in BookingProvider ───────────────────────
interface BookingModalProps {
  onClose: () => void;
}

export function BookingModal({ onClose }: BookingModalProps) {
  return (
    <BookingProvider>
      <ModalInner onClose={onClose} />
    </BookingProvider>
  );
}