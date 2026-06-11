// ============================================
// mock/bookingData.ts
// Fake clinics, therapists, and time slots.
// Used by Step 2 and Step 3 of booking wizard.
// ============================================

import type { Clinic, Therapist, TimeSlot } from '../types/index';

export const MOCK_CLINICS: Clinic[] = [
  {
    id: 'clinic-001',
    name: 'CORA Clinic — Downtown',
    address: '123 Main Street, Suite 100',
    city: 'Miami, FL',
    phone: '(305) 555-0101',
  },
  {
    id: 'clinic-002',
    name: 'CORA Clinic — Westside',
    address: '456 West Avenue, Suite 200',
    city: 'Miami, FL',
    phone: '(305) 555-0202',
  },
  {
    id: 'clinic-003',
    name: 'CORA Clinic — Eastside',
    address: '789 East Boulevard, Suite 300',
    city: 'Miami, FL',
    phone: '(305) 555-0303',
  },
  {
    id: 'clinic-004',
    name: 'CORA Clinic — North Miami',
    address: '321 North Road, Suite 150',
    city: 'North Miami, FL',
    phone: '(305) 555-0404',
  },
];

export const MOCK_THERAPISTS: Therapist[] = [
  {
    id: 'therapist-001',
    name: 'Dr. Sarah Lee',
    specialization: 'Physical Therapy',
    clinicId: 'clinic-001',
    avatar: 'SL',
    experience: '8 years',
  },
  {
    id: 'therapist-002',
    name: 'Dr. James Carter',
    specialization: 'Physical Therapy',
    clinicId: 'clinic-002',
    avatar: 'JC',
    experience: '12 years',
  },
  {
    id: 'therapist-003',
    name: 'Dr. Mike Torres',
    specialization: 'Occupational Therapy',
    clinicId: 'clinic-001',
    avatar: 'MT',
    experience: '6 years',
  },
  {
    id: 'therapist-004',
    name: 'Dr. Priya Sharma',
    specialization: 'Occupational Therapy',
    clinicId: 'clinic-003',
    avatar: 'PS',
    experience: '10 years',
  },
  {
    id: 'therapist-005',
    name: 'Dr. Amy Chen',
    specialization: 'Speech Therapy',
    clinicId: 'clinic-002',
    avatar: 'AC',
    experience: '7 years',
  },
  {
    id: 'therapist-006',
    name: 'Dr. Robert King',
    specialization: 'Speech Therapy',
    clinicId: 'clinic-004',
    avatar: 'RK',
    experience: '15 years',
  },
  {
    id: 'therapist-007',
    name: 'Dr. Lisa Park',
    specialization: 'Physical Therapy',
    clinicId: 'clinic-003',
    avatar: 'LP',
    experience: '5 years',
  },
  {
    id: 'therapist-008',
    name: 'Dr. David Nair',
    specialization: 'Occupational Therapy',
    clinicId: 'clinic-004',
    avatar: 'DN',
    experience: '9 years',
  },
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-001', time: '09:00 AM', available: true  },
  { id: 'slot-002', time: '09:30 AM', available: false },
  { id: 'slot-003', time: '10:00 AM', available: true  },
  { id: 'slot-004', time: '10:30 AM', available: true  },
  { id: 'slot-005', time: '11:00 AM', available: false },
  { id: 'slot-006', time: '11:30 AM', available: true  },
  { id: 'slot-007', time: '12:00 PM', available: true  },
  { id: 'slot-008', time: '01:00 PM', available: true  },
  { id: 'slot-009', time: '01:30 PM', available: false },
  { id: 'slot-010', time: '02:00 PM', available: true  },
  { id: 'slot-011', time: '02:30 PM', available: true  },
  { id: 'slot-012', time: '03:00 PM', available: false },
  { id: 'slot-013', time: '03:30 PM', available: true  },
  { id: 'slot-014', time: '04:00 PM', available: true  },
];