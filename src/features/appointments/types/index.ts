// ============================================
// Appointments Feature — TypeScript Interfaces
// Defines the shape of appointment data.
// Every appointments-related file uses these.
// ============================================

export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'in-progress';

export type TherapyType =
  | 'Physical Therapy'
  | 'Occupational Therapy'
  | 'Speech Therapy';

export interface Appointment {
  id: string;
  patientName: string;
  therapistName: string;
  therapyType: TherapyType;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  location: string;
  notes?: string;
}

export interface AppointmentsState {
  items: Appointment[];
  isLoading: boolean;
  error: string | null;
  selectedId: string | null;
}

export interface AppointmentFilters {
  search: string;
  status: AppointmentStatus | 'all';
  therapyType: TherapyType | 'all';
}