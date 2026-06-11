// ============================================
// BookingModal.tsx
// The shell of the booking wizard.
// Controls which step renders.
// Wraps everything in BookingProvider so all
// steps share the same form state.
// ============================================

import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BookingProvider, useBooking } from '@/features/booking/context/BookingContext';
import { StepIndicator } from './StepIndicator';
import { Step1TherapyType } from './Step1TherapyType';
import { Step2ClinicTherapist } from './Step2ClinicTherapist';
import { Step3DateTime } from './Step3DateTime';
import { Step4Confirm } from './Step4Confirm';
import styles from './BookingModal.module.scss';

// ─── Step titles shown in modal header ───────────────────────────────────────
const STEP_TITLES = [
  { title: 'Select Therapy Type',    sub: 'What kind of therapy do you need?' },
  { title: 'Clinic & Therapist',     sub: 'Choose your preferred location and therapist' },
  { title: 'Date & Time',            sub: 'Pick an available appointment slot' },
  { title: 'Review & Confirm',       sub: 'Check your details before confirming' },
];

// ─── Inner modal — uses useBooking hook ──────────────────────────────────────
// Separate component because useBooking needs to be
// inside BookingProvider — cannot use it in the same
// component that renders the Provider.
function ModalInner({ onClose }: { onClose: () => void }) {
  const { currentStep, formData, goNext, goBack, resetBooking } = useBooking();

  const stepInfo  = STEP_TITLES[currentStep - 1];
  const isFirst   = currentStep === 1;
  const isLast    = currentStep === 4;

  // Decides if Next button is enabled based on current step selections
  const canProceed = () => {
    if (currentStep === 1) return formData.therapyType !== null;
    if (currentStep === 2) return formData.clinic !== null && formData.therapist !== null;
    if (currentStep === 3) return formData.date !== '' && formData.timeSlot !== null;
    return true;
  };

  const handleClose = () => {
    resetBooking();
    onClose();
  };

  const handleConfirm = () => {
    resetBooking();
    onClose();
  };

  // Render the correct step component
  const renderStep = () => {
    if (currentStep === 1) return <Step1TherapyType />;
    if (currentStep === 2) return <Step2ClinicTherapist />;
    if (currentStep === 3) return <Step3DateTime />;
    return <Step4Confirm onConfirm={handleConfirm} />;
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // Close if user clicks the dark backdrop — not the modal itself
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalTitle}>{stepInfo.title}</p>
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
        <StepIndicator currentStep={currentStep} totalSteps={4} />

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
              onClick={handleConfirm}
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