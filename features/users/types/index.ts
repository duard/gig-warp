export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UpdateUserProfileInput {
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  preferences?: Partial<UserPreferences>;
}
