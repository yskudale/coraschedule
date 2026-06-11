// ============================================
// store/index.ts
// The Central Records Room.
// All slices (drawers) are registered here.
// Every component reads from and writes to this.
// ============================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // future slices added here:
    // appointments: appointmentsReducer,
    // clinics: clinicsReducer,
  },
});

// These two types describe the exact shape of your store
// and the type of dispatch — used by typed hooks
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;