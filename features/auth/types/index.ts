export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ResetPasswordInput {
  email: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
