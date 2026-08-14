// ─── Auth & User Types ─────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  isActive?: boolean;
  role: UserRole;
  schoolId?: string;
  school?: School;
  lastLogin?: string;
  customerId?: string;
}

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'VIEWER';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── School ────────────────────────────────────────────────
export interface School {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  fasId?: string;
  agreementPeriod?: string;
  modelType?: string;
  modelYear?: string;
}
