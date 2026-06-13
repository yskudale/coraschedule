// ============================================
// api/endpoints.ts
// All API URL strings in one place.
// Never hardcode URLs inside thunks or components.
// Change a URL here — updates everywhere.
// ============================================

export const ENDPOINTS = {

  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    login:   '/auth/login',
    logout:  '/auth/logout',
    me:      '/auth/me',
    refresh: '/auth/refresh',
  },

  // ── Appointments ───────────────────────────────────────────────────────────
  appointments: {
    list:       '/appointments',
    create:     '/appointments',
    byId:       (id: string) => `/appointments/${id}`,
    cancel:     (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
  },

  // ── Clinics ────────────────────────────────────────────────────────────────
  clinics: {
    list:  '/clinics',
    byId:  (id: string) => `/clinics/${id}`,
  },

  // ── Therapists ─────────────────────────────────────────────────────────────
  therapists: {
    list:        '/therapists',
    byId:        (id: string) => `/therapists/${id}`,
    byClinic:    (clinicId: string) => `/clinics/${clinicId}/therapists`,
    slots:       (id: string) => `/therapists/${id}/slots`,
  },

} as const;