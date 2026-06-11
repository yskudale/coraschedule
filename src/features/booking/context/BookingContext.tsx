// ============================================
// BookingContext.tsx
// Shares booking form state across all 4 steps.
// Without this, you would pass props 4 levels deep.
// With this, any step reads and updates form data
// directly — no prop drilling.
// ============================================

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BookingContextValue, BookingFormData } from '../types/index';

// ─── Initial form data — everything empty/null ────────────────────────────────
const initialFormData: BookingFormData = {
  therapyType: null,
  clinic:      null,
  therapist:   null,
  date:        '',
  timeSlot:    null,
  notes:       '',
};

// ─── Create the Context ───────────────────────────────────────────────────────
// null default — will be provided by BookingProvider below
const BookingContext = createContext<BookingContextValue | null>(null);

// ─── Provider Component ───────────────────────────────────────────────────────
// Wrap the booking modal in this — all steps inside get access
export function BookingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData]       = useState<BookingFormData>(initialFormData);

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateForm = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        formData,
        goNext,
        goBack,
        updateForm,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
// Always use this instead of useContext(BookingContext) directly.
// It handles the null check so components never crash.
export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used inside BookingProvider');
  }
  return context;
}