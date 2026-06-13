// ============================================
// constants.ts
// Single source of truth for all magic strings,
// magic numbers, and repeated values.
// If a value appears more than once — it lives here.
// ============================================

// ─── localStorage keys ────────────────────────────────────────────────────────
// Used by authSlice to persist login session.
// Change the key name here — updates everywhere.
export const STORAGE_KEYS = {
  TOKEN: 'cora_token',
  USER:  'cora_user',
} as const;

// ─── Auth ─────────────────────────────────────────────────────────────────────
// Demo credentials — remove when real API is connected
export const DEMO_PASSWORD = 'cora123';

// ─── Booking ──────────────────────────────────────────────────────────────────
export const DEFAULT_APPOINTMENT_DURATION = 60; // minutes

// Shared step definitions — used by both BookingModal and StepIndicator
// One change here updates both components automatically
export const BOOKING_STEPS = [
  {
    label: 'Therapy Type',
    title: 'Select Therapy Type',
    sub:   'What kind of therapy do you need?',
  },
  {
    label: 'Clinic & Therapist',
    title: 'Clinic & Therapist',
    sub:   'Choose your preferred location and therapist',
  },
  {
    label: 'Date & Time',
    title: 'Date & Time',
    sub:   'Pick an available appointment slot',
  },
  {
    label: 'Confirm',
    title: 'Review & Confirm',
    sub:   'Check your details before confirming',
  },
] as const;

// ─── API ──────────────────────────────────────────────────────────────────────
// Fake delays — consistent across all mock thunks
export const MOCK_DELAY_MS = 800;