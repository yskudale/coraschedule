// ============================================
// authSlice.ts
// The "auth drawer" in the central store.
// Manages: user, token, loading, error state.
// ============================================
import type { AppDispatch } from '@/store';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, LoginResponse, User } from './types/index';
import { STORAGE_KEYS, DEMO_PASSWORD, MOCK_DELAY_MS } from '@/constants';
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
    // ── MOCK (replace with real API call when backend is ready) ──
    // Real call will be:
    // const { data } = await client.post<LoginResponse>(
    //   ENDPOINTS.auth.login,
    //   credentials
    // );
    // return data;

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const match = MOCK_USERS[credentials.email];
    if (!match || credentials.password !== DEMO_PASSWORD) {
      return rejectWithValue('Invalid email or password.');
    }
    localStorage.setItem(STORAGE_KEYS.TOKEN, match.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(match.user));
    return match;
  } catch {
    return rejectWithValue('Something went wrong. Please try again.');
  }
}
);

export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  dispatch(logout());
};

// ─── Initial State ────────────────────────────────────────────────────────────
// ─── loadAuthFromStorage — reads persisted session safely ──────────────────
// Wrapped in a function instead of running at module-parse time.
// This means it only executes when the store is actually created,
// and the try/catch protects against corrupted or malformed
// localStorage data crashing the entire app on load.
function loadAuthFromStorage(): AuthState {
  try {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser  = localStorage.getItem(STORAGE_KEYS.USER);

    return {
      user:            storedUser ? (JSON.parse(storedUser) as User) : null,
      token:           storedToken ?? null,
      isAuthenticated: !!storedToken,
      isLoading:       false,
      error:           null,
    };
  } catch {
    // Corrupted JSON, localStorage unavailable (SSR/tests), etc —
    // fall back to a clean logged-out state instead of crashing.
    return {
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
    };
  }
}

const initialState: AuthState = loadAuthFromStorage();

// ─── The Slice ────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
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