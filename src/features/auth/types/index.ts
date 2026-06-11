// ============================================
// Auth Feature — TypeScript Interfaces
// These are the "shapes" of our data.
// Every auth-related file in the app uses these.
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'admin' | 'staff';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}