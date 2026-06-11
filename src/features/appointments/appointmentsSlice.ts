// ============================================
// appointmentsSlice.ts
// The "appointments drawer" in the Redux store.
// Manages: list of appointments, loading, error.
// This is the SECOND slice — works alongside
// authSlice in the same central store.
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppointmentsState, Appointment } from './types/index';
import { MOCK_APPOINTMENTS } from './mock/appointments';

// ─── Async Thunk: fetchAppointments ──────────────────────────────────────────
// Simulates an API call to load appointments.
// Later you replace MOCK_APPOINTMENTS with a real axios call.
export const fetchAppointments = createAsyncThunk<
  Appointment[],         // returns array of appointments on success
  void,                  // receives nothing as input (no params needed)
  { rejectValue: string }>(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return MOCK_APPOINTMENTS;
    } catch {
      return rejectWithValue('Failed to load appointments.');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: AppointmentsState = {
  items:      [],
  isLoading:  false,
  error:      null,
  selectedId: null,
};

// ─── The Slice ────────────────────────────────────────────────────────────────
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,

  reducers: {
    // Select one appointment (for detail view later)
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },

    // Cancel an appointment by id
    cancelAppointment(state, action: PayloadAction<string>) {
      const appointment = state.items.find(
        (item) => item.id === action.payload
      );
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.isLoading = false;
          state.items     = action.payload;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload ?? 'Something went wrong.';
      });
  },
});

export const { setSelectedId, cancelAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;