// ============================================
// authSlice.ts
// The "auth drawer" in the central store.
// Manages: user, token, loading, error state.
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, LoginResponse, User } from './types/index';

// ─── Mock Data (replace with real API later) ─────────────────────────────────
const MOCK_USERS: Record<string, LoginResponse> = {
  'patient@cora.com': {
    user: { id: '1', name: 'John Smith', email: 'patient@cora.com', role: 'patient' },
    token: 'mock-patient-token-xyz',
  },
  'admin@cora.com': {
    user: { id: '2', name: 'Dr. Sarah Lee', email: 'admin@cora.com', role: 'admin' },
    token: 'mock-admin-token-xyz',
  },
};

// ─── Async Thunk: loginUser ───────────────────────────────────────────────────
export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const match = MOCK_USERS[credentials.email];
      if (!match || credentials.password !== 'cora123') {
        return rejectWithValue('Invalid email or password.');
      }

      localStorage.setItem('cora_token', match.token);
      localStorage.setItem('cora_user', JSON.stringify(match.user));

      return match;
    } catch {
      return rejectWithValue('Something went wrong. Please try again.');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────
const storedToken = localStorage.getItem('cora_token');
const storedUser  = localStorage.getItem('cora_user');

const initialState: AuthState = {
  user:            storedUser ? (JSON.parse(storedUser) as User) : null,
  token:           storedToken ?? null,
  isAuthenticated: !!storedToken,
  isLoading:       false,
  error:           null,
};

// ─── The Slice ────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout(state) {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.error           = null;
      localStorage.removeItem('cora_token');
      localStorage.removeItem('cora_user');
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading       = false;
        state.isAuthenticated = true;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload ?? 'Login failed.';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;