// ============================================
// Booking Feature — TypeScript Interfaces
// Defines the shape of data collected across
// all 4 steps of the booking wizard.
// ============================================

import type { TherapyType } from '@/features/appointments/types/index';

export type { TherapyType };

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface Therapist {
  id: string;
  name: string;
  specialization: TherapyType;
  clinicId: string;
  avatar: string;
  experience: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Shape of the entire booking form across all 4 steps
export interface BookingFormData {
  // Step 1
  therapyType: TherapyType | null;

  // Step 2
  clinic: Clinic | null;
  therapist: Therapist | null;

  // Step 3
  date: string;
  timeSlot: TimeSlot | null;

  // Step 4
  notes: string;
}

// Shape of the Context value — data + actions
export interface BookingContextValue {
  currentStep:  number;
  formData:     BookingFormData;
  goNext:       () => void;
  goBack:       () => void;
  updateForm:   (updates: Partial<BookingFormData>) => void;
  resetBooking: () => void;
}