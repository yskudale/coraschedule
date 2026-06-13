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
import { MOCK_DELAY_MS } from '@/constants';
import client from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';

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
    // ── MOCK (replace with real API call when backend is ready) ──
    // Real call will be:
    // const { data } = await client.get<Appointment[]>(
    //   ENDPOINTS.appointments.list
    // );
    // return data;

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
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
  setSelectedId(state, action: PayloadAction<string | null>) {
    state.selectedId = action.payload;
  },
  cancelAppointment(state, action: PayloadAction<string>) {
    const appointment = state.items.find(
      (item) => item.id === action.payload
    );
    if (appointment) {
      appointment.status = 'cancelled';
    }
  },
  addAppointment(state, action: PayloadAction<Appointment>) {
    state.items = [action.payload, ...state.items];
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
    // Only set items if store is empty — never overwrite existing data
    if (state.items.length === 0) {
      state.items = action.payload;
    }
  }
)
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload ?? 'Something went wrong.';
      });
  },
});


export const { setSelectedId, cancelAppointment, addAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;